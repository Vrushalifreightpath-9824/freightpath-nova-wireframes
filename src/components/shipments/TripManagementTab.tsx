
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Truck, User, MapPin, Edit, Plus, Copy, Trash2, Clock, Route } from "lucide-react";
import { StatusBadge } from "@/pages/shipments/StatusBadge";

interface Trip {
  id: string;
  driverId?: string;
  driverName?: string;
  driverPhoto?: string;
  truckId?: string;
  trailerId?: string;
  stopCount: number;
  eta: string;
  status: "planned" | "dispatched" | "in-progress" | "completed";
  executionMode: "asset" | "brokered";
  notes?: string;
  assignedStops: string[];
}

interface TripManagementTabProps {
  trips: Trip[];
  onTripsUpdate: (trips: Trip[]) => void;
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

export function TripManagementTab({ trips: initialTrips, onTripsUpdate }: TripManagementTabProps) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);

  const handleAddTrip = (newTrip: Omit<Trip, 'id'>) => {
    const trip: Trip = {
      ...newTrip,
      id: `trip-${Date.now()}`
    };
    const updatedTrips = [...trips, trip];
    setTrips(updatedTrips);
    onTripsUpdate(updatedTrips);
    setIsAddingTrip(false);
  };

  const handleEditTrip = (updatedTrip: Trip) => {
    const updatedTrips = trips.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
    );
    setTrips(updatedTrips);
    onTripsUpdate(updatedTrips);
    setEditingTrip(null);
  };

  const handleDeleteTrip = (tripId: string) => {
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    setTrips(updatedTrips);
    onTripsUpdate(updatedTrips);
    setDeleteConfirm(null);
  };

  const handleSplitTrip = (trip: Trip) => {
    const splitTrip: Trip = {
      ...trip,
      id: `trip-${Date.now()}`,
      stopCount: Math.ceil(trip.stopCount / 2),
      notes: `Split from ${trip.id}`
    };
    
    const updatedOriginal = {
      ...trip,
      stopCount: Math.floor(trip.stopCount / 2)
    };

    const updatedTrips = trips.map(t => t.id === trip.id ? updatedOriginal : t);
    updatedTrips.push(splitTrip);
    
    setTrips(updatedTrips);
    onTripsUpdate(updatedTrips);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trip Management</h3>
        <Dialog open={isAddingTrip} onOpenChange={setIsAddingTrip}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Trip</DialogTitle>
            </DialogHeader>
            <TripForm onSubmit={handleAddTrip} onCancel={() => setIsAddingTrip(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {trips.map((trip) => (
          <Card key={trip.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={trip.driverPhoto} />
                    <AvatarFallback>
                      {trip.driverName ? trip.driverName.split(' ').map(n => n[0]).join('') : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{trip.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {trip.driverName || "Unassigned"} • {trip.stopCount} stops
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
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>{trip.truckId || "Not assigned"} / {trip.trailerId || "Not assigned"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>ETA: {trip.eta}</span>
                </div>
              </div>

              {trip.notes && (
                <div className="text-xs text-muted-foreground mb-3">
                  <strong>Notes:</strong> {trip.notes}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedTrip(expandedTrip === trip.id ? null : trip.id)}
                >
                  <Route className="h-4 w-4 mr-2" />
                  {expandedTrip === trip.id ? 'Hide Details' : 'View Details'}
                </Button>
                
                <div className="flex space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setEditingTrip(trip)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Edit Trip</DialogTitle>
                      </DialogHeader>
                      {editingTrip && (
                        <TripForm 
                          initialTrip={editingTrip}
                          onSubmit={handleEditTrip}
                          onCancel={() => setEditingTrip(null)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleSplitTrip(trip)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Dialog open={deleteConfirm === trip.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setDeleteConfirm(trip.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Trip</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-muted-foreground mb-4">
                        Are you sure you want to delete this trip? This will unassign all stops.
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => handleDeleteTrip(trip.id)}>
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {expandedTrip === trip.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Trip Details</h4>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-muted-foreground">Assigned Stops: </span>
                      <span>{trip.assignedStops?.join(', ') || 'None assigned'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Equipment Details: </span>
                      <span>Truck {trip.truckId}, Trailer {trip.trailerId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Execution Mode: </span>
                      <span className="capitalize">{trip.executionMode}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {trips.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground">No trips created yet. Add a trip to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface TripFormProps {
  initialTrip?: Trip;
  onSubmit: (trip: any) => void;
  onCancel: () => void;
}

function TripForm({ initialTrip, onSubmit, onCancel }: TripFormProps) {
  const [formData, setFormData] = useState({
    driverId: initialTrip?.driverId || "",
    driverName: initialTrip?.driverName || "",
    truckId: initialTrip?.truckId || "",
    trailerId: initialTrip?.trailerId || "",
    stopCount: initialTrip?.stopCount || 2,
    eta: initialTrip?.eta || "",
    status: initialTrip?.status || "planned" as const,
    executionMode: initialTrip?.executionMode || "asset" as const,
    notes: initialTrip?.notes || "",
    assignedStops: initialTrip?.assignedStops || []
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
    if (initialTrip) {
      onSubmit({ ...initialTrip, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Assign Driver</Label>
        <Select value={formData.driverId} onValueChange={handleDriverChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select driver" />
          </SelectTrigger>
          <SelectContent>
            {mockDrivers.map(driver => (
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
          <Select value={formData.truckId} onValueChange={(value) => setFormData({...formData, truckId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select truck" />
            </SelectTrigger>
            <SelectContent>
              {mockEquipment.filter(e => e.type === 'truck').map(truck => (
                <SelectItem key={truck.id} value={truck.number}>
                  {truck.number} ({truck.capacity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Trailer</Label>
          <Select value={formData.trailerId} onValueChange={(value) => setFormData({...formData, trailerId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select trailer" />
            </SelectTrigger>
            <SelectContent>
              {mockEquipment.filter(e => e.type === 'trailer').map(trailer => (
                <SelectItem key={trailer.id} value={trailer.number}>
                  {trailer.number} ({trailer.type_detail})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Stop Count</Label>
          <Input
            type="number"
            min="1"
            value={formData.stopCount}
            onChange={(e) => setFormData({...formData, stopCount: parseInt(e.target.value)})}
          />
        </div>

        <div>
          <Label>ETA</Label>
          <Input
            value={formData.eta}
            onChange={(e) => setFormData({...formData, eta: e.target.value})}
            placeholder="e.g., 2024-01-16 14:30"
          />
        </div>
      </div>

      <div>
        <Label>Execution Mode</Label>
        <Select value={formData.executionMode} onValueChange={(value: "asset" | "brokered") => setFormData({...formData, executionMode: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asset">Asset</SelectItem>
            <SelectItem value="brokered">Brokered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Notes (Optional)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Trip instructions or notes"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialTrip ? 'Update Trip' : 'Create Trip'}
        </Button>
      </div>
    </form>
  );
}
