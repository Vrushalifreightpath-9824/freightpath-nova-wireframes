
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TmsLayout } from "@/components/TmsLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  X,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

// Sample data
const shipmentConfig = {
  id: "SHIP-003",
  origin: "Los Angeles, CA",
  destination: "Phoenix, AZ", 
  mode: "FTL",
  division: "West Coast",
  stops: [
    { id: "stop-1", type: "pickup", location: "Los Angeles Distribution Center", address: "1234 Industrial Blvd, LA, CA 90021" },
    { id: "stop-2", type: "delivery", location: "Phoenix Warehouse", address: "5678 Commerce Dr, Phoenix, AZ 85001" }
  ]
};

const suggestedOrders = [
  {
    id: "ORD-004",
    customer: "TechCorp Solutions",
    poNumber: "PO-2024-004",
    origin: "Los Angeles, CA 90021",
    destination: "Phoenix, AZ 85001",
    pallets: 15,
    equipment: "Dry Van",
    pickupWindow: "Jan 15, 8:00-17:00",
    compatible: true,
    division: "West Coast"
  },
  {
    id: "ORD-005", 
    customer: "Global Supply Chain",
    poNumber: "PO-2024-005",
    origin: "Los Angeles, CA 90028",
    destination: "Phoenix, AZ 85002",
    pallets: 8,
    equipment: "Dry Van",
    pickupWindow: "Jan 15, 9:00-16:00",
    compatible: true,
    division: "West Coast"
  },
  {
    id: "ORD-006",
    customer: "Manufacturing Inc",
    poNumber: "PO-2024-006", 
    origin: "San Diego, CA 92101",
    destination: "Las Vegas, NV 89101",
    pallets: 12,
    equipment: "Reefer",
    pickupWindow: "Jan 16, 10:00-15:00",
    compatible: false,
    division: "West Coast",
    incompatibleReason: "Equipment mismatch: Reefer required, Dry Van configured"
  },{
    id: "ORD-007",
    customer: "Manufacturing Inc",
    poNumber: "PO-2024-006", 
    origin: "San Diego, CA 92101",
    destination: "Las Vegas, NV 89101",
    pallets: 12,
    equipment: "Reefer",
    pickupWindow: "Jan 16, 10:00-15:00",
    compatible: false,
    division: "West Coast",
    incompatibleReason: "Equipment mismatch: Reefer required, Dry Van configured"
  },
  {
    id: "ORD-009",
    customer: "TechCorp Solutions",
    poNumber: "PO-2024-004",
    origin: "Los Angeles 2, CA 90021",
    destination: "Phoenix 2, AZ 85001",
    pallets: 15,
    equipment: "Dry Van",
    pickupWindow: "Jan 15, 8:00-17:00",
    compatible: true,
    division: "West Coast"
  }
];

