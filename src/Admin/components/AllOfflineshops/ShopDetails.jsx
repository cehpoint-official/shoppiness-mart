import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { IoArrowBack, IoEllipsisVertical } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { db } from "../../../../firebase";
import toast from "react-hot-toast";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

function ShopDetails({ shop, onBack, onListedProducts, onStatusUpdate }) {
  const [showOptions, setShowOptions] = useState(false);
  const [markingActive, setMarkingActive] = useState(false);
  const [markingInactive, setMarkingInactive] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [tempRate, setTempRate] = useState("");
  const [isSavingRate, setIsSavingRate] = useState(false);

  const handleUpdateStatus = async (id, status) => {
    if (status === "Active") {
      setMarkingActive(true);
    } else if (status === "Inactive") {
      setMarkingInactive(true);
    }

    try {
      const shopRef = doc(db, "businessDetails", id);
      await updateDoc(shopRef, {
        status,
        approvedDate:
          status === "Active"
            ? new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : null,
        inactiveDate:
          status === "Inactive"
            ? new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : null,
      });

      const emailTemplate =
        status === "Active"
          ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2c5282;">Your Business Account Has Been Reactivated!</h2>
          </div>
          <p>Dear ${shop.owner},</p>
          <p>Great news! Your Business "${shop.businessName}" has been reactivated on Shoppiness Mart. You can now resume all activities on our platform.</p>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-bottom: 10px;">Your Login Credentials:</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${shop.email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${shop.password}</p>
          </div>
          <p>You can now:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 10px 0;">✅ Access your Business dashboard</li>
            <li style="margin: 10px 0;">✅ Update your products/services</li>
            <li style="margin: 10px 0;">✅ Connect with customers</li>
          </ul>
          <p>If you have any questions or need assistance, our support team is here to help.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; color: #4a5568;"><strong>The Shoppiness Mart Team</strong></p>
          </div>
        </div>
      `
          : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #c53030;">Important Notice: Business Account Deactivated</h2>
          </div>
          <p>Dear ${shop.owner},</p>
          <p>We regret to inform you that your Business "${shop.businessName}" has been temporarily deactivated on Shoppiness Mart.</p>
          <div style="background-color: #fff5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #c53030; margin: 5px 0;">During this period:</p>
              <li style="margin: 5px 0;">• Your Business profile will not be visible to donors</li>
              <li style="margin: 5px 0;">• Active products/services will be paused</li>
              <li style="margin: 5px 0;">• You won't be able to connect with customers</li>
            </ul>
          </div>
          <p>If you believe this is an error or would like to reactivate your account, please contact our support team for assistance.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; color: #4a5568;"><strong>The Shoppiness Mart Team</strong></p>
          </div>
        </div>
      `;

      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: shop.email,
        title:
          status === "Active"
            ? "Shoppiness Mart - Business Account Reactivated!"
            : "Shoppiness Mart - Business Account Deactivated",
        body: emailTemplate,
      });

      toast.success(`Status updated to ${status}`);
      onStatusUpdate();
    } catch (error) {
      console.error("Error updating document or sending email:", error);
      toast.error("Failed to update status");
    } finally {
      setMarkingActive(false);
      setMarkingInactive(false);
    }
  };

  const handleEditRate = (shop) => {
    setEditingRate(shop.id);
    setTempRate(shop.rate || "");
  };

  const handleSaveRate = async () => {
    if (!tempRate || isNaN(tempRate)) {
      toast.error("Please enter a valid commission rate.");
      return;
    }

    setIsSavingRate(true);
    try {
      const shopRef = doc(db, "businessDetails", shop.id);
      await updateDoc(shopRef, { rate: tempRate });
      shop.rate = tempRate;
      setEditingRate(null);
      toast.success("Commission rate updated successfully!");
    } catch (error) {
      console.error("Error updating commission rate:", error);
      toast.error("Failed to update commission rate");
    } finally {
      setIsSavingRate(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <IoArrowBack className="w-5 h-5 mr-2" />
          View Details
        </button>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <IoEllipsisVertical className="w-6 h-6 text-gray-600" />
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
              <button
                onClick={() => {
                  onListedProducts(shop.id);
                  setShowOptions(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                Listed Products
              </button>
              {shop.status === "Active" ? (
                <button
                  onClick={() => handleUpdateStatus(shop.id, "Inactive")}
                  disabled={markingInactive || markingActive}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  {markingInactive && <FaSpinner className="animate-spin" />}
                  Mark as Inactive
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(shop.id, "Active")}
                  disabled={markingActive || markingInactive}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  {markingActive && <FaSpinner className="animate-spin" />}
                  Mark as Active
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md border">
        <div className="flex items-start gap-6 mb-8">
          <img
            src={shop.bannerUrl}
            alt={shop.businessName}
            className="w-48 h-48 object-cover rounded-lg"
          />
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={shop.logoUrl}
                alt="Logo"
                className="w-8 h-8 rounded-full"
              />
              <h1 className="text-xl font-semibold">{shop.businessName}</h1>
              {shop.status === "Active" && (
                <div className="bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                  <MdVerified className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">Verified</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm">{shop.cat}</p>
            <div className="mt-6">
              <h2 className="font-medium mb-2">Description</h2>
              <p className="text-gray-600">{shop.shortDesc}</p>
            </div>
            <div className="mt-4">
              <h2 className="font-medium mb-2">Location</h2>
              <p className="text-gray-600">{shop.location}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h2 className="font-medium mb-2">Phone Number</h2>
                <p className="text-gray-600">{shop.mobileNumber}</p>
              </div>
              <div>
                <h2 className="font-medium mb-2">Email ID</h2>
                <p className="text-gray-600">{shop.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">SHOP DETAILS</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">
                Business/Services Owner Name
              </h3>
              <p className="font-medium">{shop.owner}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Shop Category</h3>
              <p className="font-medium">{shop.cat}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">
                Business/Services Mode
              </h3>
              <p className="font-medium">{shop.mode}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Commission rate</h3>
              <p className="font-medium flex gap-4 items-center">
                {editingRate === shop.id && shop.status === "Active" ? (
                  <>
                    <input
                      type="text"
                      value={tempRate}
                      onChange={(e) => setTempRate(e.target.value)}
                      className="border rounded px-2 py-1 w-24"
                    />
                    <button
                      onClick={handleSaveRate}
                      disabled={isSavingRate}
                      className="bg-blue-400 py-1 px-2 rounded text-white flex items-center gap-2"
                    >
                      {isSavingRate ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </>
                ) : (
                  `${shop.rate}%`
                )}
                {editingRate !== shop.id && shop.status === "Active" && (
                  <button
                    onClick={() => handleEditRate(shop)}
                    className="hover:text-blue-700"
                  >
                    <FiEdit className="text-blue-600" />
                  </button>
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Email</h3>
              <p className="font-medium">{shop.businessEmail}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Terms Agreement</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  shop.termsAgreed
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {shop.termsAgreed ? "Agreed" : "Not Agreed"}
              </span>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">
                Preferred Partner Status
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  shop.isPreferredPartner
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {shop.isPreferredPartner ? "Preferred Partner" : "Standard Partner"}
              </span>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">LOGO</h3>
              <img
                src={shop.logoUrl}
                alt="Business Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopDetails;