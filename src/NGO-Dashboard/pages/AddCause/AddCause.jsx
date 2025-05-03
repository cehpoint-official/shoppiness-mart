import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db, storage } from "../../../../firebase.js";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Loader, Upload, Info, AlertTriangle } from "lucide-react";

const AddCause = () => {
	const { id } = useParams();
	const [ngo, setNgo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [causes, setCauses] = useState([]);
	const [editingCause, setEditingCause] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [causeToDelete, setCauseToDelete] = useState(null);
	const [uploadProgress, setUploadProgress] = useState("");

	const [causeForm, setCauseForm] = useState({
		causeName: "",
		aboutCause: "",
		shortDesc: "",
		category: "",
		type: "",
		location: "",
		pincode: "",
		logoUrl: "",
		bannerUrl: "",
		status: "active",
	});

	const [logoFile, setLogoFile] = useState(null);
	const [bannerFile, setBannerFile] = useState(null);

	useEffect(() => {
		const fetchNGO = async () => {
			try {
				const ngoDoc = await getDoc(doc(db, "causeDetails", id));
				if (!ngoDoc.exists()) {
					toast.error("NGO not found!");
					return;
				}

				const ngoData = ngoDoc.data();
				setNgo(ngoData);
				setCauses(ngoData.causes || []);
				setLoading(false);
			} catch (error) {
				toast.error("Error fetching NGO details");
				console.error("Error fetching NGO:", error);
				setLoading(false);
			}
		};

		fetchNGO();
	}, [id]);

	const resetForm = () => {
		setCauseForm({
			causeName: "",
			aboutCause: "",
			shortDesc: "",
			category: "",
			type: "",
			location: "",
			pincode: "",
			logoUrl: "",
			bannerUrl: "",
			status: "active",
		});
		setLogoFile(null);
		setBannerFile(null);
		setEditingCause(null);
		setUploadProgress("");
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCauseForm(prev => ({
			...prev,
			[name]: value
		}));
	};

	const validateFileFormat = (file) => {
		const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
		if (!allowedFormats.includes(file.type)) {
			toast.error("Only .png, .jpeg, and .jpg formats are allowed.");
			return false;
		}
		return true;
	};

	const handleFileChange = (e, type) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!validateFileFormat(file)) {
			return;
		}

		if (type === "logo") {
			setLogoFile(file);
		} else {
			setBannerFile(file);
		}
	};

	const uploadFile = async (file) => {
		if (!file) return null;

		return new Promise((resolve, reject) => {
			const metadata = {
				contentType: file.type,
			};

			const storageRef = ref(storage, `images/causes/${file.name}_${Date.now()}`);
			const uploadTask = uploadBytesResumable(storageRef, file, metadata);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setUploadProgress(`Uploading: ${Math.round(progress)}%`);
				},
				(error) => {
					console.error("Upload error:", error);
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						setUploadProgress("");
						resolve(downloadURL);
					});
				}
			);
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setSubmitting(true);

			let logoUrl = causeForm.logoUrl;
			let bannerUrl = causeForm.bannerUrl;

			if (logoFile) {
				logoUrl = await uploadFile(logoFile);
			}

			if (bannerFile) {
				bannerUrl = await uploadFile(bannerFile);
			}

			const causeData = {
				...causeForm,
				logoUrl,
				bannerUrl,
				createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
			};

			if (editingCause) {
				// Update existing cause
				const updatedCauses = causes.map(cause =>
					cause.id === editingCause.id
						? { ...cause, ...causeData, id: editingCause.id }
						: cause
				);

				await updateDoc(doc(db, "causeDetails", id), {
					causes: updatedCauses
				});

				setCauses(updatedCauses);
				toast.success("Cause updated successfully!");
			} else {
				// Add new cause
				const newCause = {
					...causeData,
					id: uuidv4(),
					totalDonationAmount: 0,
				};

				await updateDoc(doc(db, "causeDetails", id), {
					causes: arrayUnion(newCause)
				});

				setCauses(prev => [...prev, newCause]);
				toast.success("Cause added successfully!");
			}

			resetForm();
		} catch (error) {
			console.error("Error submitting cause:", error);
			toast.error("Failed to save cause. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleEdit = (cause) => {
		setEditingCause(cause);
		setCauseForm({
			causeName: cause.causeName,
			aboutCause: cause.aboutCause,
			shortDesc: cause.shortDesc,
			category: cause.category,
			type: cause.type || "",
			location: cause.location,
			pincode: cause.pincode,
			logoUrl: cause.logoUrl,
			bannerUrl: cause.bannerUrl,
			status: cause.status || "active",
		});

		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const promptDelete = (cause) => {
		setCauseToDelete(cause);
		setShowDeleteModal(true);
	};

	const handleDelete = async () => {
		if (!causeToDelete) return;

		try {
			setSubmitting(true);

			// Find and remove the cause
			const causeToRemove = causes.find(c => c.id === causeToDelete.id);
			if (!causeToRemove) {
				toast.error("Cause not found!");
				return;
			}

			const updatedCauses = causes.filter(c => c.id !== causeToDelete.id);

			await updateDoc(doc(db, "causeDetails", id), {
				causes: updatedCauses
			});

			setCauses(updatedCauses);
			setShowDeleteModal(false);
			setCauseToDelete(null);
			toast.success("Cause deleted successfully");
		} catch (error) {
			console.error("Error deleting cause:", error);
			toast.error("Failed to delete cause");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-50">
				<div className="text-center">
					<Loader className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
					<p className="mt-4 text-lg text-gray-600">Loading NGO details...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 px-4 md:px-8">
				<div className="max-w-7xl mx-auto">
					<Link
						to={`/ngo-dashboard/${id}/dashboard`}
						className="inline-flex items-center px-4 py-2 mb-6 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-white"
					>
						<ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
					</Link>

					<h1 className="text-3xl md:text-4xl font-bold">{ngo?.causeName}</h1>
					<p className="mt-2 text-lg opacity-90">Manage your causes and make a difference</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Form Section */}
					<div className="lg:col-span-5">
						<div className="bg-white rounded-xl shadow-md overflow-hidden">
							<div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
								<h2 className="text-xl font-semibold text-gray-800">
									{editingCause ? 'Edit Cause' : 'Add New Cause'}
								</h2>
							</div>

							<form onSubmit={handleSubmit} className="px-6 py-6">
								<div className="space-y-5">
									<div>
										<label htmlFor="causeName" className="block text-sm font-medium text-gray-700 mb-1">Cause Name*</label>
										<input
											type="text"
											id="causeName"
											name="causeName"
											value={causeForm.causeName}
											onChange={handleInputChange}
											required
											placeholder="Enter cause name"
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Cause Type*</label>
										<div className="flex items-center space-x-4 mt-1">
											<label className="inline-flex items-center">
												<input
													type="radio"
													name="type"
													value="individual"
													checked={causeForm.type === "individual"}
													onChange={handleInputChange}
													required
													className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
												/>
												<span className="ml-2 text-sm text-gray-700">Individual</span>
											</label>
											<label className="inline-flex items-center">
												<input
													type="radio"
													name="type"
													value="organisation"
													checked={causeForm.type === "organisation"}
													onChange={handleInputChange}
													required
													className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
												/>
												<span className="ml-2 text-sm text-gray-700">Group / Organisation</span>
											</label>
										</div>
									</div>

									<div>
										<label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
										<select
											id="category"
											name="category"
											value={causeForm.category}
											onChange={handleInputChange}
											required
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										>
											<option value="">Select category</option>
											<option value="one">One</option>
											<option value="two">Two</option>
											<option value="three">Three</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
										<div className="flex items-center space-x-4 mt-1">
											<label className="inline-flex items-center">
												<input
													type="radio"
													name="status"
													value="active"
													checked={causeForm.status === "active"}
													onChange={handleInputChange}
													required
													className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
												/>
												<span className="ml-2 text-sm text-gray-700">Active</span>
											</label>
											<label className="inline-flex items-center">
												<input
													type="radio"
													name="status"
													value="inactive"
													checked={causeForm.status === "inactive"}
													onChange={handleInputChange}
													required
													className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
												/>
												<span className="ml-2 text-sm text-gray-700">Inactive</span>
											</label>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
											<input
												type="text"
												id="location"
												name="location"
												value={causeForm.location}
												onChange={handleInputChange}
												required
												placeholder="City, State"
												className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											/>
										</div>

										<div>
											<label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode*</label>
											<input
												type="text"
												id="pincode"
												name="pincode"
												value={causeForm.pincode}
												onChange={handleInputChange}
												required
												placeholder="Enter pincode"
												pattern="[0-9]{6}"
												title="Please enter a valid 6-digit pincode"
												className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											/>
										</div>
									</div>

									<div>
										<label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700 mb-1">Short Description*</label>
										<textarea
											id="shortDesc"
											name="shortDesc"
											value={causeForm.shortDesc}
											onChange={handleInputChange}
											required
											placeholder="Brief description (100-150 words)"
											rows="3"
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										></textarea>
									</div>

									<div>
										<label htmlFor="aboutCause" className="block text-sm font-medium text-gray-700 mb-1">About Cause*</label>
										<textarea
											id="aboutCause"
											name="aboutCause"
											value={causeForm.aboutCause}
											onChange={handleInputChange}
											required
											placeholder="Detailed description of the cause"
											rows="5"
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										></textarea>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Logo Image</label>
											<div className="relative">
												<input
													type="file"
													id="logoFile"
													onChange={(e) => handleFileChange(e, "logo")}
													accept="image/png,image/jpeg,image/jpg"
													className="sr-only"
												/>
												<label
													htmlFor="logoFile"
													className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
												>
													<Upload className="w-4 h-4 mr-2" />
													{logoFile ? logoFile.name.substring(0, 20) + (logoFile.name.length > 20 ? '...' : '') : "Choose Logo File"}
												</label>
											</div>
											{editingCause && causeForm.logoUrl && !logoFile && (
												<div className="mt-3 flex items-center space-x-3">
													<div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
														<img src={causeForm.logoUrl} alt="Current logo" className="w-full h-full object-cover" />
													</div>
													<p className="text-sm text-gray-600">Current logo</p>
												</div>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
											<div className="relative">
												<input
													type="file"
													id="bannerFile"
													onChange={(e) => handleFileChange(e, "banner")}
													accept="image/png,image/jpeg,image/jpg"
													className="sr-only"
												/>
												<label
													htmlFor="bannerFile"
													className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
												>
													<Upload className="w-4 h-4 mr-2" />
													{bannerFile ? bannerFile.name.substring(0, 20) + (bannerFile.name.length > 20 ? '...' : '') : "Choose Banner File"}
												</label>
											</div>
											{editingCause && causeForm.bannerUrl && !bannerFile && (
												<div className="mt-3 flex items-center space-x-3">
													<div className="w-16 h-10 rounded overflow-hidden bg-gray-100">
														<img src={causeForm.bannerUrl} alt="Current banner" className="w-full h-full object-cover" />
													</div>
													<p className="text-sm text-gray-600">Current banner</p>
												</div>
											)}
										</div>
									</div>
								</div>

								{uploadProgress && (
									<div className="mt-6">
										<p className="text-sm font-medium text-blue-600 mb-1">{uploadProgress}</p>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-blue-600 h-2 rounded-full"
												style={{ width: uploadProgress.replace(/[^\d]/g, '') + '%' }}
											></div>
										</div>
									</div>
								)}

								<div className="mt-6 flex items-center justify-end space-x-3">
									{editingCause && (
										<button
											type="button"
											className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
											onClick={resetForm}
										>
											Cancel
										</button>
									)}

									<button
										type="submit"
										className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${submitting ? 'opacity-75 cursor-not-allowed' : ''}`}
										disabled={submitting}
									>
										{submitting ? (
											<>
												<Loader className="w-4 h-4 mr-2 animate-spin" />
												{editingCause ? 'Updating...' : 'Adding...'}
											</>
										) : (
											<>
												{editingCause ? (
													<><Pencil className="w-4 h-4 mr-2" /> Update Cause</>
												) : (
													<><Plus className="w-4 h-4 mr-2" /> Add Cause</>
												)}
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>

					{/* Causes List Section */}
					<div className="lg:col-span-7">
						<div className="bg-white rounded-xl shadow-md overflow-hidden">
							<div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
								<h2 className="text-xl font-semibold text-gray-800">Your Causes</h2>
								<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
									{causes.length} {causes.length === 1 ? 'Cause' : 'Causes'}
								</span>
							</div>

							<div className="px-6 py-6">
								{causes.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<div className="bg-blue-50 p-3 rounded-full">
											<Info className="w-8 h-8 text-blue-500" />
										</div>
										<h3 className="mt-4 text-lg font-medium text-gray-900">No causes yet</h3>
										<p className="mt-1 text-sm text-gray-500 max-w-sm">
											Add your first cause using the form to start making a difference.
										</p>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{causes.map((cause) => (
											<div
												key={cause.id}
												className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
											>
												{cause.bannerUrl && (
													<div className="h-36 overflow-hidden">
														<img
															src={cause.bannerUrl}
															alt={cause.causeName}
															className="w-full h-full object-cover"
														/>
													</div>
												)}

												<div className="p-5">
													<div className="flex items-center mb-4">
														{cause.logoUrl && (
															<div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100 mr-3 border border-gray-200">
																<img
																	src={cause.logoUrl}
																	alt={cause.causeName}
																	className="h-full w-full object-cover"
																/>
															</div>
														)}
														<h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{cause.causeName}</h3>
													</div>

													<div className="space-y-3">
														<div className="flex flex-wrap items-center gap-2">
															<div className="text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
																{cause.category}
															</div>

															<div className="text-xs hidden sm:block text-gray-500">•</div>

															<div className={`text-xs inline-flex items-center px-2.5 py-0.5 rounded-full ${cause.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
																}`}>
																{cause.status === "active" ? "Active" : "Inactive"}
															</div>

															<div className="text-xs hidden sm:block text-gray-500">•</div>

															<div className="text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
																{cause.type === "individual" ? "Individual" : "Group / Organisation"}
															</div>

															<div className="text-xs hidden sm:block text-gray-500">•</div>

															<div className="text-xs text-gray-500 mt-1 sm:mt-0">
																{cause.location}, {cause.pincode}
															</div>
														</div>

														<p className="text-sm text-gray-600 line-clamp-3">
															{cause.shortDesc}
														</p>

														<div className="flex items-center justify-between pt-2">
															<p className="text-xs text-gray-500">Created: {cause.createdDate}</p>

															<div className="flex space-x-2">
																<button
																	onClick={() => handleEdit(cause)}
																	className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
																	title="Edit cause"
																>
																	<Pencil className="w-4 h-4" />
																</button>
																<button
																	onClick={() => promptDelete(cause)}
																	className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
																	title="Delete cause"
																>
																	<Trash2 className="w-4 h-4" />
																</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full">
						<div className="p-6">
							<div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-red-100 mb-4">
								<AlertTriangle className="h-6 w-6 text-red-600" />
							</div>
							<h3 className="text-lg font-medium text-center text-gray-900 mb-2">Confirm Deletion</h3>
							<p className="text-center text-gray-600 mb-4">
								Are you sure you want to delete <span className="font-semibold">{causeToDelete?.causeName}</span>?
							</p>
							<p className="text-sm text-center text-red-600 mb-6">
								This action cannot be undone.
							</p>

							<div className="flex items-center justify-center space-x-4">
								<button
									className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
									onClick={() => setShowDeleteModal(false)}
									disabled={submitting}
								>
									Cancel
								</button>
								<button
									className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center min-w-[100px]"
									onClick={handleDelete}
									disabled={submitting}
								>
									{submitting ? (
										<>
											<Loader className="w-4 h-4 mr-2 animate-spin" />
											Deleting...
										</>
									) : (
										'Delete'
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddCause;