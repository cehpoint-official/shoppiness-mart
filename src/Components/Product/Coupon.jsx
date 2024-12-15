import { Copy } from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Card } from "../../Components/ui/card";

export default function CouponCard({ setOpen, couponData }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(couponData.code);
  };

  return (
    <Card className="relative w-full shadow-lg overflow-hidden">
      <div className="bg-[#00BA9D] p-6 pb-12 text-center relative">
        <div className="text-white">
          <span className="text-6xl font-bold">
            {couponData.inStoreDiscount}%
          </span>
        </div>
        <div className="text-white text-2xl font-semibold mt-1">Off</div>
      </div>

      <div className="p-6 pt-8 text-center bg-white relative">
        <div className="text-[#00BA9D] mb-4">
          <div className="text-2xl font-bold">
            {couponData.platformDiscount}%
          </div>
          <div className="text-sm">Cashback from shoppinesmart</div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">Coupon Code</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-bold text-[#00BA9D]">
              {couponData.code}
            </span>
            <button
              onClick={handleCopy}
              className="text-[#00BA9D] hover:text-[#008D77] transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Button
          onClick={() => setOpen(false)}
          className="w-full bg-[#00BA9D] hover:bg-[#008D77] text-white font-semibold py-2 px-4 rounded-full transition-colors"
        >
          Save Coupon
        </Button>
      </div>
    </Card>
  );
}