export default function DragDropPlanning() {
  const navigate = useNavigate();
  const [assignedOrders, setAssignedOrders] = useState<typeof suggestedOrders>([]);
  const [availableOrders, setAvailableOrders] = useState(suggestedOrders);

  const generateStopsFromOrders = (orders: typeof suggestedOrders) => {
    const stops: {
      id: string;
      type: "pickup" | "delivery";
      location: string;
      address: string;
    }[] = [];
  
    const seen = new Set();
  
    for (const order of orders) {
      const pickupKey = `pickup-${order.origin}`;
      const deliveryKey = `delivery-${order.destination}`;
  
      if (!seen.has(pickupKey)) {
        seen.add(pickupKey);
        stops.push({
          id: `pickup-${order.id}`,
          type: "pickup",
          location: `${order.origin.split(",")[0]} Pickup`,
          address: order.origin
        });
      }
  
      if (!seen.has(deliveryKey)) {
        seen.add(deliveryKey);
        stops.push({
          id: `delivery-${order.id}`,
          type: "delivery",
          location: `${order.destination.split(",")[0]} Delivery`,
          address: order.destination
        });
      }
    }
  
    return stops;
  };

  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

     // Reorder stops
  if (
    source.droppableId === "configured-stops" &&
    destination.droppableId === "configured-stops"
  ) {
    const updatedStops = Array.from(configuredStops);
    const [moved] = updatedStops.splice(source.index, 1);
    updatedStops.splice(destination.index, 0, moved);
    setConfiguredStops(updatedStops);
    return;
  }
    // Find the dragged order
    const draggedOrder = availableOrders.find(order => order.id === draggableId);
    if (!draggedOrder) return;

    // Check compatibility
    if (!draggedOrder.compatible) {
      toast.error(`Cannot assign order: ${draggedOrder.incompatibleReason}`);
      return;
    }

    if (destination.droppableId === "assigned-orders" && source.droppableId === "available-orders") {
      // Move from available to assigned
      setAvailableOrders(prev => prev.filter(order => order.id !== draggableId));
      setAssignedOrders(prev => [...prev, draggedOrder]);
      toast.success(`Order ${draggableId} successfully added to Shipment ${shipmentConfig.id}`);
    }
  };

  const removeOrder = (orderId: string) => {
    const orderToRemove = assignedOrders.find(order => order.id === orderId);
    if (orderToRemove) {
      setAssignedOrders(prev => prev.filter(order => order.id !== orderId));
      setAvailableOrders(prev => [...prev, orderToRemove]);
      toast.success(`Order ${orderId} removed from shipment`);
    }
  };

  const clearAll = () => {
    setAvailableOrders(prev => [...prev, ...assignedOrders]);
    setAssignedOrders([]);
    toast.success("All orders cleared from shipment");
  };

  const saveConfiguration = () => {
    if (assignedOrders.length === 0) {
      toast.error("Please assign at least one order before saving");
      return;
    }
    toast.success(`Shipment configuration saved with ${assignedOrders.length} order(s)`);
    // Handle save logic here
  };
  const [configuredStops, setConfiguredStops] = useState(() => generateStopsFromOrders(assignedOrders));
  useEffect(() => {
    setConfiguredStops(generateStopsFromOrders(assignedOrders));
  }, [assignedOrders]);
  
  
  return (
    <TmsLayout 
      title="Drag & Drop Planning"
      breadcrumbs={[
        { label: "Shipments", href: "/shipments" },
        { label: "Planning", href: "/shipments/planning" },
        { label: "Drag & Drop" }
      ]}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6 space-y-6 h-screen flex flex-col overflow-hidden">
          {/* Header Controls */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/shipments/planning")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Standard Planning
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearAll}>
                Clear All
              </Button>
              <Button onClick={saveConfiguration}>
                Save Configuration
              </Button>
            </div>
          </div>

          {/* Top Section - Shipment Configuration */}
          <Card className="flex-shrink-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h- w-5" />
                Shipment Configuration - {shipmentConfig.id}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {shipmentConfig.origin} → {shipmentConfig.destination}
                </span>
                <Badge variant="outline">{shipmentConfig.mode}</Badge>
                <Badge variant="secondary">{shipmentConfig.division}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Configured Stops */}
                <div>
                  <h4 className="font-medium mb-3">Configured Stops</h4>
                  {/* <div className="space-y-2">
                  {configuredStops.map((stop, index) => (
                      <div key={stop.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={stop.type === 'pickup' ? 'default' : 'secondary'}>
                              {stop.type}
                            </Badge>
                            <span className="font-medium text-sm">{stop.location}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{stop.address}</div>
                        </div>
                      </div>
                    ))}
                  </div> */}
                  <Droppable droppableId="configured-stops">
  {(provided) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className="space-y-2"
    >
      {configuredStops.map((stop, index) => (
        <Draggable key={stop.id} draggableId={stop.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                snapshot.isDragging ? 'bg-primary/5' : ''
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={stop.type === 'pickup' ? 'default' : 'secondary'}>
                    {stop.type}
                  </Badge>
                  <span className="font-medium text-sm">{stop.location}</span>
                </div>
                <div className="text-xs text-muted-foreground">{stop.address}</div>
              </div>
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>
  )}
</Droppable>

                </div>

                {/* Assigned Orders Drop Zone */}
                <div>
                  <h4 className="font-medium mb-3">Assigned Orders</h4>
                  <Droppable droppableId="assigned-orders">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                          snapshot.isDraggingOver 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted-foreground/25'
                        }`}
                      >
                        {assignedOrders.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Drag orders from below to add to this shipment</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {assignedOrders.map((order, index) => (
                              <div key={order.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{order.id}</span>
                                    <Badge variant="outline" className="text-xs">{order.poNumber}</Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {order.customer} • {order.pallets} pallets • {order.equipment}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {order.origin} → {order.destination}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeOrder(order.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Section - Available Orders */}
          <Card className="flex-1 overflow-hidden flex flex-col">

            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Suggested Orders
                <Badge variant="secondary">{availableOrders.length} available</Badge>
              </CardTitle>
            </CardHeader>
            {/* <CardContent className="h-full overflow-hidden">
              <Droppable droppableId="available-orders">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="h-full overflow-auto space-y-3"
                  >
                    {availableOrders.map((order, index) => (
                      <Draggable 
                        key={order.id} 
                        draggableId={order.id} 
                        index={index}
                        isDragDisabled={!order.compatible}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 border rounded-lg transition-all ${
                              snapshot.isDragging 
                                ? 'shadow-lg rotate-2' 
                                : 'hover:shadow-md'
                            } ${
                              order.compatible 
                                ? 'cursor-grab active:cursor-grabbing' 
                                : 'opacity-50 cursor-not-allowed'
                            }`}
                            title={!order.compatible ? order.incompatibleReason : ''}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{order.id}</span>
                                  <Badge variant="outline">{order.poNumber}</Badge>
                                  {order.compatible ? (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Compatible
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Needs Validation
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  <strong>{order.customer}</strong>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      Route
                                    </div>
                                    <div className="text-xs">{order.origin} → {order.destination}</div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      Pickup Window
                                    </div>
                                    <div className="text-xs">{order.pickupWindow}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>{order.pallets} pallets</span>
                                  <span>{order.equipment}</span>
                                  <span>{order.division}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent> */}
{/* <CardContent className="overflow-x-auto max-h-[400px] overflow-y-auto p-0"> */}
<CardContent className="flex-1 overflow-x-auto overflow-y-auto p-0">

  <Droppable droppableId="available-orders">
    {(provided) => (
      <table
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="min-w-full text-sm border-collapse"
      >
        <thead className="bg-muted sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">PO Number</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Route</th>
            <th className="p-3 text-left">Pickup Window</th>
            <th className="p-3 text-left">Pallets</th>
            <th className="p-3 text-left">Equipment</th>
            <th className="p-3 text-left">Division</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {availableOrders.map((order, index) => (
            <Draggable
              key={order.id}
              draggableId={order.id}
              index={index}
              isDragDisabled={!order.compatible}
            >
              {(provided, snapshot) => (
                <tr
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`transition-all ${
                    order.compatible
                      ? 'hover:bg-muted cursor-grab active:cursor-grabbing'
                      : 'opacity-50 cursor-not-allowed'
                  } ${snapshot.isDragging ? 'bg-primary/5 ring-2 ring-primary/50' : ''}`}
                  title={!order.compatible ? order.incompatibleReason : ''}
                >
                  <td className="p-3 font-medium">{order.id}</td>
                  <td className="p-3">{order.poNumber}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">{order.origin} → {order.destination}</td>
                  <td className="p-3">{order.pickupWindow}</td>
                  <td className="p-3">{order.pallets}</td>
                  <td className="p-3">{order.equipment}</td>
                  <td className="p-3">{order.division}</td>
                  <td className="p-3">
                    {order.compatible ? (
                      <Badge variant="secondary" className="text-green-700 bg-green-100">
                        Compatible
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-red-700 bg-red-100">
                        Needs Validation
                      </Badge>
                    )}
                  </td>
                </tr>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </tbody>
      </table>
    )}
  </Droppable>
</CardContent>


          </Card>
        </div>
      </DragDropContext>
    </TmsLayout>
  );
}
