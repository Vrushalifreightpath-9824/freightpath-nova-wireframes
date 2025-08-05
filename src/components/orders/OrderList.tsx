
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, MoreHorizontal, Download, Upload, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";

const orders = [
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
  },
  {
    id: "ORD-002", 
    customer: "Global Supply Chain",
    poNumber: "PO-2024-002",
    pickupDate: "2024-01-16",
    deliveryDate: "2024-01-19",
    status: "planned" as const,
    division: "East",
    origin: "Atlanta, GA",
    destination: "Miami, FL", 
    weight: "22,500 lbs",
    value: "$3,200.00",
    orderType: "LTL" as const,
    shipments: [
      { id: "SHIP-201", status: "planned" },
      { id: "SHIP-202", status: "tendered" }
    ]
  },
  {
    id: "ORD-003",
    customer: "TechCorp Solutions",
    poNumber: "PO-2024-003", 
    pickupDate: "2024-01-14",
    deliveryDate: "2024-01-17",
    status: "in-transit" as const,
    division: "Central",
    origin: "Chicago, IL",
    destination: "Denver, CO",
    weight: "18,750 lbs", 
    value: "$4,100.00",
    orderType: "LTL" as const,
    shipments: []
  },
  {
    id: "ORD-004",
    customer: "Manufacturing Plus",
    poNumber: "PO-2024-004",
    pickupDate: "2024-01-13",
    deliveryDate: "2024-01-16", 
    status: "tendered" as const,
    division: "West",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    weight: "12,000 lbs",
    value: "$1,950.00",
    orderType: "LTL" as const,
    shipments: [{ id: "SHIP-301", status: "dispatched" }]
  },
  {
    id: "ORD-005",
    customer: "Retail Network LLC",
    poNumber: "PO-2024-005",
    pickupDate: "2024-01-12",
    deliveryDate: "2024-01-15",
    status: "delivered" as const,
    division: "South",
    origin: "Houston, TX", 
    destination: "Dallas, TX",
    weight: "8,500 lbs",
    value: "$1,200.00",
    orderType: "FTL" as const,
    shipments: [{ id: "SHIP-401", status: "delivered" }]
  }
];

export function OrderList() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>("all");
  const [previewOrder, setPreviewOrder] = useState<typeof orders[0] | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const navigate = useNavigate();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const getOrderTypeBadge = (orderType: string) => {
    return orderType === "FTL" ? 
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">FTL</Badge> :
      <Badge className="bg-green-100 text-green-800 border-green-200">LTL</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesOrderType = orderTypeFilter === "all" || order.orderType === orderTypeFilter;

    return matchesSearch && matchesStatus && matchesOrderType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header and filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="tendered">Tendered</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

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

        <div className="flex items-center gap-2">
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2 mr-4">
              <Badge variant="secondary">{selectedOrders.length} selected</Badge>
              <Button variant="outline" size="sm">
                Bulk Edit
              </Button>
              <Button variant="outline" size="sm">
                Cancel Selected
              </Button>
            </div>
          )}
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link to="/orders/bulk-upload">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          </Link>
          
          
          {/* <Button asChild>
            <Link to="/orders/create">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Link>
          </Button> */}

          <Button onClick={() => setOpenCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === orders.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Shipments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setPreviewOrder(order)}
                  onDoubleClick={() => navigate(`/orders/${order.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-primary">{order.id}</TableCell>
                  <TableCell>
                    {getOrderTypeBadge(order.orderType)}
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.origin}</div>
                      <div className="text-muted-foreground">→ {order.destination}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.weight}</TableCell>
                  <TableCell className="font-medium">{order.value}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {order.shipments.length > 0 ? (
                        order.shipments.map((shipment) => (
                          <Button
                            key={shipment.id}
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/shipments/${shipment.id}`);
                            }}
                          >
                            {shipment.id}
                          </Button>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/orders/${order.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Use this Template</DropdownMenuItem>
                        <DropdownMenuItem>Edit Order</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedOrders.length > 1 && (
  <div className="flex justify-end items-center mt-4">
    <Button
      onClick={() => {
        // You can route to shipment creation flow or handle selection logic here
        navigate("/shipments/create?orders=" + selectedOrders.join(","));
      }}
    >
      Create Shipment
    </Button>
  </div>
)}


      {/* Dialog Content */}
<Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Create New Order</DialogTitle>
    </DialogHeader>
    <p className="text-sm text-muted-foreground mb-4">
      Would you like to start from scratch or use an existing order as a template?
    </p>
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        onClick={() => {
          setOpenCreateDialog(false);
          navigate("/orders/OrderTemplatePicker"); // You can modify this route logic
        }}
      >
        Use Template
      </Button>
      <Button
        onClick={() => {
          setOpenCreateDialog(false);
          navigate("/orders/create");
        }}
      >
        Create from Scratch
      </Button>
    </div>
  </DialogContent>
</Dialog>

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
    </div>
  );
}
