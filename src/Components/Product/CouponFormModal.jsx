import { useEffect, useState } from "react";
import { Button } from "../../Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../Components/ui/dialog";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import CouponCard from "./Coupon";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const couponEmailTemplate = (toName, couponCode, discountValue, expiryDate) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Hello <strong>${toName}</strong>,</p>

    <p>We’re excited to share your exclusive coupon from <strong>Shopiness Mart</strong>! 🎉</p>

    <p>Here are the details of your coupon:</p>

    <div style="
      padding: 12px; 
      border: 1px solid #d0d0d0; 
      background-color: #f9f9f9; 
      border-radius: 8px; 
      margin: 16px 0;
    ">
      <p><strong>Coupon Code:</strong> <span style="color: #007BFF;">${couponCode}</span></p>
      <p><strong>Discount:</strong> ${discountValue}%</p>
      <p><strong>Valid Until:</strong> ${expiryDate}</p>
    </div>

    <p>Use this coupon at checkout to enjoy your discount on your next purchase!</p>

    <p style="color: #555;">
      Thank you for shopping with us.<br>
      Happy shopping! 🛒
    </p>

    <p>
      Best wishes,<br>
      <strong>Shopiness Mart Team</strong>
    </p>
  </div>
`;

function generateRandomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomCode = "#";
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
  }
  return randomCode;
}

export default function CouponModal({ shopDetail, productDetail, productId }) {
  const [open, setOpen] = useState(false);
  const [isCoupon, setIsCoupon] = useState(false);
  const [couponData, setCouponData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const { userId } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const couponData = {
        createdAt: new Date(),
        shopName: shopDetail?.businessName || "Unknown Shop",
        shopId: shopDetail?.id || "Unknown ID",
        productId: productId || "Unknown Product",
        inStoreDiscount: productDetail?.discount || 0,
        platformDiscount: 1,
        code: generateRandomCode(),
        user: userId || "Anonymous User",
        couponName: formData.fullName,
        couponEmail: formData.email,
        couponPhone: formData.phone
      };

      const threeDaysLater = new Date(couponData.createdAt);
      threeDaysLater.setDate(couponData.createdAt.getDate() + 3);

      await addDoc(collection(db, "coupons"), couponData);
      await axios.post("https://email-server-nu-nine.vercel.app/send-email", {
        email: formData.email,
        title: "Coupon Generated Shoppiness Mart",
        body: couponEmailTemplate(
          formData.fullName,
          couponData.code,
          couponData?.inStoreDiscount,
          new Date(threeDaysLater).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })
        )
      });

      setCouponData(couponData);

      setIsCoupon(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getUserData(userId) {
      if (!userId) return;
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData({
            fullName: userData?.fname
              ? userData.fname
              : `${userData.fname} ${userData.lname}`,
            email: userData.email,
            phone: userData?.phone || ""
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUserData(userId);
  }, [userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-full sm:w-auto">
          Generate Coupon
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        {!isCoupon ? (
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-semibold leading-tight tracking-tight">
                SUBMIT YOUR DETAILS AND GENERATE
                <br />
                YOUR COUPON CODE & GET CASH BACK
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  className="h-10 border-gray-200"
                  onChange={handleChange}
                  value={formData.fullName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  // disabled={true}
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="h-10 border-gray-200"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="h-10 border-gray-200"
                  onChange={handleChange}
                  value={formData.phone}
                />
              </div>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mt-6"
              >
                {isLoading ? "Generating..." : "generate Coupon"}
              </Button>
            </form>
          </div>
        ) : (
          <CouponCard setOpen={setOpen} couponData={couponData} />
        )}
      </DialogContent>
    </Dialog>
  );
}
