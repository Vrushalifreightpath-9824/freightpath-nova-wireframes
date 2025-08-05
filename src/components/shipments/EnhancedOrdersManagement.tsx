
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, X, Edit, Plus, List, Package, MapPin, User } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  poNumber: string;
  orderType: "FTL" | "LTL";
  status: string;
  linkedStops: string[];
  weight: string;
  dimensions: string;
  packageType: string;
  pickupLocation: string;
  deliveryLocation: string;
}

interface EnhancedOrdersManagementProps {
  orders: Order[];
  onOrdersUpdate: (orders: Order[]) => void;
  executionMode: "asset" | "brokered" | "hybrid";
}

const sampleOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "ACME Corp",
    poNumber: "PO123456",
    orderType: "FTL",
    status: "Awaiting POD",
    linkedStops: ["Stop 1", "Stop 3"],
    weight: "2,500 lbs",
    dimensions: "48x40x36",
    packageType: "Pallets",
    pickupLocation: "Brooklyn, NY",
    deliveryLocation: "Boston, MA"
  },
  {
    id: "ORD-002",
    customer: "ACME Corp",
    poNumber: "PO123457",
    orderType: "LTL",
    status: "In Transit",
    linkedStops: ["Stop 2", "Stop 3"],
    weight: "1,200 lbs",
    dimensions: "24x18x12",
    packageType: "Boxes",
    pickupLocation: "Queens, NY",
    deliveryLocation: "Boston, MA"
  }
];

export function EnhancedOrdersManagement({ orders: initialOrders, onOrdersUpdate, executionMode }: EnhancedOrdersManagementProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders || sampleOrders);
  const [viewMode, setViewMode] = useState<"list" | "tabs">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuickOrderForm, setShowQuickOrderForm] = useState(false);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.poNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddQuickOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${(orders.length + 1).toString().padStart(3, '0')}`
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    onOrdersUpdate(updatedOrders);
    setShowQuickOrderForm(false);
  };

  const handleUnlinkOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    onOrdersUpdate(updatedOrders);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Enhanced Orders Management</h3>
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <ToggleGroup type="single" value={viewMode}  
          onValueChange={(value) => {
            setViewMode(value as "list" | "tabs")
          }}
          // onValueChange={(value) => value && setViewMode(value as "list" | "tabs")}
          >
            <ToggleGroupItem value="list" aria-label="List View">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="tabs" aria-label="Tabbed View">
              <Tabs className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button onClick={() => setShowQuickOrderForm(!showQuickOrderForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Quick Order
          </Button>
        </div>
      </div>

      {/* Quick Order Form */}
      {showQuickOrderForm && (
        <Card className="border-2 border-dashed border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Quick Order Entry</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuickOrderForm onSubmit={handleAddQuickOrder} onCancel={() => setShowQuickOrderForm(false)} />
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search by Order ID, Customer, PO#..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "list" ? (
        <ListView orders={filteredOrders} onUnlinkOrder={handleUnlinkOrder} />
      ) : (
        <TabbedView orders={filteredOrders} onUnlinkOrder={handleUnlinkOrder} />
      )}
    </div>
  );
}

interface ListViewProps {
  orders: Order[];
  onUnlinkOrder: (orderId: string) => void;
}

function ListView({ orders, onUnlinkOrder }: ListViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders in Shipment</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>PO#</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stops</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.poNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    order.orderType === 'FTL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }>
                    {order.orderType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {order.linkedStops.map(stop => (
                      <Badge key={stop} variant="outline" className="text-xs">
                        {stop}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <div>{order.weight}</div>
                  <div className="text-muted-foreground">{order.packageType}</div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onUnlinkOrder(order.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Unlink
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface TabbedViewProps {
  orders: Order[];
  onUnlinkOrder: (orderId: string) => void;
}

function TabbedView({ orders, onUnlinkOrder }: TabbedViewProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue={orders[0]?.id || "empty"} className="w-full">
          <TabsList className="grid w-full grid-cols-auto gap-0 h-auto p-1" style={{ gridTemplateColumns: `repeat(${Math.min(orders.length + 1, 6)}, 1fr)` }}>
            {orders.slice(0, 5).map((order) => (
              <TabsTrigger key={order.id} value={order.id} className="flex items-center space-x-2 px-3 py-2">
                <Package className="h-3 w-3" />
                <span className="text-xs">{order.id}</span>
              </TabsTrigger>
            ))}
            {orders.length > 5 && (
              <TabsTrigger value="more" className="text-xs">
                +{orders.length - 5} more
              </TabsTrigger>
            )}
          </TabsList>

          {orders.map((order) => (
            <TabsContent key={order.id} value={order.id} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold">{order.id}</h4>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={
                    order.orderType === 'FTL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }>
                    {order.orderType}
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {order.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Details */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">PO NUMBER</Label>
                    <p className="font-medium">{order.poNumber}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">CARGO SUMMARY</Label>
                    <div className="space-y-1">
                      <p className="font-medium">{order.packageType}</p>
                      <p className="text-sm text-muted-foreground">{order.weight} • {order.dimensions}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">LINKED STOPS</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {order.linkedStops.map(stop => (
                        <Badge key={stop} variant="outline" className="text-xs">
                          {stop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">PICKUP LOCATION</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{order.pickupLocation}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">DELIVERY LOCATION</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{order.deliveryLocation}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onUnlinkOrder(order.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Unlink
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}

          {orders.length === 0 && (
            <TabsContent value="empty" className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders linked to this shipment</p>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface QuickOrderFormProps {
  onSubmit: (order: Omit<Order, 'id'>) => void;
  onCancel: () => void;
}

function QuickOrderForm({ onSubmit, onCancel }: QuickOrderFormProps) {
  const [formData, setFormData] = useState({
    customer: "",
    poNumber: "",
    orderType: "FTL" as "FTL" | "LTL",
    status: "Created",
    linkedStops: [] as string[],
    weight: "",
    dimensions: "",
    packageType: "",
    pickupLocation: "",
    deliveryLocation: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Customer</Label>
          <Input
            value={formData.customer}
            onChange={(e) => setFormData({...formData, customer: e.target.value})}
            placeholder="ACME Corp"
            required
          />
        </div>

        <div>
          <Label>PO Number</Label>
          <Input
            value={formData.poNumber}
            onChange={(e) => setFormData({...formData, poNumber: e.target.value})}
            placeholder="PO123456"
            required
          />
        </div>

        <div>
          <Label>Order Type</Label>
          <Select 
            value={formData.orderType} 
            onValueChange={(value: "FTL" | "LTL") => setFormData({...formData, orderType: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FTL">FTL - Full Truckload</SelectItem>
              <SelectItem value="LTL">LTL - Less Than Truckload</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Pickup Location</Label>
          <Input
            value={formData.pickupLocation}
            onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
            placeholder="Brooklyn, NY"
            required
          />
        </div>

        <div>
          <Label>Delivery Location</Label>
          <Input
            value={formData.deliveryLocation}
            onChange={(e) => setFormData({...formData, deliveryLocation: e.target.value})}
            placeholder="Boston, MA"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Weight</Label>
          <Input
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
            placeholder="2,500 lbs"
          />
        </div>

        <div>
          <Label>Dimensions</Label>
          <Input
            value={formData.dimensions}
            onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
            placeholder="48x40x36"
          />
        </div>

        <div>
          <Label>Package Type</Label>
          <Input
            value={formData.packageType}
            onChange={(e) => setFormData({...formData, packageType: e.target.value})}
            placeholder="Pallets"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create & Link Order
        </Button>
      </div>
    </form>
  );
}
