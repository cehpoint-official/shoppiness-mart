import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { storage, db } from '../../../../firebase';
import { Camera, Upload, X, Image, Check, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Gallery = () => {
	const { id } = useParams(); // Get ngoId from URL parameters
	const [files, setFiles] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState({});
	const [uploadedImages, setUploadedImages] = useState([]);
	const [dragActive, setDragActive] = useState(false);
	const [deleting, setDeleting] = useState({});
	const [refreshing, setRefreshing] = useState(false);
	// Add state for delete confirmation modal
	const [deleteModal, setDeleteModal] = useState({
		show: false,
		imageToDelete: null
	});

	// Fetch existing images for this NGO
	const fetchImages = async () => {
		try {
			setRefreshing(true);
			const ngoGalleryDocRef = doc(db, "ngoGallery", id);
			const docSnap = await getDoc(ngoGalleryDocRef);

			if (docSnap.exists()) {
				const galleryData = docSnap.data();
				// Check if the items array exists, if not use an empty array
				const images = galleryData.items || [];
				setUploadedImages(images);
			} else {
				// Document doesn't exist yet, set empty array
				setUploadedImages([]);
			}
		} catch (error) {
			console.error("Error fetching images:", error);
			toast.error("Failed to load gallery images");
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		if (id) {
			fetchImages();
		}
	}, [id]);

	// Generate previews when files are selected
	useEffect(() => {
		if (!files.length) return;

		const newPreviews = [];
		files.forEach(file => {
			const reader = new FileReader();
			reader.onloadend = () => {
				newPreviews.push({
					id: Math.random().toString(36).substring(2),
					file,
					preview: reader.result
				});
				if (newPreviews.length === files.length) {
					setPreviews(prev => [...prev, ...newPreviews]);
				}
			};
			reader.readAsDataURL(file);
		});
	}, [files]);

	const handleFileChange = (e) => {
		if (e.target.files) {
			setFiles(Array.from(e.target.files));
			//   toast.success(`${e.target.files.length} image(s) selected`);
		}
	};

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setFiles(Array.from(e.dataTransfer.files));
			toast.success(`${e.dataTransfer.files.length} image(s) dropped and ready for upload`);
		}
	};

	const removePreview = (id) => {
		setPreviews(previews.filter(preview => preview.id !== id));
		toast.success("Image removed from selection");
	};

	// Show delete confirmation modal
	const confirmDeleteImage = (image) => {
		setDeleteModal({
			show: true,
			imageToDelete: image
		});
	};

	// Handle actual deletion
	const deleteImage = async (image) => {
		setDeleteModal({ show: false, imageToDelete: null });
		setDeleting(prev => ({ ...prev, [image.imageId]: true }));

		try {
			// First delete the file from Storage
			const imageRef = ref(storage, image.imageUrl);
			await deleteObject(imageRef);

			// Then update the document in Firestore to remove the image from the items array
			const ngoGalleryDocRef = doc(db, "ngoGallery", id);
			await updateDoc(ngoGalleryDocRef, {
				items: arrayRemove(image)
			});

			// Update state to remove the deleted image
			setUploadedImages(current => current.filter(img => img.imageId !== image.imageId));

			toast.success("Image deleted successfully");
		} catch (error) {
			console.error("Error deleting image:", error);
			toast.error("Failed to delete image");
		} finally {
			setDeleting(prev => {
				const newState = { ...prev };
				delete newState[image.imageId];
				return newState;
			});
		}
	};

	const uploadFiles = async () => {
		if (previews.length === 0) return;

		const uploadToast = toast.loading(`Uploading ${previews.length} image(s)...`);
		setUploading(true);
		const uploadPromises = previews.map(preview => {
			return new Promise((resolve, reject) => {
				const storageRef = ref(storage, `ngoGallery/${id}/${Date.now()}-${preview.file.name}`);
				const uploadTask = uploadBytesResumable(storageRef, preview.file);

				uploadTask.on('state_changed',
					(snapshot) => {
						const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
						setUploadProgress(prev => ({ ...prev, [preview.id]: progress }));
					},
					(error) => {
						console.error("Upload error:", error);
						reject(error);
					},
					async () => {
						try {
							const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

							// Create an image object
							const imageObject = {
								imageId: Math.random().toString(36).substring(2) + Date.now().toString(36),
								ngoId: id,
								imageUrl: downloadURL,
								fileName: preview.file.name,
								fileType: preview.file.type,
								fileSize: preview.file.size,
								uploadedAt: new Date().toISOString() // Using ISO string for consistent timestamp
							};

							// Get a reference to the NGO gallery document
							const ngoGalleryDocRef = doc(db, "ngoGallery", id);
							const docSnap = await getDoc(ngoGalleryDocRef);

							if (docSnap.exists()) {
								// Update existing document
								await updateDoc(ngoGalleryDocRef, {
									items: arrayUnion(imageObject),
									lastUpdated: serverTimestamp()
								});
							} else {
								// Create new document
								await setDoc(ngoGalleryDocRef, {
									ngoId: id,
									items: [imageObject],
									createdAt: serverTimestamp(),
									lastUpdated: serverTimestamp()
								});
							}

							resolve(imageObject);
						} catch (error) {
							console.error("Firestore error:", error);
							reject(error);
						}
					}
				);
			});
		});

		try {
			const newImages = await Promise.all(uploadPromises);
			setUploadedImages(prev => [...prev, ...newImages]);
			setPreviews([]);
			setFiles([]);
			setUploadProgress({});
			toast.success(`Successfully uploaded ${newImages.length} image(s)`, {
				id: uploadToast
			});
		} catch (error) {
			console.error("Error uploading files:", error);
			toast.error("Failed to upload some images", {
				id: uploadToast
			});
		} finally {
			setUploading(false);
		}
	};

	const refreshGallery = () => {
		fetchImages();
		toast.success("Gallery refreshed");
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="flex justify-between items-center mb-10">
				<h1 className="text-3xl font-bold text-indigo-700">Photo Gallery</h1>
				<button
					onClick={refreshGallery}
					disabled={refreshing}
					className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm"
				>
					<RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
					<span>Refresh</span>
				</button>
			</div>

			{/* Upload Section */}
			<div
				className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center transition-all
          ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
			>
				<div className="flex flex-col items-center justify-center space-y-4">
					<div className="p-4 bg-indigo-100 rounded-full">
						<Camera size={36} className="text-indigo-600" />
					</div>
					<div className="text-lg">
						<p className="font-medium">Drag and drop your photos here</p>
						<p className="text-gray-500 text-sm">or click to browse</p>
					</div>
					<input
						type="file"
						multiple
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						id="file-upload"
					/>
					<label
						htmlFor="file-upload"
						className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition cursor-pointer flex items-center"
					>
						<Upload size={18} className="mr-2" />
						Browse Files
					</label>
				</div>
			</div>

			{/* Preview Section */}
			{previews.length > 0 && (
				<div className="mb-8">
					<h2 className="text-xl font-semibold mb-4 flex items-center">
						<Image size={20} className="mr-2 text-indigo-600" />
						Selected Photos ({previews.length})
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{previews.map(preview => (
							<div key={preview.id} className="relative group">
								<div className="overflow-hidden rounded-lg shadow-md aspect-square bg-gray-100">
									<img
										src={preview.preview}
										alt={preview.file.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<button
									onClick={() => removePreview(preview.id)}
									className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
									title="Remove from selection"
								>
									<X size={16} />
								</button>
								{uploadProgress[preview.id] !== undefined && (
									<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
										{uploadProgress[preview.id]}%
										<div className="h-1 bg-gray-300 mt-1 rounded-full overflow-hidden">
											<div
												className="h-full bg-green-500 transition-all duration-300"
												style={{ width: `${uploadProgress[preview.id]}%` }}
											></div>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
					<div className="mt-4 flex justify-end">
						<button
							onClick={uploadFiles}
							disabled={uploading}
							className={`px-6 py-2 rounded-md flex items-center ${uploading
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-green-600 hover:bg-green-700 text-white transition'
								}`}
						>
							{uploading ? (
								<>
									<span className="mr-2">Uploading...</span>
									<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
								</>
							) : (
								<>
									<Check size={18} className="mr-2" />
									Upload All Photos
								</>
							)}
						</button>
					</div>
				</div>
			)}

			{/* Gallery Section */}
			{uploadedImages.length > 0 && (
				<div>
					<h2 className="text-xl font-semibold mb-4 flex items-center">
						<Image size={20} className="mr-2 text-indigo-600" />
						Gallery ({uploadedImages.length})
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{uploadedImages.map(image => (
							<div key={image.imageId} className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition group">
								<div className="aspect-square bg-gray-100">
									<img
										src={image.imageUrl}
										alt={image.fileName || 'Gallery image'}
										className="w-full h-full object-cover transition-transform group-hover:scale-105"
									/>
								</div>
								<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
									<button
										onClick={() => confirmDeleteImage(image)}
										disabled={deleting[image.imageId]}
										className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
										title="Delete image"
									>
										{deleting[image.imageId] ? (
											<div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
										) : (
											<Trash2 size={20} />
										)}
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Empty State */}
			{uploadedImages.length === 0 && previews.length === 0 && (
				<div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
					<div className="flex justify-center mb-4">
						<Image size={48} className="text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-700">No photos yet</h3>
					<p className="text-gray-500 mb-4">Upload some photos to see them here</p>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deleteModal.show && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
						<h3 className="text-lg font-medium mb-4">Delete Confirmation</h3>
						<p className="text-gray-600 mb-6">
							Are you sure you want to delete this image? This action cannot be undone.
						</p>
						<div className="flex justify-end space-x-3">
							<button
								onClick={() => setDeleteModal({ show: false, imageToDelete: null })}
								className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
							>
								Cancel
							</button>
							<button
								onClick={() => deleteImage(deleteModal.imageToDelete)}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center"
							>
								<Trash2 size={16} className="mr-1" />
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Gallery;