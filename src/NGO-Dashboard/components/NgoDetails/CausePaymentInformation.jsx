import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import { doc, collection, getDocs, addDoc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import toast from "react-hot-toast";

const CausePaymentInformation = () => {
	const { id } = useParams();
	const [showPaymentMethods, setShowPaymentMethods] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState("upi");
	const [causes, setCauses] = useState([]);
	const [selectedCause, setSelectedCause] = useState("");

	// State for existing payments
	const [existingPayments, setExistingPayments] = useState({
		bankAccounts: [],
		cardDetails: [],
		upiDetails: [],
	});

	const [isFetching, setIsFetching] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isFetchingCauses, setIsFetchingCauses] = useState(true);

	// State for new payment methods
	const [upiId, setUpiId] = useState("");
	const [bankDetails, setBankDetails] = useState({
		accountName: "",
		ifscCode: "",
		accountNumber: "",
	});
	const [cardDetails, setCardDetails] = useState({
		cardHolder: "",
		cardNumber: "",
		validThru: "",
		cvv: "",
	});

	// Fetch causes from the NGO
	useEffect(() => {
		const fetchCauses = async () => {
			if (!id) return;

			setIsFetchingCauses(true);
			try {
				const ngoDocRef = doc(db, "causeDetails", id);
				const ngoDocSnap = await getDoc(ngoDocRef);

				if (ngoDocSnap.exists()) {
					const ngoData = ngoDocSnap.data();
					if (ngoData.causes && Array.isArray(ngoData.causes)) {
						setCauses(ngoData.causes);
						// Select the first cause by default if available
						if (ngoData.causes.length > 0) {
							setSelectedCause(ngoData.causes[0].id);
							// Fetch payment methods for the first cause
							fetchPaymentMethods(ngoData.causes[0].id);
						}
					} else {
						toast.error("No causes found for this NGO");
					}
				} else {
					toast.error("NGO not found");
				}
			} catch (error) {
				console.error("Error fetching causes:", error);
				toast.error("Failed to fetch causes");
			} finally {
				setIsFetchingCauses(false);
			}
		};

		fetchCauses();
	}, [id]);

	// Check if any payment method exists
	const hasExistingPaymentMethod = () => {
		return (
			existingPayments.upiDetails.length > 0 ||
			existingPayments.bankAccounts.length > 0 ||
			existingPayments.cardDetails.length > 0
		);
	};

	// Handle Add Payment Method button click
	const handleAddPaymentClick = () => {
		if (hasExistingPaymentMethod()) {
			toast.error(
				"Please delete existing payment method before adding a new one"
			);
			return;
		}
		setShowPaymentMethods(!showPaymentMethods);
	};

	// Handle cause selection change
	const handleCauseChange = (e) => {
		const causeId = e.target.value;
		setSelectedCause(causeId);
		// Reset existing payments when changing cause
		setExistingPayments({
			bankAccounts: [],
			cardDetails: [],
			upiDetails: [],
		});
		// Fetch payment methods for the selected cause
		fetchPaymentMethods(causeId);
	};

	const updateCausePaymentDetails = async (causeId, type, details) => {
		try {
			if (!id || !causeId) return;

			const ngoDocRef = doc(db, "causeDetails", id);
			const docSnap = await getDoc(ngoDocRef);

			if (docSnap.exists()) {
				const ngoData = docSnap.data();
				const causesArray = ngoData.causes || [];

				// Find the index of the cause in the array
				const causeIndex = causesArray.findIndex(cause => cause.id === causeId);

				if (causeIndex !== -1) {
					// Initialize the paymentDetails object for this cause if it doesn't exist
					if (!causesArray[causeIndex].paymentDetails) {
						causesArray[causeIndex].paymentDetails = {
							upiDetails: [],
							bankAccounts: [],
							cardDetails: [],
						};
					}

					// Add new payment details to the cause
					causesArray[causeIndex].paymentDetails[type] = [
						...(causesArray[causeIndex].paymentDetails[type] || []),
						details
					];

					// Update the NGO document
					await updateDoc(ngoDocRef, {
						causes: causesArray
					});
				}
			}
		} catch (error) {
			console.error("Error updating cause payment details:", error);
			throw error;
		}
	};

	// Remove payment details from cause data
	const removeCausePaymentDetails = async (causeId, type, id) => {
		try {
			if (!causeId) return;

			const ngoDocRef = doc(db, "causeDetails", this.id);
			const docSnap = await getDoc(ngoDocRef);

			if (docSnap.exists()) {
				const ngoData = docSnap.data();
				const causesArray = ngoData.causes || [];

				// Find the index of the cause in the array
				const causeIndex = causesArray.findIndex(cause => cause.id === causeId);

				if (causeIndex !== -1 && causesArray[causeIndex].paymentDetails) {
					// Remove the payment detail with matching id
					causesArray[causeIndex].paymentDetails[type] =
						causesArray[causeIndex].paymentDetails[type].filter(item => item.id !== id);

					// Update the NGO document
					await updateDoc(ngoDocRef, {
						causes: causesArray
					});
				}
			}
		} catch (error) {
			console.error("Error removing cause payment details:", error);
			throw error;
		}
	};

	const saveUpiDetails = async () => {
		if (!upiId.trim() || !selectedCause) {
			toast.error("Please select a cause and enter UPI ID");
			return;
		}

		setIsSaving(true);
		try {
			const causePaymentRef = doc(db, "causePaymentDetails", selectedCause);
			const upiRef = collection(causePaymentRef, "upiDetails");

			const docRef = await addDoc(upiRef, { upiId: upiId.trim() });
			const newUpiDetail = { id: docRef.id, upiId: upiId.trim() };

			// Update cause's payment details in causeDetails
			await updateCausePaymentDetails(selectedCause, "upiDetails", newUpiDetail);

			setExistingPayments((prev) => ({
				...prev,
				upiDetails: [...prev.upiDetails, newUpiDetail],
			}));

			setUpiId("");
			setShowPaymentMethods(false);
			toast.success("UPI details saved successfully");
		} catch (error) {
			console.error("Error saving UPI:", error);
			toast.error("Failed to save UPI details");
		} finally {
			setIsSaving(false);
		}
	};

	// Save bank details function
	const saveBankDetails = async () => {
		if (!bankDetails.accountNumber || !bankDetails.accountName || !selectedCause) {
			toast.error("Please select a cause and fill required bank details");
			return;
		}

		setIsSaving(true);
		try {
			const causePaymentRef = doc(db, "causePaymentDetails", selectedCause);
			const bankRef = collection(causePaymentRef, "bankAccounts");

			const docRef = await addDoc(bankRef, bankDetails);
			const newBankDetail = { id: docRef.id, ...bankDetails };

			// Update cause's payment details in causeDetails
			await updateCausePaymentDetails(selectedCause, "bankAccounts", newBankDetail);

			setExistingPayments((prev) => ({
				...prev,
				bankAccounts: [...prev.bankAccounts, newBankDetail],
			}));

			setBankDetails({
				accountName: "",
				ifscCode: "",
				accountNumber: "",
			});
			setShowPaymentMethods(false);
			toast.success("Bank details saved successfully");
		} catch (error) {
			console.error("Error saving bank details:", error);
			toast.error("Failed to save bank details");
		} finally {
			setIsSaving(false);
		}
	};

	// Save card details function
	const saveCardDetails = async () => {
		if (!cardDetails.cardNumber || !cardDetails.cardHolder || !selectedCause) {
			toast.error("Please select a cause and fill required card details");
			return;
		}

		setIsSaving(true);
		try {
			const causePaymentRef = doc(db, "causePaymentDetails", selectedCause);
			const cardRef = collection(causePaymentRef, "cardDetails");

			const docRef = await addDoc(cardRef, cardDetails);
			const newCardDetail = { id: docRef.id, ...cardDetails };

			// Update cause's payment details in causeDetails
			await updateCausePaymentDetails(selectedCause, "cardDetails", newCardDetail);

			setExistingPayments((prev) => ({
				...prev,
				cardDetails: [...prev.cardDetails, newCardDetail],
			}));

			setCardDetails({
				cardHolder: "",
				cardNumber: "",
				validThru: "",
				cvv: "",
			});
			setShowPaymentMethods(false);
			toast.success("Card details saved successfully");
		} catch (error) {
			console.error("Error saving card details:", error);
			toast.error("Failed to save card details");
		} finally {
			setIsSaving(false);
		}
	};

	// Delete payment method function
	const deletePaymentMethod = async (type, id) => {
		if (!selectedCause) return;

		setIsDeleting(true);
		try {
			const causePaymentRef = doc(db, "causePaymentDetails", selectedCause);
			await deleteDoc(doc(collection(causePaymentRef, type), id));

			// Remove payment details from cause's details
			await removeCausePaymentDetails(selectedCause, type, id);

			setExistingPayments((prev) => ({
				...prev,
				[type]: prev[type].filter((item) => item.id !== id),
			}));

			toast.success("Payment method deleted successfully");
		} catch (error) {
			console.error("Error deleting payment method:", error);
			toast.error("Failed to delete payment method");
		} finally {
			setIsDeleting(false);
		}
	};

	// Fetch existing payment methods for a specific cause
	const fetchPaymentMethods = async (causeId) => {
		if (!causeId) return;

		setIsFetching(true);
		try {
			// First check if cause has payment details in the NGO document
			const ngoDocRef = doc(db, "causeDetails", id);
			const ngoDocSnap = await getDoc(ngoDocRef);

			let causePaymentDetails = {
				upiDetails: [],
				bankAccounts: [],
				cardDetails: [],
			};

			if (ngoDocSnap.exists()) {
				const ngoData = ngoDocSnap.data();
				const causeData = ngoData.causes?.find(cause => cause.id === causeId);

				if (causeData && causeData.paymentDetails) {
					causePaymentDetails = causeData.paymentDetails;
				} else {
					// Initialize payment details for this cause if they don't exist
					const causesArray = ngoData.causes || [];
					const causeIndex = causesArray.findIndex(cause => cause.id === causeId);

					if (causeIndex !== -1) {
						causesArray[causeIndex].paymentDetails = causePaymentDetails;
						await updateDoc(ngoDocRef, {
							causes: causesArray
						});
					}
				}
			}

			// Also check the causePaymentDetails collection
			const causePaymentRef = doc(db, "causePaymentDetails", causeId);

			// Fetch bank accounts
			const bankSnapshot = await getDocs(
				collection(causePaymentRef, "bankAccounts")
			);
			const banks = bankSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			// Fetch card details
			const cardSnapshot = await getDocs(
				collection(causePaymentRef, "cardDetails")
			);
			const cards = cardSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			// Fetch UPI details
			const upiSnapshot = await getDocs(
				collection(causePaymentRef, "upiDetails")
			);
			const upis = upiSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			// Combine data from both sources
			setExistingPayments({
				bankAccounts: [...causePaymentDetails.bankAccounts || [], ...banks],
				cardDetails: [...causePaymentDetails.cardDetails || [], ...cards],
				upiDetails: [...causePaymentDetails.upiDetails || [], ...upis],
			});
		} catch (error) {
			console.error("Error fetching payment methods:", error);
			toast.error("Failed to fetch payment methods");
		} finally {
			setIsFetching(false);
		}
	};

	const maskCardNumber = (number) => {
		return `****${number.slice(-4)}`;
	};

	// Skeleton Loading Component
	const SkeletonLoader = () => (
		<div className="animate-pulse space-y-4">
			<div className="h-10 bg-gray-200 rounded"></div>
			<div className="h-10 bg-gray-200 rounded"></div>
		</div>
	);

	return (
		<div className="w-full max-w-2xl p-4">
			{/* Notice Banner */}
			<div className="bg-[#FFB93921] p-3 mb-6 rounded">
				<p className="text-sm text-[#C5830B]">
					If supporters donate to your cause, the funds will be
					transferred to your account after deducting a 2% platform fee. Only
					one payment method is allowed per cause at a time.
				</p>
			</div>

			{/* Cause Selection Dropdown */}
			<div className="mb-6">
				<label className="block text-sm font-medium mb-2">Select Cause</label>
				{isFetchingCauses ? (
					<div className="animate-pulse h-10 bg-gray-200 rounded"></div>
				) : (
					<select
						value={selectedCause}
						onChange={handleCauseChange}
						className="w-full p-2 border rounded text-sm"
						disabled={isFetchingCauses}
					>
						<option value="">Select a cause</option>
						{causes.map((cause) => (
							<option key={cause.id} value={cause.id}>
								{cause.causeName}
							</option>
						))}
					</select>
				)}
			</div>

			{/* Existing Payment Methods */}
			{selectedCause && (
				<>
					{isFetching ? (
						<SkeletonLoader />
					) : (
						<>
							{existingPayments.upiDetails.length > 0 && (
								<div className="mb-6">
									<h3 className="text-sm font-medium mb-3">UPI Details</h3>
									{existingPayments.upiDetails.map((upi) => (
										<div
											key={upi.id}
											className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2"
										>
											<span className="text-sm">{upi.upiId}</span>
											<button
												onClick={() => deletePaymentMethod("upiDetails", upi.id)}
												className="text-red-500 hover:text-red-700"
												disabled={isDeleting}
											>
												{isDeleting ? (
													<FaSpinner className="w-4 h-4 animate-spin" />
												) : (
													<FaTrash className="w-4 h-4" />
												)}
											</button>
										</div>
									))}
								</div>
							)}

							{existingPayments.bankAccounts.length > 0 && (
								<div className="mb-6">
									<h3 className="text-sm font-medium mb-3">Bank Accounts</h3>
									{existingPayments.bankAccounts.map((bank) => (
										<div
											key={bank.id}
											className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2"
										>
											<div>
												<p className="text-sm font-medium">{bank.accountName}</p>
												<p className="text-xs text-gray-600">
													Acc: {bank.accountNumber}
												</p>
											</div>
											<button
												onClick={() => deletePaymentMethod("bankAccounts", bank.id)}
												className="text-red-500 hover:text-red-700"
												disabled={isDeleting}
											>
												{isDeleting ? (
													<FaSpinner className="w-4 h-4 animate-spin" />
												) : (
													<FaTrash className="w-4 h-4" />
												)}
											</button>
										</div>
									))}
								</div>
							)}

							{existingPayments.cardDetails.length > 0 && (
								<div className="mb-6">
									<h3 className="text-sm font-medium mb-3">Cards</h3>
									{existingPayments.cardDetails.map((card) => (
										<div
											key={card.id}
											className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2"
										>
											<div>
												<p className="text-sm font-medium">{card.cardHolder}</p>
												<p className="text-xs text-gray-600">
													{maskCardNumber(card.cardNumber)}
												</p>
											</div>
											<button
												onClick={() => deletePaymentMethod("cardDetails", card.id)}
												className="text-red-500 hover:text-red-700"
												disabled={isDeleting}
											>
												{isDeleting ? (
													<FaSpinner className="w-4 h-4 animate-spin" />
												) : (
													<FaTrash className="w-4 h-4" />
												)}
											</button>
										</div>
									))}
								</div>
							)}

							{/* Empty State Message */}
							{existingPayments.upiDetails.length === 0 &&
								existingPayments.bankAccounts.length === 0 &&
								existingPayments.cardDetails.length === 0 && (
									<p className="text-sm text-gray-600">
										No payment methods have been added yet for this cause. Please add a payment
										method to receive donations.
									</p>
								)}
						</>
					)}

					{/* Add New Payment Method Button - Visible when a cause is selected */}
					<button
						onClick={handleAddPaymentClick}
						className="bg-blue-600 mt-4 py-1 px-4 rounded flex items-center gap-2 text-white mb-6"
						disabled={!selectedCause}
					>
						<FaPlus className="w-4 h-4" />
						<span>Add Payment Method</span>
					</button>

					{/* Payment Method Forms */}
					{showPaymentMethods && (
						<div className="space-y-4">
							{/* UPI Option */}
							<div>
								<label className="flex items-center mb-4">
									<input
										type="radio"
										name="paymentMethod"
										checked={paymentMethod === "upi"}
										onChange={() => setPaymentMethod("upi")}
										className="w-4 h-4 text-blue-600"
									/>
									<span className="ml-2 text-sm">Add UPI</span>
								</label>

								{paymentMethod === "upi" && (
									<div className="pl-6 space-y-2">
										<div className="flex flex-col sm:flex-row gap-2">
											<div className="flex-1">
												<label className="block text-sm text-gray-600 mb-1">
													UPI ID
												</label>
												<input
													type="text"
													placeholder="Enter UPI ID"
													value={upiId}
													onChange={(e) => setUpiId(e.target.value)}
													className="w-full p-2 border rounded text-sm"
												/>
											</div>
											<button
												onClick={saveUpiDetails}
												className="px-4 py-2 bg-blue-500 text-white rounded text-sm whitespace-nowrap self-end"
												disabled={isSaving}
											>
												{isSaving ? (
													<FaSpinner className="w-4 h-4 animate-spin mx-auto" />
												) : (
													"Save"
												)}
											</button>
										</div>
									</div>
								)}
							</div>

							{/* Bank Account Option */}
							<div>
								<label className="flex items-center mb-4">
									<input
										type="radio"
										name="paymentMethod"
										checked={paymentMethod === "bank"}
										onChange={() => setPaymentMethod("bank")}
										className="w-4 h-4 text-blue-600"
									/>
									<span className="ml-2 text-sm">Add Bank</span>
								</label>

								{paymentMethod === "bank" && (
									<div className="pl-6 space-y-3">
										<div>
											<label className="block text-sm text-gray-600 mb-1">
												Account Name
											</label>
											<input
												type="text"
												placeholder="Account Name"
												value={bankDetails.accountName}
												onChange={(e) =>
													setBankDetails({
														...bankDetails,
														accountName: e.target.value,
													})
												}
												className="w-full p-2 border rounded text-sm"
											/>
										</div>
										<div>
											<label className="block text-sm text-gray-600 mb-1">
												IFSC Code
											</label>
											<input
												type="text"
												placeholder="IFSC Code"
												value={bankDetails.ifscCode}
												onChange={(e) =>
													setBankDetails({
														...bankDetails,
														ifscCode: e.target.value,
													})
												}
												className="w-full p-2 border rounded text-sm"
											/>
										</div>
										<div>
											<label className="block text-sm text-gray-600 mb-1">
												Account Number
											</label>
											<input
												type="text"
												placeholder="Account Number"
												value={bankDetails.accountNumber}
												onChange={(e) =>
													setBankDetails({
														...bankDetails,
														accountNumber: e.target.value,
													})
												}
												className="w-full p-2 border rounded text-sm"
											/>
										</div>
										<div className="flex justify-end">
											<button
												onClick={saveBankDetails}
												className="px-4 py-2 bg-orange-400 text-white rounded text-sm"
												disabled={isSaving}
											>
												{isSaving ? (
													<FaSpinner className="w-4 h-4 animate-spin mx-auto" />
												) : (
													"Save"
												)}
											</button>
										</div>
									</div>
								)}
							</div>

							{/* Card Option */}
							<div>
								<label className="flex items-center mb-4">
									<input
										type="radio"
										name="paymentMethod"
										checked={paymentMethod === "card"}
										onChange={() => setPaymentMethod("card")}
										className="w-4 h-4 text-blue-600"
									/>
									<span className="ml-2 text-sm">Credit/Debit Card</span>
								</label>

								{paymentMethod === "card" && (
									<div className="pl-6 space-y-3">
										<div>
											<label className="block text-sm text-gray-600 mb-1">
												Card Holder Name
											</label>
											<input
												type="text"
												placeholder="Card Holder Name"
												value={cardDetails.cardHolder}
												onChange={(e) =>
													setCardDetails({
														...cardDetails,
														cardHolder: e.target.value,
													})
												}
												className="w-full p-2 border rounded text-sm"
											/>
										</div>
										<div>
											<label className="block text-sm text-gray-600 mb-1">
												Card Number
											</label>
											<input
												type="text"
												placeholder="Card Number"
												value={cardDetails.cardNumber}
												onChange={(e) =>
													setCardDetails({
														...cardDetails,
														cardNumber: e.target.value,
													})
												}
												maxLength={16}
												className="w-full p-2 border rounded text-sm"
											/>
										</div>
										<div className="flex flex-col sm:flex-row gap-4">
											<div>
												<label className="block text-sm text-gray-600 mb-1">
													Valid Thru
												</label>
												<div className="flex gap-2">
													<select
														className="w-20 p-2 border rounded text-sm"
														value={cardDetails.validThru.split("/")[0] || ""}
														onChange={(e) =>
															setCardDetails({
																...cardDetails,
																validThru: `${e.target.value}/${cardDetails.validThru.split("/")[1] || ""
																	}`,
															})
														}
													>
														<option value="">MM</option>
														{Array.from({ length: 12 }, (_, i) => i + 1).map(
															(month) => (
																<option
																	key={month}
																	value={month.toString().padStart(2, "0")}
																>
																	{month.toString().padStart(2, "0")}
																</option>
															)
														)}
													</select>
													<select
														className="w-20 p-2 border rounded text-sm"
														value={cardDetails.validThru.split("/")[1] || ""}
														onChange={(e) =>
															setCardDetails({
																...cardDetails,
																validThru: `${cardDetails.validThru.split("/")[0] || ""
																	}/${e.target.value}`,
															})
														}
													>
														<option value="">YY</option>
														{Array.from(
															{ length: 10 },
															(_, i) => new Date().getFullYear() + i
														).map((year) => (
															<option key={year} value={year.toString().slice(-2)}>
																{year.toString().slice(-2)}
															</option>
														))}
													</select>
												</div>
											</div>
											<div>
												<label className="block text-sm text-gray-600 mb-1">
													CVV
												</label>
												<input
													type="password"
													placeholder="CVV"
													value={cardDetails.cvv}
													onChange={(e) =>
														setCardDetails({ ...cardDetails, cvv: e.target.value })
													}
													maxLength={3}
													className="w-24 p-2 border rounded text-sm"
												/>
											</div>
										</div>
										<div className="flex justify-end">
											<button
												onClick={saveCardDetails}
												className="px-4 py-2 bg-orange-400 text-white rounded text-sm"
												disabled={isSaving}
											>
												{isSaving ? (
													<FaSpinner className="w-4 h-4 animate-spin mx-auto" />
												) : (
													"Save"
												)}
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</>
			)}

			{/* Message when no cause is selected */}
			{!selectedCause && !isFetchingCauses && causes.length > 0 && (
				<p className="text-sm text-gray-600">
					Please select a cause to manage payment methods.
				</p>
			)}

			{/* Message when no causes are available */}
			{!isFetchingCauses && causes.length === 0 && (
				<div className="bg-red-50 p-4 rounded">
					<p className="text-sm text-red-600">
						No causes found for this NGO. Please add causes first.
					</p>
				</div>
			)}
		</div>
	);
};

export default CausePaymentInformation;