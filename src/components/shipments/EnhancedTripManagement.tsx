
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Truck, User, Plus, Map, Clock, Package, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/use-toast";

interface Stop {
  id: string;
  type: "pickup" | "delivery" | "terminal" | "customs";
  location: string;
  address: string;
  orderIds: string[];
  timeWindow: string;
}

interface Trip {
  id: string;
  driverId?: string;
  driverName?: string;
  driverPhoto?: string;
  truckId?: string;
  trailerId?: string;
  carrierId?: string;      
  carrierName?: string;    
  stopCount: number;
  eta: string;
  status: "planned" | "dispatched" | "in-progress" | "completed";
  executionMode: "asset" | "brokered";
  notes?: string;
  assignedStops: Stop[];
}

interface EnhancedTripManagementProps {
  trips: Trip[];
  unassignedStops: Stop[];
  onTripsUpdate: (trips: Trip[]) => void;
  onUnassignedStopsUpdate: (stops: Stop[]) => void;
  executionMode: "asset" | "brokered" | "hybrid";
}

const mockDrivers = [
  { id: "D001", name: "John Doe", photo: "/api/placeholder/32/32" },
  { id: "D002", name: "Sarah Smith", photo: "/api/placeholder/32/32" },
  { id: "D003", name: "Mike Johnson", photo: "/api/placeholder/32/32" }
];

const mockEquipment = [
  { id: "T101", type: "truck", number: "T-4567", capacity: "80,000 lbs" },
  { id: "T102", type: "truck", number: "T-4568", capacity: "80,000 lbs" },
  { id: "TR201", type: "trailer", number: "TR-8901", type_detail: "Dry Van 53'" },
  { id: "TR202", type: "trailer", number: "TR-8902", type_detail: "Reefer 53'" }
];

const getTripStatusBadge = (status: string) => {
  const statusMap: Record<string, any> = {
    planned: "planned",
    dispatched: "tendered", 
    "in-progress": "in-transit",
    completed: "delivered"
  };
  return <StatusBadge status={statusMap[status] || "planned"} />;
};

const getStopTypeIcon = (type: string) => {
  switch (type) {
    case "pickup": return <Package className="h-3 w-3 text-green-600" />;
    case "delivery": return <MapPin className="h-3 w-3 text-blue-600" />;
    case "terminal": return <MapPin className="h-3 w-3 text-orange-600" />;
    case "customs": return <MapPin className="h-3 w-3 text-purple-600" />;
    default: return <MapPin className="h-3 w-3" />;
  }
};

