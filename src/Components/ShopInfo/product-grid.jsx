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

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <img
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 text-sm font-medium">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-bold">₹{product.price}</span>
                <span className="text-sm text-green-600">Save ₹2000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
