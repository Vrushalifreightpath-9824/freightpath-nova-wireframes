import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TmsLayout } from "../TmsLayout";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { StatusBadge } from "@/components/ui/status-badge";

const templateOrders = [
  {
    id: "ORD-001",
    customer: "ABC Logistics Inc.",
    poNumber: "PO-2024-001",
    pickupDate: "2024-01-15",
    deliveryDate: "2024-01-18",
    status: "created" as const,
    division: "West",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    weight: "15,000 lbs",
    value: "$2,850.00",
    orderType: "FTL" as const,
    shipments: [{ id: "SHIP-001", status: "planned" }]
  }
  // Add more mock data as needed
];

export function OrderTemplatePicker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [previewOrder, setPreviewOrder] = useState<typeof templateOrders[0] | null>(null);

  const navigate = useNavigate();

  const filteredOrders = templateOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = orderTypeFilter === "all" || order.orderType === orderTypeFilter;
    return matchesSearch && matchesType;
  });
  const getOrderTypeBadge = (orderType: string) => {
    return orderType === "FTL" ? 
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">FTL</Badge> :
      <Badge className="bg-green-100 text-green-800 border-green-200">LTL</Badge>;
  };

  return (
    <TmsLayout 
    title="Select a Template Order"
    breadcrumbs={[
      { label: "Order Templates" }
    ]}
  >
    <div className="p-6 space-y-6">
      {/* <div>
        <h1 className="text-2xl font-bold">Select a Template Order</h1>
        <p className="text-muted-foreground">Choose an existing order to use as a starting point for a new one.</p>
      </div> */}

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by customer, PO or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Order Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="FTL">FTL</SelectItem>
            <SelectItem value="LTL">LTL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Temp. Name/Category</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>Food items</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    {order.origin} → {order.destination}
                  </TableCell>
                  <TableCell>
                    <Badge>{order.orderType}</Badge>
                  </TableCell>
                  <TableCell>{order.weight}</TableCell>
                  <TableCell>{order.value}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/orders/create?from=${order.id}`)}
                      >
                        Use Template
                      </Button>
                      <Button onClick={() => setPreviewOrder(order)} variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

     {/* Order Preview Dialog */}
     <Dialog open={!!previewOrder} onOpenChange={() => setPreviewOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order Preview: {previewOrder?.id}
              {previewOrder && getOrderTypeBadge(previewOrder.orderType)}
            </DialogTitle>
          </DialogHeader>
          {previewOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Customer:</strong> {previewOrder.customer}</div>
                <div><strong>PO Number:</strong> {previewOrder.poNumber}</div>
                <div><strong>Status:</strong> <StatusBadge status={previewOrder.status} /></div>
                <div><strong>Weight:</strong> {previewOrder.weight}</div>
                <div><strong>Value:</strong> {previewOrder.value}</div>
                <div><strong>Division:</strong> {previewOrder.division}</div>
              </div>
              <div>
                <strong>Route:</strong>
                <div className="text-sm text-muted-foreground mt-1">
                  {previewOrder.origin} → {previewOrder.destination}
                </div>
              </div>
              <div>
                <strong>Linked Shipments:</strong>
                <div className="flex gap-2 mt-2">
                  {previewOrder.shipments.length > 0 ? (
                    previewOrder.shipments.map((shipment) => (
                      <Button
                        key={shipment.id}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewOrder(null);
                          navigate(`/shipments/${shipment.id}`);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {shipment.id}
                      </Button>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">No shipments assigned</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  setPreviewOrder(null);
                  navigate(`/orders/${previewOrder.id}`);
                }}>
                  View Full Details
                </Button>
                <Button variant="outline" onClick={() => setPreviewOrder(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TmsLayout>
  );
}
