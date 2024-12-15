import { useEffect, useState } from "react";
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import { Label } from "../../../Components/ui/label";
import { Textarea } from "../../../Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../Components/ui/select";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../../firebase";

export default function AddProductForm({ id }) {
  const [categoryList, setCategoryList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    discountType: "",
    discount: "",
    description: "",
    imageUrl: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getCategoriesByShop = async (id) => {
      if (!id) return;
      try {
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, where("shop", "==", id));

        const querySnapshot = await getDocs(q);
        const categories = [];
        querySnapshot.forEach((doc) => {
          categories.push({ id: doc.id, ...doc.data() });
        });

        setCategoryList(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategoriesByShop(id);
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `products/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productData = {
        ...formData,
        shop: id,
        imageUrl,
        createdAt: new Date(),
        status: "Active"
      };

      await addDoc(collection(db, "productDetails"), productData);
      // alert("Product added successfully!");
      setFormData({
        name: "",
        price: "",
        category: "",
        discountType: "",
        discount: "",
        description: "",
        imageUrl: ""
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(imageFile);
  }, [imageFile]);

  return (
    <div className="px-20">
      <h1 className="text-xl font-medium mb-8 text-center">
        Add Product/Service
      </h1>

      <div className="flex w-full justify-between gap-8">
        <div className="space-y-4">
          <div className="border-2 w-[300px] h-[300px] border-dashed rounded-lg p-4 text-center flex flex-col items-center justify-center bg-muted/10">
            {imageFile ? (
              <img
                src={URL.createObjectURL(
                  new Blob([imageFile], { type: imageFile.type })
                )}
                alt="Product"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>Upload Product Image</span>
            )}
          </div>
          <div className="text-sm text-muted-foreground text-center">
            (Upload Format - jpg, png, jpeg)
          </div>
          <div className="flex justify-center">
            <Button
              variant="default"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              ⬆️ Upload
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="space-y-6 w-[60%]">
          <div className="gap-12 flex items-center justify-end">
            <Label htmlFor="name" className="w-1/4">
              Product/Service Name
            </Label>
            <Input
              id="name"
              placeholder="Add name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-1/2"
            />
          </div>

          <div className="gap-12 flex items-center justify-end">
            <Label htmlFor="price" className="w-1/4">
              Price
            </Label>
            <Input
              id="price"
              placeholder="Add price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-1/2"
            />
          </div>

          <div className="gap-12 flex items-center justify-end">
            <Label htmlFor="category" className="w-1/4">
              Select Category
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                {categoryList.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="gap-12 flex items-center justify-end">
            <Label htmlFor="discountType" className="w-1/4">
              Discount Type
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, discountType: value }))
              }
            >
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="gap-12 flex items-center justify-end">
            <Label htmlFor="discount" className="w-1/4">
              Discount
            </Label>
            <Input
              id="discount"
              placeholder="Add discount"
              value={formData.discount}
              onChange={handleInputChange}
              className="w-1/2"
            />
          </div>

          <div className="flex items-center justify-end gap-12">
            <Label htmlFor="description" className="w-1/4">
              Product Description
            </Label>
            <Textarea
              id="description"
              placeholder="Explain about your item"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[100px] w-1/2"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-8"
          onClick={handleFormSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add new Product/Service"}
        </Button>
      </div>
    </div>
  );
}
