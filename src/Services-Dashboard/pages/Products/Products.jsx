import "./Products.scss";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useState } from "react";
import CategorySection from "./CategorySection";
import { ArrowLeft } from "lucide-react";
import AddCategoryModal from "./AddCategoryModal";
import { useParams } from "react-router-dom";
import AddProductSection from "./AddProductSection";

const services = [
  {
    id: 1,
    name: "Hair cutting service",
    image: "/placeholder.svg",
    price: 500,
    discount: "20% Off",
    createOn: "20/05/2024",
    category: "Hair Cut",
    status: "Active"
  },
  {
    id: 2,
    name: "Facial service",
    image: "/placeholder.svg",
    price: 500,
    discount: "20% Off",
    createOn: "20/05/2024",
    category: "Facial",
    status: "Active"
  },
  {
    id: 3,
    name: "Spa service",
    image: "/placeholder.svg",
    price: 500,
    discount: "Cashback Rs.50",
    createOn: "20/05/2024",
    category: "SPA",
    status: "Active"
  }
];
const Products = () => {
  const { id } = useParams();
  const [tabs, setTabs] = useState(
    Number(sessionStorage.getItem("service-portal-tabs")) || 0
  );
  const [refetchCategories, setRefetchCategories] = useState(false);
  return (
    <div className="products">
      <div className="top-section">
        <div className="title">
          {tabs === 0 ? (
            <h1>Add product/Service</h1>
          ) : (
            <h1
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => {
                setTabs(0);
                sessionStorage.setItem("service-portal-tabs", 0);
              }}
            >
              <ArrowLeft className="relative top-[2px]" /> Back
            </h1>
          )}
        </div>
        <div className="buttons">
          {tabs === 0 && (
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setTabs(1);
                  sessionStorage.setItem("service-portal-tabs", 1);
                }}
              >
                +Add Category
              </button>
              <button
                onClick={() => {
                  setTabs(2);
                  sessionStorage.setItem("service-portal-tabs", 2);
                }}
              >
                +Add New
              </button>
            </div>
          )}
          {tabs === 1 && (
            <div className="flex gap-4">
              <AddCategoryModal
                id={id}
                setRefetchCategories={setRefetchCategories}
              />
              <button className="hidden">+Add New</button>
            </div>
          )}
          {tabs === 2 && (
            <div className="flex gap-4">
              <button className="hidden">+Add Category</button>
              <button onClick={() => setTabs(1)}>+Add New</button>
            </div>
          )}
        </div>
      </div>
      <div className="bottom-section">
        {tabs === 0 && (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Service</TableHead>
                  <TableHead>Create on</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            "https://content.jdmagicbox.com/comp/def_content/salons/default-salons-9.jpg"
                          }
                          alt={service.name}
                          className="rounded-lg object-cover h-20 w-20"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{service.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">
                              ₹ {service.price}
                            </span>
                            <span className="text-green-600">
                              {service.discount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {service.createOn}
                    </TableCell>
                    <TableCell className="font-medium">
                      {service.category}
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">
                        {service.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {tabs === 1 && (
          <CategorySection id={id} refetchCategories={refetchCategories} />
        )}
        {tabs === 2 && <AddProductSection id={id} />}
      </div>
    </div>
  );
};

export default Products;
