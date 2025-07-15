
"use client";

import { useState, useMemo } from "react";
import {
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from "@/lib/api/customerApi";
import { Toaster, toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Star,
  StarOff,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import Image from "next/image";

export default function CustomersPage() {
  const { data: customers = [], isLoading, error } = useGetCustomersQuery();
  const [updateCustomer] = useUpdateCustomerMutation();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter((customer) => {
      if (activeTab === "favorites" && !customer.favorite) return false;
      if (activeTab === "active" && customer.status !== "Active") return false;
      if (activeTab === "inactive" && customer.status !== "Inactive")
        return false;

      const query = searchQuery.toLowerCase();
      const name = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return (
        name.includes(query) || customer.email.toLowerCase().includes(query)
      );
    });
  }, [customers, activeTab, searchQuery]);

  const handleToggleFavorite = async (customer) => {
    try {
      await updateCustomer({
        id: customer._id,
        body: { favorite: !customer.favorite },
      }).unwrap();
      toast.success(`'${customer.firstName}' favorite status updated.`);
    } catch (err) {
      toast.error("Could not update customer.");
    }
  };

  const stats = useMemo(
    () => ({
      totalCustomers: customers?.length || 0,
      activeCustomers:
        customers?.filter((c) => c.status === "Active").length || 0,
      totalRevenue:
        customers?.reduce((sum, c) => sum + (c.totalSpent || 0), 0) || 0,
      avgSpend:
        customers?.length > 0
          ? customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) /
            customers.length
          : 0,
    }),
    [customers]
  );

 
  if (isLoading) return <div>Loading customers...</div>;
  if (error)
    return <div className="text-red-500">Error loading customers.</div>;

  return (
    <>
      <Toaster position="top-center" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Customer Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your art collectors and buyers
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
       
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Customers</p>
            <h3 className="text-2xl font-semibold">{stats.totalCustomers}</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Active Customers</p>
            <h3 className="text-2xl font-semibold text-green-600">
              {stats.activeCustomers}
            </h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-semibold text-blue-600">
              ${stats.totalRevenue.toFixed(2)}
            </h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Avg. Spend</p>
            <h3 className="text-2xl font-semibold text-purple-600">
              ${stats.avgSpend.toFixed(2)}
            </h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm mb-6">
        
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-0 border-b">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer._id} className="overflow-hidden border">
                
                <CardContent className="p-0">
                  <div className="p-4 flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 mr-3">
                        <Image
                          src={
                            customer.avatar ||
                            `https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}`
                          }
                          alt={`${customer.firstName} ${customer.lastName}`}
                          fill
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{`${customer.firstName} ${customer.lastName}`}</h3>
                        <p className="text-sm text-gray-600">
                          {customer.location || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleFavorite(customer)}
                      >
                        {customer.favorite ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t bg-gray-50">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Purchases</p>
                        <p className="text-sm font-medium">
                          {customer.purchases || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Spent</p>
                        <p className="text-sm font-medium">
                          ${customer.totalSpent || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p
                          className={`text-xs px-2 py-0.5 rounded-full inline-block ${customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {customer.status || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Last purchase:{" "}
                      {customer.lastPurchase
                        ? new Date(customer.lastPurchase).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
