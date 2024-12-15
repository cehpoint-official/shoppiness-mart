import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CouponCard from "./Coupon";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";

function generateRandomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomCode = "#";
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
  }
  return randomCode;
}

export default function CouponModal({
  userId,
  shopDetail,
  productDetail,
  productId
}) {
  const [open, setOpen] = useState(false);
  const [isCoupon, setIsCoupon] = useState(false);
  const [couponData, setCouponData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

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

      await addDoc(collection(db, "coupons"), couponData);

      setCouponData(couponData);

      setIsCoupon(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsLoading(false);
    }
  };

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
