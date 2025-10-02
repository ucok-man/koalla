"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ImageUp,
  ImageUpscale,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type OrderStatus = "fulfilled" | "shipped" | "awaiting_shipment";

const statusColors: Record<OrderStatus, string> = {
  fulfilled: "bg-green-100 text-green-800 border-green-200",
  shipped: "bg-blue-100 text-blue-800 border-blue-200",
  awaiting_shipment: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const statusLabels: Record<OrderStatus, string> = {
  fulfilled: "Fulfilled",
  shipped: "Shipped",
  awaiting_shipment: "Awaiting Shipment",
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Get params from URL
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = (searchParams.get("status") || "all") as "all" | OrderStatus;
  const sortOrder = (searchParams.get("sort") || "desc") as "asc" | "desc";

  // Local state for immediate UI updates
  const [searchInput, setSearchInput] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput, page: "1" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch orders
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery(
    trpc.order.getDashboardOrders.queryOptions(
      {
        page,
        limit: 5,
        search,
        status,
        sortOrder,
      },
      {
        staleTime: 0,
      }
    )
  );

  // Fetch revenue metrics
  const { data: revenueData, isLoading: revenueLoading } = useQuery(
    trpc.order.getRevenueMetrics.queryOptions()
  );

  // Mutation for updating order status
  const updateStatus = useMutation(
    trpc.order.updateOrderStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.order.getDashboardOrders.queryOptions({
            page,
            limit: 5,
            search,
            status,
            sortOrder,
          })
        );

        queryClient.invalidateQueries(
          trpc.order.getRevenueMetrics.queryOptions()
        );

        queryClient.refetchQueries(
          trpc.order.getDashboardOrders.queryOptions({
            page,
            limit: 5,
            search,
            status,
            sortOrder,
          })
        );

        queryClient.refetchQueries(trpc.order.getRevenueMetrics.queryOptions());
      },
    })
  );

  // Helper function to update URL params
  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus.mutate({ orderId, status: newStatus });
  };

  const handleStatusFilter = (value: string) => {
    updateParams({ status: value, page: "1" });
  };

  const handleSortToggle = () => {
    updateParams({ sort: sortOrder === "asc" ? "desc" : "asc" });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-9 rounded-lg">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Orders Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and track all your orders
          </p>
        </div>

        {/* Revenue Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                This Week Revenue
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${revenueData?.weekRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                This Month Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${revenueData?.monthRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Current month</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                This Year Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${revenueData?.yearRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Year to date</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              {/* Search */}
              <Input
                placeholder="Search by user name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="sm:max-w-xs"
              />

              {/* Status Filter */}
              <Select value={status} onValueChange={handleStatusFilter}>
                <SelectTrigger className="sm:w-[200px] w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="border-border">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="awaiting_shipment">
                    Awaiting Shipment
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Button
                variant="outline"
                className="border-border text-sm font-normal"
                onClick={handleSortToggle}
              >
                Sort by Date: {sortOrder === "asc" ? "Oldest" : "Newest"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : ordersError ? (
              <div className="text-center py-8 text-red-600">
                Error loading orders: {ordersError.message}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Purchased At</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!ordersData?.orders || ordersData.orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        ordersData.orders.map((order) => (
                          <TableRow key={order.id} className="border-border">
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {order.user.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {order.user.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value: OrderStatus) =>
                                  handleStatusChange(order.id, value)
                                }
                                disabled={updateStatus.isPending}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue>
                                    <Badge
                                      variant="outline"
                                      className={statusColors[order.status]}
                                    >
                                      {statusLabels[order.status]}
                                    </Badge>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="border-border">
                                  <SelectItem value="fulfilled">
                                    Fulfilled
                                  </SelectItem>
                                  <SelectItem value="shipped">
                                    Shipped
                                  </SelectItem>
                                  <SelectItem value="awaiting_shipment">
                                    Awaiting Shipment
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              ${order.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="View Original Image"
                                  asChild
                                >
                                  <a
                                    href={order.configuration.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ImageUp className="h-4 w-4" />
                                  </a>
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title="View Cropped Image"
                                >
                                  <a
                                    href={
                                      order.configuration.croppedImageUrl ||
                                      order.configuration.imageUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ImageUpscale className="h-4 w-4 text-blue-600" />
                                  </a>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {ordersData && ordersData.pagination.totalPages > 1 && (
                  <div className="flex max-sm:flex-col gap-4 items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing{" "}
                      {(ordersData.pagination.page - 1) *
                        ordersData.pagination.limit +
                        1}{" "}
                      to{" "}
                      {Math.min(
                        ordersData.pagination.page *
                          ordersData.pagination.limit,
                        ordersData.pagination.total
                      )}{" "}
                      of {ordersData.pagination.total} orders
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === ordersData.pagination.totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
