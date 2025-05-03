import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../../firebase';
import { Calendar, Upload, X, Image as ImageIcon, Check, Edit, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';

const PastEvents = () => {
	const { id } = useParams();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [eventDate, setEventDate] = useState('');
	const [location, setLocation] = useState('');
	const [attendees, setAttendees] = useState('');
	const [banner, setBanner] = useState(null);
	const [bannerPreview, setBannerPreview] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [uploadProgress, setUploadProgress] = useState(0);
	const [pastEvents, setPastEvents] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [currentEventId, setCurrentEventId] = useState(null);
	const [currentBannerURL, setCurrentBannerURL] = useState('');
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [eventToDelete, setEventToDelete] = useState(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		fetchPastEvents();
	}, [id]);

	const fetchPastEvents = async () => {
		try {
			setIsRefreshing(true);
			const eventsQuery = query(
				collection(db, "ngoPastEvents"),
				where("ngoId", "==", id),
				orderBy("createdAt", "desc")
			);

			const querySnapshot = await getDocs(eventsQuery);
			const events = [];
			querySnapshot.forEach((doc) => {
				events.push({ id: doc.id, ...doc.data() });
			});

			setPastEvents(events);
		} catch (error) {
			console.error("Error fetching past events:", error);
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleBannerChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setBanner(file);
			const reader = new FileReader();
			reader.onload = () => {
				setBannerPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const clearBanner = () => {
		setBanner(null);
		setBannerPreview('');
	};

	const resetForm = () => {
		setTitle('');
		setDescription('');
		setEventDate('');
		setLocation('');
		setAttendees('');
		setBanner(null);
		setBannerPreview('');
		setCurrentBannerURL('');
		setIsEditing(false);
		setCurrentEventId(null);
	};

	const handleEditEvent = async (event) => {
		setTitle(event.title);
		setDescription(event.description);
		setEventDate(event.eventDate);
		setLocation(event.location || '');
		setAttendees(event.attendees === 'Not specified' ? '' : event.attendees);
		setCurrentBannerURL(event.bannerURL);
		setBannerPreview(event.bannerURL);
		setIsEditing(true);
		setCurrentEventId(event.id);

		// Scroll to form
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	const handleDeleteClick = (event) => {
		setEventToDelete(event);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = async () => {
		if (!eventToDelete) return;

		setLoading(true);
		try {
			// Delete the document from Firestore
			await deleteDoc(doc(db, "ngoPastEvents", eventToDelete.id));

			// Delete the banner image from Storage if it exists
			if (eventToDelete.bannerURL) {
				// Extract the path from the URL
				const imageRef = ref(storage, eventToDelete.bannerURL);
				try {
					await deleteObject(imageRef);
				} catch (storageError) {
					console.error("Error deleting image from storage:", storageError);
					// Continue anyway as the document is already deleted
				}
			}

			// Update the UI
			setPastEvents(pastEvents.filter(event => event.id !== eventToDelete.id));
			setShowDeleteModal(false);
			setEventToDelete(null);
			setSuccessMessage('Event deleted successfully!');
			setSuccess(true);

			setTimeout(() => {
				setSuccess(false);
			}, 3000);
		} catch (error) {
			console.error("Error deleting event:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelDelete = () => {
		setShowDeleteModal(false);
		setEventToDelete(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !description || !eventDate || (!banner && !isEditing)) {
			alert("Please fill all required fields" + (!isEditing ? " and upload a banner image" : ""));
			return;
		}

		setLoading(true);
		setUploadProgress(0);

		try {
			let downloadURL = currentBannerURL;

			// If a new banner is selected, upload it
			if (banner) {
				const storageRef = ref(storage, `ngoPastEvents/${id}/${Date.now()}-${banner.name}`);
				const uploadTask = uploadBytesResumable(storageRef, banner);

				await new Promise((resolve, reject) => {
					uploadTask.on(
						"state_changed",
						(snapshot) => {
							const progress = Math.round(
								(snapshot.bytesTransferred / snapshot.totalBytes) * 100
							);
							setUploadProgress(progress);
						},
						reject,
						async () => {
							downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
							resolve();
						}
					);
				});

				// If updating and had a previous image, delete it
				if (isEditing && currentBannerURL) {
					try {
						const oldImageRef = ref(storage, currentBannerURL);
						await deleteObject(oldImageRef).catch(err => console.log("Old image may not exist:", err));
					} catch (error) {
						console.error("Error deleting old image:", error);
					}
				}
			}

			const eventData = {
				ngoId: id,
				title,
				description,
				eventDate,
				location,
				attendees: attendees || "Not specified",
				bannerURL: downloadURL,
				updatedAt: serverTimestamp()
			};

			if (isEditing) {
				// Update existing event
				await updateDoc(doc(db, "ngoPastEvents", currentEventId), eventData);
				setSuccessMessage('Event updated successfully!');
			} else {
				// Add new event
				eventData.createdAt = serverTimestamp();
				await addDoc(collection(db, "ngoPastEvents"), eventData);
				setSuccessMessage('Event added successfully!');
			}

			// Reset form and show success message
			resetForm();
			setLoading(false);
			setSuccess(true);
			fetchPastEvents();

			// Hide success message after 3 seconds
			setTimeout(() => {
				setSuccess(false);
			}, 3000);
		} catch (error) {
			console.error("Error saving event:", error);
			setLoading(false);
		}
	};

	const cancelEdit = () => {
		resetForm();
	};

	return (
		<div className="bg-gray-50 min-h-screen p-4 md:p-8">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8 flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-indigo-800 mb-2">Past Events Management</h1>
						<p className="text-gray-600">Document your organization's impact by adding details about your past events.</p>
					</div>
					<button
						onClick={fetchPastEvents}
						className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm"
						disabled={isRefreshing}
					>
						<RefreshCw size={18} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
						<span>Refresh</span>
					</button>
				</div>

				{/* Add/Edit Event Form */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						{isEditing ? "Edit Event" : "Add New Event"}
					</h2>

					<form onSubmit={handleSubmit}>
						{/* Banner Upload Section */}
						<div className="mb-6">
							<label className="block text-gray-700 font-medium mb-2">
								Event Banner Image {!isEditing && <span className="text-red-500">*</span>}
							</label>

							{bannerPreview ? (
								<div className="relative rounded-lg overflow-hidden border border-gray-200">
									<img
										src={bannerPreview}
										alt="Banner preview"
										className="w-full h-48 object-cover"
									/>
									<button
										type="button"
										onClick={clearBanner}
										className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
									>
										<X size={20} />
									</button>
								</div>
							) : (
								<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
									<div className="flex flex-col items-center">
										<ImageIcon size={48} className="text-gray-400 mb-2" />
										<p className="text-gray-500 mb-4">Upload an engaging banner image</p>
										<label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
											<span>Select Image</span>
											<input
												type="file"
												className="hidden"
												accept="image/*"
												onChange={handleBannerChange}
											/>
										</label>
									</div>
								</div>
							)}
						</div>

						{/* Event Details */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Event Title <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									placeholder="Annual Fundraising Gala"
									required
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Event Date <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<Calendar size={18} className="text-gray-500" />
									</div>
									<input
										type="date"
										value={eventDate}
										onChange={(e) => setEventDate(e.target.value)}
										className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Location
								</label>
								<input
									type="text"
									value={location}
									onChange={(e) => setLocation(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									placeholder="City Community Center"
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Number of Attendees
								</label>
								<input
									type="number"
									value={attendees}
									onChange={(e) => setAttendees(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									placeholder="50"
									min="0"
								/>
							</div>
						</div>

						<div className="mb-6">
							<label className="block text-gray-700 font-medium mb-2">
								Event Description <span className="text-red-500">*</span>
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								rows="4"
								placeholder="Describe the event, its purpose, achievements, and impact..."
								required
							></textarea>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end space-x-3">
							{isEditing && (
								<button
									type="button"
									onClick={cancelEdit}
									className="px-6 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium"
								>
									Cancel
								</button>
							)}
							<button
								type="submit"
								disabled={loading}
								className={`flex items-center px-6 py-2 rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
									} text-white font-medium`}
							>
								{loading ? (
									<>
										<Upload className="animate-spin mr-2" size={18} />
										<span>
											{isEditing ? 'Updating' : 'Uploading'}... {uploadProgress}%
										</span>
									</>
								) : (
									<span>{isEditing ? 'Update Event' : 'Add Event'}</span>
								)}
							</button>
						</div>

						{/* Success Message */}
						{success && (
							<div className="mt-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
								<Check size={20} className="mr-2" />
								<span>{successMessage}</span>
							</div>
						)}
					</form>
				</div>

				{/* Display Past Events */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-6">Previous Events</h2>

					{pastEvents.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							No past events have been added yet.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{pastEvents.map((event) => (
								<div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
									<div className="h-48 relative">
										<img
											src={event.bannerURL}
											alt={event.title}
											className="w-full h-full object-cover"
										/>
										{/* Action buttons overlay */}
										<div className="absolute top-2 right-2 flex space-x-2">
											<button
												onClick={() => handleEditEvent(event)}
												className="bg-white p-2 rounded-full hover:bg-gray-100 text-indigo-600 shadow-md"
												title="Edit event"
											>
												<Edit size={16} />
											</button>
											<button
												onClick={() => handleDeleteClick(event)}
												className="bg-white p-2 rounded-full hover:bg-gray-100 text-red-600 shadow-md"
												title="Delete event"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
									<div className="p-4">
										<h3 className="font-semibold text-lg text-gray-800 mb-1">{event.title}</h3>
										<div className="flex items-center text-gray-600 text-sm mb-2">
											<Calendar size={16} className="mr-1" />
											<span>{new Date(event.eventDate).toLocaleDateString()}</span>
										</div>
										<p className="text-gray-600 text-sm mb-2">
											{event.location && (
												<span className="block">Location: {event.location}</span>
											)}
											{event.attendees && (
												<span className="block">Attendees: {event.attendees}</span>
											)}
										</p>
										<p className="text-gray-700 text-sm line-clamp-3">
											{event.description}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
						<div className="flex items-center text-red-600 mb-4">
							<AlertTriangle size={24} className="mr-2" />
							<h3 className="text-lg font-semibold">Confirm Deletion</h3>
						</div>

						<p className="text-gray-700 mb-6">
							Are you sure you want to delete the event <span className="font-semibold">{eventToDelete?.title}</span>?
							This action cannot be undone.
						</p>

						<div className="flex justify-end space-x-3">
							<button
								onClick={handleCancelDelete}
								className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteConfirm}
								className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
								disabled={loading}
							>
								{loading ? (
									<>
										<Upload className="animate-spin mr-2" size={16} />
										<span>Deleting...</span>
									</>
								) : (
									<span>Delete Event</span>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PastEvents;