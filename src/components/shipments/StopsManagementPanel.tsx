
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Edit, Trash2, Plus, Copy, Clock, Package } from "lucide-react";
import { StatusBadge } from "@/pages/shipments/StatusBadge";

interface Stop {
  id: string;
  type: "pickup" | "delivery" | "terminal" | "customs";
  sequence: number;
  location: string;
  address: string;
  timeWindow: string;
  actualTime?: string | null;
  status: "scheduled" | "completed" | "skipped";
  orderId: string;
  contact: string;
  phone: string;
  notes?: string;
}

interface StopsManagementPanelProps {
  stops: Stop[];
  onStopsUpdate: (stops: Stop[]) => void;
}

const getStopTypeIcon = (type: string) => {
  switch (type) {
    case "pickup": return <Package className="h-4 w-4 text-green-600" />;
    case "delivery": return <MapPin className="h-4 w-4 text-blue-600" />;
    case "terminal": return <MapPin className="h-4 w-4 text-orange-600" />;
    case "customs": return <MapPin className="h-4 w-4 text-purple-600" />;
    default: return <MapPin className="h-4 w-4" />;
  }
};

const getStopStatusBadge = (status: string) => {
  const statusMap: Record<string, any> = {
    completed: "delivered",
    scheduled: "planned",
    skipped: "cancelled"
  };
  return <StatusBadge status={statusMap[status] || "planned"} />;
};

export function StopsManagementPanel({ stops: initialStops, onStopsUpdate }: StopsManagementPanelProps) {
  const [stops, setStops] = useState<Stop[]>(initialStops);
  const [editingStop, setEditingStop] = useState<Stop | null>(null);
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(stops);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedStops = items.map((item, index) => ({
      ...item,
      sequence: index + 1
    }));

    setStops(updatedStops);
    onStopsUpdate(updatedStops);
  };

  const handleDeleteStop = (stopId: string) => {
    if (stops.length <= 2) {
      alert("Cannot delete stop. Minimum 2 stops required.");
      return;
    }
    
    const updatedStops = stops.filter(stop => stop.id !== stopId);
    setStops(updatedStops);
    onStopsUpdate(updatedStops);
    setDeleteConfirm(null);
  };

  const handleAddStop = (newStop: Omit<Stop, 'id' | 'sequence'>) => {
    const stop: Stop = {
      ...newStop,
      id: `stop-${Date.now()}`,
      sequence: stops.length + 1
    };
    const updatedStops = [...stops, stop];
    setStops(updatedStops);
    onStopsUpdate(updatedStops);
    setIsAddingStop(false);
  };

  const handleEditStop = (updatedStop: Stop) => {
    const updatedStops = stops.map(stop => 
      stop.id === updatedStop.id ? updatedStop : stop
    );
    setStops(updatedStops);
    onStopsUpdate(updatedStops);
    setEditingStop(null);
  };

  const handleSplitStop = (stop: Stop) => {
    const splitStop: Stop = {
      ...stop,
      id: `stop-${Date.now()}`,
      sequence: stop.sequence + 0.5,
      location: `${stop.location} (Split)`,
      notes: `Split from ${stop.location}`
    };
    
    const updatedStops = [...stops, splitStop]
      .sort((a, b) => a.sequence - b.sequence)
      .map((s, index) => ({ ...s, sequence: index + 1 }));
    
    setStops(updatedStops);
    onStopsUpdate(updatedStops);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Stop Management</h3>
        <Dialog open={isAddingStop} onOpenChange={setIsAddingStop}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Stop</DialogTitle>
            </DialogHeader>
            <StopForm onSubmit={handleAddStop} onCancel={() => setIsAddingStop(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="stops">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {stops.map((stop, index) => (
                <Draggable key={stop.id} draggableId={stop.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? 'shadow-lg' : ''} transition-shadow`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                              {stop.sequence}
                            </div>
                            {getStopTypeIcon(stop.type)}
                            <div>
                              <CardTitle className="text-base">{stop.location}</CardTitle>
                              <Badge variant="outline" className="capitalize mt-1">
                                {stop.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStopStatusBadge(stop.status)}
                            <div className="flex space-x-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingStop(stop)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Edit Stop</DialogTitle>
                                  </DialogHeader>
                                  {editingStop && (
                                    <StopForm 
                                      initialStop={editingStop}
                                      onSubmit={handleEditStop}
                                      onCancel={() => setEditingStop(null)}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleSplitStop(stop)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              
                              <Dialog open={deleteConfirm === stop.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setDeleteConfirm(stop.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Stop</DialogTitle>
                                  </DialogHeader>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    Are you sure you want to delete this stop? This action cannot be undone.
                                  </p>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                      Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDeleteStop(stop.id)}>
                                      Delete
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{stop.address}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Window: {stop.timeWindow}</span>
                            {stop.actualTime && <span>• Actual: {stop.actualTime}</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground">Contact: </span>
                              <span>{stop.contact}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Phone: </span>
                              <span>{stop.phone}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Order: </span>
                              <span>{stop.orderId}</span>
                            </div>
                          </div>
                          {stop.notes && (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Notes: </span>
                              <span>{stop.notes}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

interface StopFormProps {
  initialStop?: Stop;
  onSubmit: (stop: any) => void;
  onCancel: () => void;
}

function StopForm({ initialStop, onSubmit, onCancel }: StopFormProps) {
  const [formData, setFormData] = useState({
    type: initialStop?.type || "pickup" as const,
    location: initialStop?.location || "",
    address: initialStop?.address || "",
    timeWindow: initialStop?.timeWindow || "",
    status: initialStop?.status || "scheduled" as const,
    orderId: initialStop?.orderId || "",
    contact: initialStop?.contact || "",
    phone: initialStop?.phone || "",
    notes: initialStop?.notes || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialStop) {
      onSubmit({ ...initialStop, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Stop Type</Label>
        <Select value={formData.type} onValueChange={(value: "pickup" | "delivery" | "terminal" | "customs") => setFormData({...formData, type: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pickup">Pickup</SelectItem>
            <SelectItem value="delivery">Delivery</SelectItem>
            <SelectItem value="terminal">Terminal</SelectItem>
            <SelectItem value="customs">Customs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Location Name</Label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="e.g., ACME Warehouse"
          required
        />
      </div>

      <div>
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="Full address"
          required
        />
      </div>

      <div>
        <Label>Time Window</Label>
        <Input
          value={formData.timeWindow}
          onChange={(e) => setFormData({...formData, timeWindow: e.target.value})}
          placeholder="e.g., 08:00 - 12:00"
          required
        />
      </div>

      <div>
        <Label>Contact Person</Label>
        <Input
          value={formData.contact}
          onChange={(e) => setFormData({...formData, contact: e.target.value})}
          placeholder="Contact name"
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="Contact phone"
        />
      </div>

      <div>
        <Label>Order ID</Label>
        <Input
          value={formData.orderId}
          onChange={(e) => setFormData({...formData, orderId: e.target.value})}
          placeholder="Associated order"
        />
      </div>

      <div>
        <Label>Notes (Optional)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Additional instructions"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialStop ? 'Update Stop' : 'Add Stop'}
        </Button>
      </div>
    </form>
  );
}
