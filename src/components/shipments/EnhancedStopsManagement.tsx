
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { MapPin, Edit, Trash2, Plus, Scissors, Package, Clock, User, Phone, ChevronDown, ChevronUp, Map } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface Stop {
  id: string;
  type: "pickup" | "delivery" | "terminal" | "customs";
  sequence: number;
  location: string;
  address: string;
  timeWindow: string;
  actualTime?: string | null;
  status: "scheduled" | "completed" | "skipped";
  orderIds: string[];
  contact: string;
  phone: string;
  notes?: string;
  expanded?: boolean;
}

interface EnhancedStopsManagementProps {
  stops: Stop[];
  onStopsUpdate: (stops: Stop[]) => void;
  executionMode: "asset" | "brokered" | "hybrid";
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

export function EnhancedStopsManagement({ stops: initialStops, onStopsUpdate, executionMode }: EnhancedStopsManagementProps) {
  const [stops, setStops] = useState<Stop[]>(initialStops.map(stop => ({ ...stop, expanded: false })));
  const [editingStop, setEditingStop] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

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

  const handleInlineEdit = (stopId: string, field: string, value: string) => {
    const updatedStops = stops.map(stop => 
      stop.id === stopId ? { ...stop, [field]: value } : stop
    );
    setStops(updatedStops);
    onStopsUpdate(updatedStops);
  };

  const handleToggleExpanded = (stopId: string) => {
    setStops(prev => prev.map(stop => 
      stop.id === stopId ? { ...stop, expanded: !stop.expanded } : stop
    ));
  };

  const handleSplitStop = (stop: Stop) => {
    const splitStop: Stop = {
      ...stop,
      id: `stop-${Date.now()}`,
      sequence: stop.sequence + 0.5,
      location: `${stop.location} (Split)`,
      notes: `Split from ${stop.location}`,
      expanded: false
    };
    
    const updatedStops = [...stops, splitStop]
      .sort((a, b) => a.sequence - b.sequence)
      .map((s, index) => ({ ...s, sequence: index + 1 }));
    
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
  };

  const groupedStops = stops.reduce((acc, stop) => {
    if (!acc[stop.type]) acc[stop.type] = [];
    acc[stop.type].push(stop);
    return acc;
  }, {} as Record<string, Stop[]>);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Enhanced Stops Management</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={showMap ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMap(!showMap)}
          >
            <Map className="h-4 w-4 mr-2" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
          
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50">
                <Plus className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Add New Stop</DrawerTitle>
              </DrawerHeader>
              <div className="p-6">
                <AddStopForm onAdd={(newStop) => {
                  const stop: Stop = {
                    ...newStop,
                    id: `stop-${Date.now()}`,
                    sequence: stops.length + 1,
                    expanded: false
                  };
                  const updatedStops = [...stops, stop];
                  setStops(updatedStops);
                  onStopsUpdate(updatedStops);
                }} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Map Placeholder */}
      {showMap && (
        <Card className="h-64 bg-gray-50 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Map className="h-12 w-12 mx-auto mb-2" />
            <p>Interactive map showing stop sequence would appear here</p>
          </div>
        </Card>
      )}

