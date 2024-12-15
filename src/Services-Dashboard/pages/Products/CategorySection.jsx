import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../Components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../../Components/ui/table";
import { Button } from "../../../Components/ui/button";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";

export default function CategoryTable({ id, refetchCategories }) {
  const [categories, setCategories] = React.useState([]);
  const [entriesPerPage, setEntriesPerPage] = React.useState("10");

  const handleDelete = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log("Edit category:", id);
  };

  React.useEffect(() => {
    const getCategoriesByShop = async (shopid) => {
      if (!shopid) return;
      try {
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, where("shop", "==", shopid));

        const querySnapshot = await getDocs(q);

        const categories = [];
        querySnapshot.forEach((doc) => {
          categories.push({ id: doc.id, ...doc.data() });
        });

        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategoriesByShop(id);
  }, [id, refetchCategories]);

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm">Show</span>
        <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm">entries</span>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Category name</TableHead>
              <TableHead className="w-[100px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{index + 1}.</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500"
                      onClick={() => handleEdit(category.id)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
