import { Card, CardContent } from "@/components/ui/card";

const products = [
  {
    id: 1,
    name: "24 LG Micro FHD Virtually Borderless IPS",
    price: 17990,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "24 LG Micro PRO Virtually Borderless IPS",
    price: 17990,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "24 LG Micro FHD Virtually Borderless IPS",
    price: 17990,
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "24 LG Micro FHD Virtually Borderless IPS",
    price: 17990,
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "24 LG Micro PRO Virtually Borderless IPS",
    price: 17990,
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "24 LG Micro FHD Virtually Borderless IPS",
    price: 17990,
    image: "/placeholder.svg"
  }
];

export default function ProductGrid({ productList }) {
  return (
    <div className="flex justify-between p-4">
      {productList.map((product) => (
        <Card key={product.id}>
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
      ))}
    </div>
  );
}