      {/* Grouped Stop Lists */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(groupedStops).map(([type, typeStops]) => (
          <div key={type} className="space-y-2">
            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground flex items-center space-x-2">
              {getStopTypeIcon(type)}
              <span>{type.charAt(0).toUpperCase() + type.slice(1)} Stops</span>
              <Badge variant="outline" className="ml-2">{typeStops.length}</Badge>
            </h4>
            
            <Droppable droppableId={type}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {typeStops.map((stop, index) => (
                    <Draggable key={stop.id} draggableId={stop.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? 'shadow-lg rotate-2' : ''} transition-all`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              {/* Left: Sequence & Info */}
                              <div className="flex items-start space-x-3 flex-1">
                                <div 
                                  {...provided.dragHandleProps}
                                  className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium cursor-grab active:cursor-grabbing"
                                >
                                  {stop.sequence}
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                  {/* Location & Address */}
                                  <div>
                                    {editingStop === `${stop.id}-location` ? (
                                      <Input
                                        value={stop.location}
                                        onChange={(e) => handleInlineEdit(stop.id, 'location', e.target.value)}
                                        onBlur={() => setEditingStop(null)}
                                        onKeyDown={(e) => e.key === 'Enter' && setEditingStop(null)}
                                        className="font-medium"
                                        autoFocus
                                      />
                                    ) : (
                                      <h5 
                                        className="font-medium cursor-pointer hover:bg-gray-50 p-1 rounded"
                                        onClick={() => setEditingStop(`${stop.id}-location`)}
                                      >
                                        {stop.location}
                                      </h5>
                                    )}
                                    <p className="text-sm text-muted-foreground">{stop.address}</p>
                                  </div>

                                  {/* Time Window */}
                                  <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      {editingStop === `${stop.id}-timeWindow` ? (
                                        <Input
                                          value={stop.timeWindow}
                                          onChange={(e) => handleInlineEdit(stop.id, 'timeWindow', e.target.value)}
                                          onBlur={() => setEditingStop(null)}
                                          onKeyDown={(e) => e.key === 'Enter' && setEditingStop(null)}
                                          className="w-32 h-6"
                                          autoFocus
                                        />
                                      ) : (
                                        <span 
                                          className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                                          onClick={() => setEditingStop(`${stop.id}-timeWindow`)}
                                        >
                                          {stop.timeWindow}
                                        </span>
                                      )}
                                    </div>
                                    {stop.actualTime && (
                                      <span className="text-xs text-green-600">Actual: {stop.actualTime}</span>
                                    )}
                                  </div>

                                  {/* Contact Info */}
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span>{stop.contact}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Phone className="h-3 w-3" />
                                      <span>{stop.phone}</span>
                                    </div>
                                  </div>

                                  {/* Order Tags */}
                                  <div className="flex flex-wrap gap-1">
                                    {stop.orderIds.map(orderId => (
                                      <Badge key={orderId} variant="outline" className="text-xs">
                                        {orderId}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Status & Actions */}
                              <div className="flex items-start space-x-2">
                                {getStopStatusBadge(stop.status)}
                                
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleToggleExpanded(stop.id)}
                                  >
                                    {stop.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleSplitStop(stop)}
                                  >
                                    <Scissors className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                    onClick={() => handleDeleteStop(stop.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Expanded Section */}
                            {stop.expanded && (
                              <div className="mt-4 pt-4 border-t space-y-3">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label className="text-xs font-medium text-muted-foreground">Order Summary</Label>
                                    <div className="space-y-1">
                                      {stop.orderIds.map(orderId => (
                                        <div key={orderId} className="text-xs">
                                          <span className="font-medium">{orderId}</span> - ACME Corp, PO#12345, 2,500 lbs
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-medium text-muted-foreground">Notes</Label>
                                    <Textarea
                                      value={stop.notes || ''}
                                      onChange={(e) => handleInlineEdit(stop.id, 'notes', e.target.value)}
                                      placeholder="Add notes..."
                                      className="text-xs h-16 resize-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}

interface AddStopFormProps {
  onAdd: (stop: Omit<Stop, 'id' | 'sequence' | 'expanded'>) => void;
}

function AddStopForm({ onAdd }: AddStopFormProps) {
  const [formData, setFormData] = useState({
    type: "pickup" as const,
    location: "",
    address: "",
    timeWindow: "",
    status: "scheduled" as const,
    orderIds: [] as string[],
    contact: "",
    phone: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      type: "pickup",
      location: "",
      address: "",
      timeWindow: "",
      status: "scheduled",
      orderIds: [],
      contact: "",
      phone: "",
      notes: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Stop Type</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
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
          <Label>Time Window</Label>
          <Input
            value={formData.timeWindow}
            onChange={(e) => setFormData({...formData, timeWindow: e.target.value})}
            placeholder="08:00 - 12:00"
            required
          />
        </div>
      </div>

      <div>
        <Label>Location Name</Label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="ACME Warehouse"
          required
        />
      </div>

      <div>
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="123 Industrial Blvd, City, State"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Contact</Label>
          <Input
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            placeholder="John Smith"
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">Add Stop</Button>
      </div>
    </form>
  );
}
