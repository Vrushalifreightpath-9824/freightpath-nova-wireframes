
import { useState } from "react";
import { TmsLayout } from "@/components/TmsLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TmsMap } from "@/components/maps/TmsMap";
import { Separator } from "@/components/ui/separator";
import { Search, Truck, User, MapPin, Clock, AlertTriangle, CheckCircle, Play, Pause, RotateCcw } from "lucide-react";

// Sample dispatch data
const activeShipments = [
  {
    id: "SHIP-001",
    status: "dispatched",
    driver: "John Smith",
    equipment: "TRK-101 / TRL-201",
    currentLocation: "Riverside, CA",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    eta: "2024-01-16 14:30",
    progress: 65,
    lastUpdate: "2 mins ago",
    alerts: ["Traffic Delay"],
    coordinates: [-117.3755, 33.9425] as [number, number]
  },
  {
    id: "SHIP-002", 
    status: "in-transit",
    driver: "Sarah Johnson",
    equipment: "TRK-102 / TRL-202",
    currentLocation: "Flagstaff, AZ",
    origin: "Phoenix, AZ", 
    destination: "Denver, CO",
    eta: "2024-01-17 09:15",
    progress: 40,
    lastUpdate: "5 mins ago",
    alerts: [],
    coordinates: [-111.6514, 35.1983] as [number, number]
  },
  {
    id: "SHIP-003",
    status: "delayed",
    driver: "Mike Wilson",
    equipment: "TRK-103 / TRL-203", 
    currentLocation: "Bakersfield, CA",
    origin: "San Francisco, CA",
    destination: "Las Vegas, NV",
    eta: "2024-01-16 18:45",
    progress: 25,
    lastUpdate: "15 mins ago",
    alerts: ["Equipment Issue", "Detention"],
    coordinates: [-119.0187, 35.3733] as [number, number]
  }
];

const availableDrivers = [
  { id: "DRV-001", name: "Robert Brown", status: "available", location: "Los Angeles, CA", lastTrip: "2024-01-14" },
  { id: "DRV-002", name: "Lisa Davis", status: "available", location: "Phoenix, AZ", lastTrip: "2024-01-13" },
  { id: "DRV-003", name: "Tom Martinez", status: "off-duty", location: "Denver, CO", lastTrip: "2024-01-15" }
];

const availableEquipment = [
  { id: "TRK-104", type: "Tractor", status: "available", location: "Los Angeles, CA" },
  { id: "TRL-204", type: "Dry Van", status: "available", location: "Los Angeles, CA" },
  { id: "TRK-105", type: "Tractor", status: "maintenance", location: "Phoenix, AZ" }
];

export default function DispatchBoard() {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dispatched':
        return 'bg-blue-500';
      case 'in-transit':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-red-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'dispatched':
        return 'default';
      case 'in-transit':
        return 'secondary';
      case 'delayed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Convert active shipments to map locations
  const mapLocations = activeShipments.map(shipment => ({
    id: shipment.id,
    coordinates: shipment.coordinates,
    type: 'terminal' as const,
    label: `${shipment.id} - ${shipment.driver}`,
    status: shipment.status === 'delayed' ? 'pending' as const : 'in-transit' as const
  }));

  return (
    <TmsLayout 
      title="Dispatch Board"
      breadcrumbs={[
        { label: "Shipments", href: "/shipments" },
        { label: "Dispatch Board" }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shipments, drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50">
              Active: {activeShipments.filter(s => s.status !== 'completed').length}
            </Badge>
            <Badge variant="outline" className="bg-red-50">
              Delayed: {activeShipments.filter(s => s.status === 'delayed').length}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Active Shipments */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Active Shipments ({activeShipments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeShipments.map((shipment) => (
                  <div 
                    key={shipment.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedShipment === shipment.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedShipment(shipment.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(shipment.status)}`} />
                          <span className="font-medium">{shipment.id}</span>
                        </div>
                        <Badge variant={getStatusBadgeVariant(shipment.status)}>
                          {shipment.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{shipment.driver}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>{shipment.equipment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{shipment.currentLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>ETA: {shipment.eta}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getStatusColor(shipment.status)}`}
                            style={{ width: `${shipment.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      {shipment.alerts.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {shipment.alerts.map((alert, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {alert}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Last update: {shipment.lastUpdate}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Map and Details */}
          <div className="col-span-2 space-y-6">
            {/* Live Map */}
            <Card>
              <CardHeader>
                <CardTitle>Live Fleet Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <TmsMap locations={mapLocations} showRoutes={false} />
              </CardContent>
            </Card>

            {/* Shipment Detail */}
            {selectedShipment && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipment Details - {selectedShipment}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="stops">Stops</TabsTrigger>
                      <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      {(() => {
                        const shipment = activeShipments.find(s => s.id === selectedShipment);
                        return shipment ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Route Information</h4>
                              <div className="text-sm space-y-1">
                                <div>Origin: {shipment.origin}</div>
                                <div>Destination: {shipment.destination}</div>
                                <div>Current: {shipment.currentLocation}</div>
                                <div>ETA: {shipment.eta}</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Assignment</h4>
                              <div className="text-sm space-y-1">
                                <div>Driver: {shipment.driver}</div>
                                <div>Equipment: {shipment.equipment}</div>
                                <div>Status: {shipment.status}</div>
                                <div>Progress: {shipment.progress}%</div>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </TabsContent>
                    
                    <TabsContent value="stops">
                      <div className="text-sm text-muted-foreground">
                        Stop details and check-in status would be displayed here
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="exceptions">
                      <div className="text-sm text-muted-foreground">
                        Exception tracking and resolution would be displayed here
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Resources Panel */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Available Drivers ({availableDrivers.filter(d => d.status === 'available').length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {driver.location} • Last trip: {driver.lastTrip}
                      </div>
                    </div>
                    <Badge variant={driver.status === 'available' ? 'secondary' : 'outline'}>
                      {driver.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Available Equipment ({availableEquipment.filter(e => e.status === 'available').length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableEquipment.map((equipment) => (
                  <div key={equipment.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{equipment.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {equipment.type} • {equipment.location}
                      </div>
                    </div>
                    <Badge variant={equipment.status === 'available' ? 'secondary' : 'outline'}>
                      {equipment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TmsLayout>
  );
}