export function EnhancedTripManagement({ 
  trips: initialTrips, 
  unassignedStops: initialUnassignedStops, 
  onTripsUpdate, 
  onUnassignedStopsUpdate,
  executionMode 
}: EnhancedTripManagementProps) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [unassignedStops, setUnassignedStops] = useState<Stop[]>(initialUnassignedStops);
  const [showMap, setShowMap] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();
  
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    // Handle drag from unassigned stops to trip
    if (source.droppableId === "unassigned" && destination.droppableId.startsWith("trip-")) {
      const tripId = destination.droppableId.replace("trip-", "");
      const draggedStop = unassignedStops[source.index];
      
      const newUnassignedStops = [...unassignedStops];
      newUnassignedStops.splice(source.index, 1);
      
      const newTrips = trips.map(trip => {
        if (trip.id === tripId) {
          const newAssignedStops = [...trip.assignedStops];
          newAssignedStops.splice(destination.index, 0, draggedStop);
          return {
            ...trip,
            assignedStops: newAssignedStops,
            stopCount: newAssignedStops.length
          };
        }
        return trip;
      });

      setUnassignedStops(newUnassignedStops);
      setTrips(newTrips);
      onTripsUpdate(newTrips);
      onUnassignedStopsUpdate(newUnassignedStops);
    }

    // Handle drag between trips
    if (source.droppableId.startsWith("trip-") && destination.droppableId.startsWith("trip-")) {
      const sourceTrip = source.droppableId.replace("trip-", "");
      const destTrip = destination.droppableId.replace("trip-", "");
      
      if (sourceTrip === destTrip) {
        // Reorder within same trip
        const trip = trips.find(t => t.id === sourceTrip);
        if (!trip) return;
        
        const reorderedStops = [...trip.assignedStops];
        const [movedStop] = reorderedStops.splice(source.index, 1);
        reorderedStops.splice(destination.index, 0, movedStop);
        
        const newTrips = trips.map(t => 
          t.id === sourceTrip ? { ...t, assignedStops: reorderedStops } : t
        );
        
        setTrips(newTrips);
        onTripsUpdate(newTrips);
      } else {
        // Move between trips
        const sourceTrip_ = trips.find(t => t.id === sourceTrip);
        const destTrip_ = trips.find(t => t.id === destTrip);
        if (!sourceTrip_ || !destTrip_) return;
        
        const movedStop = sourceTrip_.assignedStops[source.index];
        const newSourceStops = [...sourceTrip_.assignedStops];
        newSourceStops.splice(source.index, 1);
        
        const newDestStops = [...destTrip_.assignedStops];
        newDestStops.splice(destination.index, 0, movedStop);
        
        const newTrips = trips.map(trip => {
          if (trip.id === sourceTrip) {
            return { ...trip, assignedStops: newSourceStops, stopCount: newSourceStops.length };
          }
          if (trip.id === destTrip) {
            return { ...trip, assignedStops: newDestStops, stopCount: newDestStops.length };
          }
          return trip;
        });
        
        setTrips(newTrips);
        onTripsUpdate(newTrips);
      }
    }

    // Handle drag from trip back to unassigned
    if (source.droppableId.startsWith("trip-") && destination.droppableId === "unassigned") {
      const tripId = source.droppableId.replace("trip-", "");
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return;
      
      const movedStop = trip.assignedStops[source.index];
      const newTripStops = [...trip.assignedStops];
      newTripStops.splice(source.index, 1);
      
      const newUnassignedStops = [...unassignedStops];
      newUnassignedStops.splice(destination.index, 0, movedStop);
      
      const newTrips = trips.map(t => 
        t.id === tripId ? { ...t, assignedStops: newTripStops, stopCount: newTripStops.length } : t
      );
      
      setTrips(newTrips);
      setUnassignedStops(newUnassignedStops);
      onTripsUpdate(newTrips);
      onUnassignedStopsUpdate(newUnassignedStops);
    }
  };

  const handleCreateTrip = (tripData: Omit<Trip, 'id' | 'assignedStops'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      assignedStops: []
    };
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    onTripsUpdate(updatedTrips);
  };

  const handleDeleteTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    // Move all assigned stops back to unassigned
    const newUnassignedStops = [...unassignedStops, ...trip.assignedStops];
    const newTrips = trips.filter(t => t.id !== tripId);
    
    setTrips(newTrips);
    setUnassignedStops(newUnassignedStops);
    onTripsUpdate(newTrips);
    onUnassignedStopsUpdate(newUnassignedStops);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Enhanced Trip Management</h3>
          <p className="text-sm text-muted-foreground">
            Execution Mode: <Badge variant="outline" className={`ml-1 ${
              executionMode === 'asset' ? 'bg-blue-100 text-blue-800' :
              executionMode === 'brokered' ? 'bg-orange-100 text-orange-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {executionMode.charAt(0).toUpperCase() + executionMode.slice(1)}
            </Badge>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={showMap ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMap(!showMap)}
          >
            <Map className="h-4 w-4 mr-2" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
          
          {(executionMode === 'asset' || executionMode === 'hybrid') && (
            <Drawer>
              <DrawerTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Trip
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Create New Trip</DrawerTitle>
                </DrawerHeader>
                <div className="p-6">
                  <CreateTripForm onSubmit={handleCreateTrip} />
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>

      {/* Map Placeholder */}
      {showMap && (
        <Card className="h-64 bg-gray-50 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Map className="h-12 w-12 mx-auto mb-2" />
            <p>Trip route visualization with color-coded paths would appear here</p>
          </div>
        </Card>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Unassigned Stops */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Unassigned Stops</span>
                  <Badge variant="outline">{unassignedStops.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="unassigned">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-2 min-h-24 p-2 rounded ${
                        snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : ''
                      }`}
                    >
                      {unassignedStops.map((stop, index) => (
                        <Draggable key={stop.id} draggableId={stop.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 border rounded cursor-grab active:cursor-grabbing ${
                                snapshot.isDragging ? 'shadow-lg bg-white' : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {getStopTypeIcon(stop.type)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{stop.location}</p>
                                  <p className="text-xs text-muted-foreground truncate">{stop.address}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {stop.orderIds.map(orderId => (
                                      <Badge key={orderId} variant="outline" className="text-xs">
                                        {orderId}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {unassignedStops.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-4">
                          All stops have been assigned to trips
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Trips */}
          <div className="lg:col-span-2 space-y-4">
            {trips.map((trip) => (
              <Card key={trip.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={trip.driverPhoto} />
                        <AvatarFallback>
                          {trip.driverName ? trip.driverName.split(' ').map(n => n[0]).join('') : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{trip.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {trip.driverName || "Unassigned"} • {trip.truckId} / {trip.trailerId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={
                        trip.executionMode === 'asset' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }>
                        {trip.executionMode}
                      </Badge>
                      {getTripStatusBadge(trip.status)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteTrip(trip.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>ETA: {trip.eta}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{trip.assignedStops.length} stops</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="h-3 w-3 text-muted-foreground" />
                      <span>{trip.truckId || "No truck"}</span>
                    </div>
                  </div>

                  <Droppable droppableId={`trip-${trip.id}`}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-1 min-h-16 p-2 rounded border-2 border-dashed ${
                          snapshot.isDraggingOver 
                            ? 'bg-green-50 border-green-200' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        {trip.assignedStops.map((stop, index) => (
                          <Draggable key={`${trip.id}-${stop.id}`} draggableId={`${trip.id}-${stop.id}`} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-2 border rounded text-sm cursor-grab active:cursor-grabbing flex items-center space-x-2 ${
                                  snapshot.isDragging ? 'shadow-lg bg-white' : 'bg-white hover:bg-gray-50'
                                }`}
                              >
                                <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                                  {index + 1}
                                </span>
                                {getStopTypeIcon(stop.type)}
                                <div className="flex-1 min-w-0">
                                  <span className="font-medium truncate block">{stop.location}</span>
                                  <span className="text-xs text-muted-foreground">{stop.timeWindow}</span>
                                </div>
                                <div className="flex gap-1">
                                  {stop.orderIds.slice(0, 2).map(orderId => (
                                    <Badge key={orderId} variant="outline" className="text-xs">
                                      {orderId}
                                    </Badge>
                                  ))}
                                  {stop.orderIds.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{stop.orderIds.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {trip.assignedStops.length === 0 && (
                          <div className="text-center text-sm text-muted-foreground py-3">
                            Drag stops here to assign to this trip
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            ))}

            {trips.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No trips created yet. Create a trip to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

interface CreateTripFormProps {
  onSubmit: (trip: Omit<Trip, 'id' | 'assignedStops'>) => void;
}

function CreateTripForm({ onSubmit }: CreateTripFormProps) {
  const [formData, setFormData] = useState<{
    driverId: string;
    driverName: string;
    truckId: string;
    trailerId: string;
    carrierId: string;
    carrierName: string;
    stopCount: number;
    eta: string;
    status: "planned" | "dispatched" | "in-progress" | "completed";
    executionMode: "asset" | "brokered";
    notes: string;
  }>({
    driverId: "",
    driverName: "",
    truckId: "",
    trailerId: "",
    carrierId: "",
    carrierName: "",
    stopCount: 0,
    eta: "",
    status: "planned",
    executionMode: "asset",
    notes: ""
  });
  

  const handleDriverChange = (driverId: string) => {
    const driver = mockDrivers.find(d => d.id === driverId);
    setFormData({
      ...formData,
      driverId,
      driverName: driver?.name || ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const mockCarriers = [
    { id: "C001", name: "XYZ Logistics" },
    { id: "C002", name: "BlueSky Freight" },
    { id: "C003", name: "FastHaul Express" }
  ];
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
  {/* Execution Mode (First) */}
  <div>
    <Label>Execution Mode</Label>
    <Select
      value={formData.executionMode}
      onValueChange={(value: "asset" | "brokered") =>
        setFormData({ ...formData, executionMode: value })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select execution mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asset">Asset</SelectItem>
        <SelectItem value="brokered">Brokered</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Carrier Selection (only for brokered) */}
  {formData.executionMode === "brokered" && (
    <div>
      <Label>Carrier</Label>
      <Select
        value={formData.carrierId}
        onValueChange={(value) => {
          const selectedCarrier = mockCarriers.find((c) => c.id === value);
          setFormData({
            ...formData,
            carrierId: value,
            carrierName: selectedCarrier?.name || "",
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select carrier" />
        </SelectTrigger>
        <SelectContent>
          {mockCarriers.map((carrier) => (
            <SelectItem key={carrier.id} value={carrier.id}>
              {carrier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )}

  {/* Driver/Truck Selection (only for asset) */}
  {formData.executionMode === "asset" && (
    <>
      <div>
        <Label>Assign Driver</Label>
        <Select
          value={formData.driverId}
          onValueChange={(driverId) => {
            const driver = mockDrivers.find((d) => d.id === driverId);
            setFormData({
              ...formData,
              driverId,
              driverName: driver?.name || "",
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select driver" />
          </SelectTrigger>
          <SelectContent>
            {mockDrivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Truck</Label>
          <Select
            value={formData.truckId}
            onValueChange={(value) =>
              setFormData({ ...formData, truckId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select truck" />
            </SelectTrigger>
            <SelectContent>
              {mockEquipment
                .filter((e) => e.type === "truck")
                .map((truck) => (
                  <SelectItem key={truck.id} value={truck.number}>
                    {truck.number} ({truck.capacity})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Trailer</Label>
          <Select
            value={formData.trailerId}
            onValueChange={(value) =>
              setFormData({ ...formData, trailerId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trailer" />
            </SelectTrigger>
            <SelectContent>
              {mockEquipment
                .filter((e) => e.type === "trailer")
                .map((trailer) => (
                  <SelectItem key={trailer.id} value={trailer.number}>
                    {trailer.number} ({trailer.type_detail})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )}

  {/* Common fields */}
  <div>
    <Label>ETA</Label>
    <Input
      value={formData.eta}
      onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
      placeholder="2024-01-16 14:30"
    />
  </div>

  <div>
    <Label>Notes</Label>
    <Textarea
      value={formData.notes}
      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      placeholder="Trip notes..."
    />
  </div>

  <div className="flex justify-end space-x-2">
    <Button type="submit">Create Trip</Button>
  </div>
</form>

  );
}
