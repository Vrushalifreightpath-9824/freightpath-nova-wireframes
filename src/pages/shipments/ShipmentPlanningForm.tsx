
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, GripVertical, MapPin, Package, Truck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Stop {
  id: string;
  type: "pickup" | "delivery" | "terminal" | "customs" | "drop";
  location: string;
  address: string;
  timeWindow: string;
  orderId?: string;
  notes?: string;
}

interface Order {
  id: string;
  customer: string;
  poNumber: string;
  origin: string;
  destination: string;
  pallets: number;
  weight: number;
  equipment: string;
  orderType: "FTL" | "LTL";
}

const availableOrders: Order[] = [
  {
    id: "ORD-006",
    customer: "ACME Corp",
    poNumber: "PO123456",
    origin: "New York, NY",
    destination: "Boston, MA", 
    pallets: 5,
    weight: 2500,
    equipment: "Dry Van",
    orderType: "FTL"
  },
  {
    id: "ORD-007",
    customer: "ACME Corp", 
    poNumber: "PO123457",
    origin: "New York, NY",
    destination: "Hartford, CT",
    pallets: 3,
    weight: 1800,
    equipment: "Dry Van",
    orderType: "LTL"
  },
  {
    id: "ORD-008",
    customer: "Global Logistics",
    poNumber: "GL789012", 
    origin: "Albany, NY",
    destination: "Boston, MA",
    pallets: 7,
    weight: 3200,
    equipment: "Dry Van",
    orderType: "FTL"
  },
  {
    id: "ORD-009",
    customer: "Regional Freight",
    poNumber: "RF456789", 
    origin: "Springfield, MA",
    destination: "Worcester, MA",
    pallets: 2,
    weight: 950,
    equipment: "Dry Van",
    orderType: "LTL"
  }
];

