import { Card } from "@/components/ui/card";
import { Users, Tag, Ticket, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl ">Dashboard</h1>
        <Select defaultValue="today">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-3xl font-medium">10</div>
              <div className="text-sm text-muted-foreground mt-2">
                Total Customer
              </div>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg absolute bottom-2 right-2">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="h-[2.5px] bg-emerald-600 absolute w-full left-0 bottom-0"></div>
        </Card>

        <Card className="p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-3xl font-medium">20</div>
              <div className="text-sm text-muted-foreground mt-2">
                Total Product
              </div>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg absolute bottom-2 right-2">
              <Tag className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="h-[2.5px] bg-amber-600 absolute w-full left-0 bottom-0"></div>
        </Card>

        <Card className="p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-3xl font-medium">10</div>
              <div className="text-sm text-muted-foreground mt-2">
                Claimed Coupons
              </div>
            </div>
            <div className="p-2 bg-rose-100 rounded-lg absolute bottom-2 right-2">
              <Ticket className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="h-[2.5px] bg-rose-600 absolute w-full left-0 bottom-0"></div>
        </Card>

        <Card className="p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-3xl font-medium">07</div>
              <div className="text-sm text-muted-foreground mt-2">
                New Customer
              </div>
            </div>
            <div className="p-2 bg-gray-500 rounded-lg absolute bottom-2 right-2">
              <UserPlus className="w-5 h-5 text-white " />
            </div>
          </div>
          <div className="h-[2.5px] bg-gray-500 absolute w-full left-0 bottom-0"></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4 flex items-center gap-5 border-b">
            <h2 className="text-lg font-semibold">Claimed Coupons</h2>
            <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full font-bold">
              3
            </span>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead className="text-sm text-muted-foreground">
                <tr>
                  <th className="text-left font-medium py-2">Coupon ID</th>
                  <th className="text-left font-medium py-2">Name</th>
                  <th className="text-left font-medium py-2">Contact</th>
                  <th className="text-left font-medium py-2">Offer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    Coupon: "#ZTY7878",
                    Name: "Tithi Mondal",
                    Email: "email@gmail.com",
                    Phone: "+91 7036804082",
                    Offer: "20%"
                  },
                  {
                    Coupon: "#ZTY7878",
                    Name: "Pinki Mondal",
                    Email: "email@gmail.com",
                    Phone: "+91 7036804082",
                    Offer: "20%"
                  },
                  {
                    Coupon: "#ZTY7878",
                    Name: "Puja Mondal",
                    Email: "email@gmail.com",
                    Phone: "+91 7036804082",
                    Offer: "20%"
                  }
                ].map((item, index) => {
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-6">{item.Coupon}</td>
                      <td>{item.Name}</td>
                      <td className="text-sm">
                        <div>{item.Email}</div>
                        <div className="text-muted-foreground">
                          {item.Phone}
                        </div>
                      </td>
                      <td>{item.Offer} off</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="p-4 flex items-center border-b gap-5">
            <h2 className="text-lg font-semibold">New Customers</h2>
            <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full font-bold">
              7
            </span>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                {
                  name: "Taki Uchiha",
                  email: "email@gmail.com",
                  image: "https://cdn.pixabay.com/photo/2020/05/01/08/29/portrait-5115894_1280.jpg"
                },
                {
                  name: "Mia Nohara",
                  email: "email@gmail.com",
                  image: "https://plus.unsplash.com/premium_photo-1669138512601-e3f00b684edc?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                },
                {
                  name: "Raj Roy",
                  email: "email@gmail.com",
                  image: "https://cdn.pixabay.com/photo/2023/04/21/15/42/portrait-7942151_1280.jpg"
                },
                {
                  name: "Pihu Prajapati",
                  email: "email@gmail.com",
                  image: "https://plus.unsplash.com/premium_photo-1673792686302-7555a74de717?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
              ].map((customer) => (
                <div key={customer.name} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={customer.image} alt={customer.name} className="object-cover"/>
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
