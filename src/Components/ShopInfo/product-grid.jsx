import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";

export default function ProductGrid({ productList }) {
  const { userId, shopId } = useParams();

  return (
    <div className="flex justify-between p-4">
      {productList.map((product) => (
        <Link
          to={`/user-dashboard/${userId}/shop-info/${shopId}/product-info/${product.id}`}
        >
          <Card key={product.id} className="cursor-pointer">
            <CardContent className="p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover h-40 w-80"
              />
              <div className="p-4">
                <h3 className="text-base font-medium">{product.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg text-gray-500 opacity-50 line-through">
                    ₹
                    {Number(product.price) +
                      Number((product.price * product.discount) / 100)}
                  </span>
                  <span className="text-lg font-bold">₹{product.price}</span>
                  <span className="text-sm text-green-600 font-medium">
                    {product.discount}% off
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