export function ShipmentPlanningForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [executionMode, setExecutionMode] = useState<string>("");
  const [equipment, setEquipment] = useState<string>("");
  const [stops, setStops] = useState<Stop[]>([]);

  const handleOrderSelection = (order: Order, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, order]);
      // Auto-generate stops from order
      const pickupStop: Stop = {
        id: `pickup-${order.id}`,
        type: "pickup",
        location: order.origin,
        address: order.origin,
        timeWindow: "08:00 - 17:00",
        orderId: order.id
      };
      const deliveryStop: Stop = {
        id: `delivery-${order.id}`,
        type: "delivery", 
        location: order.destination,
        address: order.destination,
        timeWindow: "08:00 - 17:00",
        orderId: order.id
      };
      setStops([...stops, pickupStop, deliveryStop]);
    } else {
      setSelectedOrders(selectedOrders.filter(o => o.id !== order.id));
      setStops(stops.filter(s => s.orderId !== order.id));
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(stops);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStops(items);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shipmentType = getShipmentType();
    toast({
      title: "Shipment Created Successfully", 
      description: `${shipmentType} shipment with ${selectedOrders.length} orders and ${stops.length} stops has been planned.`,
    });
    navigate("/shipments");
  };

  const isOrderCompatible = (order: Order) => {
    if (selectedOrders.length === 0) return true;
    
    // Check equipment compatibility
    const equipmentCompatible = selectedOrders.every(selected => selected.equipment === order.equipment);
    
    // FTL orders typically shouldn't be mixed with other orders
    const typeCompatible = selectedOrders.every(selected => {
      if (selected.orderType === "FTL" || order.orderType === "FTL") {
        return selected.orderType === order.orderType && selectedOrders.length === 0;
      }
      return true; // LTL orders can be mixed
    });
    
    return equipmentCompatible && typeCompatible;
  };

  const getOrderTypeBadge = (orderType: "FTL" | "LTL") => {
    return orderType === "FTL" 
      ? <Badge className="bg-blue-100 text-blue-800 border-blue-200">FTL</Badge>
      : <Badge className="bg-green-100 text-green-800 border-green-200">LTL</Badge>;
  };

  const getShipmentType = () => {
    if (selectedOrders.length === 0) return "Unknown";
    const ftlCount = selectedOrders.filter(o => o.orderType === "FTL").length;
    const ltlCount = selectedOrders.filter(o => o.orderType === "LTL").length;
    
    if (ftlCount > 0 && ltlCount > 0) return "Mixed";
    if (ftlCount > 0) return "FTL";
    return "LTL";
  };

  const getTotalStats = () => {
    return {
      pallets: selectedOrders.reduce((sum, order) => sum + order.pallets, 0),
      weight: selectedOrders.reduce((sum, order) => sum + order.weight, 0),
      orders: selectedOrders.length,
      stops: stops.length,
      type: getShipmentType()
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">Plan New Shipment</h1>
              {stats.type !== "Unknown" && getOrderTypeBadge(stats.type as "FTL" | "LTL")}
            </div>
            <p className="text-muted-foreground">Consolidate orders and optimize routing</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Create {stats.type} Shipment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Available Orders</CardTitle>
              <CardDescription>Select compatible orders to consolidate into this shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableOrders.map((order) => {
                const isSelected = selectedOrders.some(o => o.id === order.id);
                const isCompatible = isOrderCompatible(order);
                
                return (
                  <div 
                    key={order.id} 
                    className={`p-4 border rounded-lg ${
                      !isCompatible ? 'opacity-50 bg-muted/50' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={isSelected}
                        disabled={!isCompatible}
                        onCheckedChange={(checked) => handleOrderSelection(order, !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{order.id}</span>
                            {getOrderTypeBadge(order.orderType)}
                            <Badge variant="outline">{order.equipment}</Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{order.customer}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{order.origin} → {order.destination}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{order.pallets} pallets</span>
                          <span>{order.weight.toLocaleString()} lbs</span>
                          <span>PO: {order.poNumber}</span>
                        </div>
                        {!isCompatible && (
                          <div className="mt-2 text-xs text-amber-600">
                            ⚠ Not compatible with selected orders
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Stop Sequence */}
          {stops.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Stop Sequence</CardTitle>
                <CardDescription>Drag and drop to reorder stops for optimal routing</CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="stops">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {stops.map((stop, index) => (
                          <Draggable key={stop.id} draggableId={stop.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-3 border rounded-lg bg-card ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      stop.type === 'pickup' ? 'bg-blue-500' : 'bg-green-500'
                                    }`} />
                                    <span className="font-medium capitalize">{stop.type}</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm">{stop.location}</div>
                                    {stop.orderId && (
                                      <div className="text-xs text-muted-foreground">Order: {stop.orderId}</div>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{stop.timeWindow}</div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Shipment Configuration */}
        <div className="space-y-6">
          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Shipment Summary
                {stats.type !== "Unknown" && getOrderTypeBadge(stats.type as "FTL" | "LTL")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium">{stats.type}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Orders</div>
                  <div className="font-medium">{stats.orders}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Stops</div>
                  <div className="font-medium">{stats.stops}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Pallets</div>
                  <div className="font-medium">{stats.pallets}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Weight</div>
                  <div className="font-medium">{stats.weight.toLocaleString()} lbs</div>
                </div>
              </div>
              
              {stats.type === "FTL" && (
                <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
                  ℹ FTL shipments use dedicated equipment
                </div>
              )}
              
              {stats.type === "LTL" && (
                <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                  ℹ LTL shipments share truck space with other freight
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Execution Mode</CardTitle>
              <CardDescription>How will this shipment be executed?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="execution-mode">Mode *</Label>
                <Select value={executionMode} onValueChange={setExecutionMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select execution mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset">Asset - Internal Driver</SelectItem>
                    <SelectItem value="brokered">Brokered - External Carrier</SelectItem>
                    <SelectItem value="hybrid">Hybrid - Mixed Execution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment Type *</Label>
                <Select value={equipment} onValueChange={setEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry-van">Dry Van</SelectItem>
                    <SelectItem value="refrigerated">Refrigerated</SelectItem>
                    <SelectItem value="flatbed">Flatbed</SelectItem>
                    <SelectItem value="step-deck">Step Deck</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <Label>Service Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="expedited" />
                    <Label htmlFor="expedited" className="text-sm">Expedited Service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temperature" />
                    <Label htmlFor="temperature" className="text-sm">Temperature Controlled</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hazmat" />
                    <Label htmlFor="hazmat" className="text-sm">Hazmat</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Estimation */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Estimation</CardTitle>
              <CardDescription>Preliminary cost breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Rate</span>
                <span>$2,100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fuel Surcharge</span>
                <span>$315</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accessorials</span>
                <span>$85</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total Estimated</span>
                <span>$2,500</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
