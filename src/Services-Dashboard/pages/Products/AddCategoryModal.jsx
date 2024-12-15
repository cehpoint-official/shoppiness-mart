import { useState } from "react";
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "../../../Components/ui/dialog";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase";

export default function AddCategoryModal({ id, setRefetchCategories }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "categories"), {
        name: category,
        shop: id
      });
      setRefetchCategories((prev) => !prev);
      setOpen(false);
      setCategory("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="bg-green-500">
        Add Category
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Add a new Categorise</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
          >
            SAVE
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
