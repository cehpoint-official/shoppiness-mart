import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function AddProductForm() {
  function handleImageUpload(event) {}
  return (
    <div className="px-20">
      <h1 className="text-xl font-medium mb-8 text-center">
        Add Product/Service
      </h1>

      <div className="flex w-full justify-between gap-8">
        <div className="space-y-4">
          <div className="border-2 w-[300px] h-[300px] border-dashed rounded-lg p-4 text-center flex flex-col items-center justify-center bg-muted/10">
            <img src="" alt="" className="" />
          </div>
          <div className="text-sm text-muted-foreground text-center">
            (Upload Format - jpg, png,jpeg ; )
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
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="space-y-6 w-[60%]">
          <div className="gap-12 flex items-center justify-end">
            <Label htmlFor="name" className="w-1/4">
              Product/Service Name
            </Label>
            <Input id="name" placeholder="Add name" className="w-1/2" />
          </div>

          <div className="gap-12 flex items-center justify-end">
            <Label htmlFor="price" className="w-1/4">
              Price
            </Label>
            <Input id="price" placeholder="Add price" className="w-1/2" />
          </div>

          <div className="gap-12 flex items-center justify-end">
            <Label htmlFor="category" className="w-1/4">
              Select Category
            </Label>
            <Select>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category1">Category 1</SelectItem>
                <SelectItem value="category2">Category 2</SelectItem>
                <SelectItem value="category3">Category 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="gap-12 flex items-center justify-end">
            <Label htmlFor="discountType" className="w-1/4">
              Discount Type
            </Label>
            <Select>
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
            <Input id="discount" placeholder="Add discount" className="w-1/2" />
          </div>

          <div className="flex items-center justify-end gap-12 ">
            <Label htmlFor="description " className="w-1/4">
              Product Description
            </Label>
            <Textarea
              id="description"
              placeholder="Explain about your item"
              className="min-h-[100px] w-1/2"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
          Add new Product/Service
        </Button>
      </div>
    </div>
  );
}
