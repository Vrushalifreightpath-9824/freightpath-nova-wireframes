import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Truck, MapPin, Package, Clock, Route, DollarSign, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TmsLayout } from "@/components/TmsLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatusStepper } from "@/components/ui/status-stepper";
import { ExceptionBanner } from "@/components/ui/exception-banner";
import { Timeline } from "@/components/ui/timeline";
import { StopsManagementPanel } from "@/components/shipments/StopsManagementPanel";
import { TripManagementTab } from "@/components/shipments/TripManagementTab";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EnhancedStopsManagement } from "@/components/shipments/EnhancedStopsManagement";
import { EnhancedTripManagement } from "@/components/shipments/EnhancedTripManagement";
import { EnhancedOrdersManagement } from "@/components/shipments/EnhancedOrdersManagement";
import { TenderingSection } from "@/components/shipments/TenderingSection";

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


interface Stop2 {
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
  stopCount: number;
  eta: string;
  status: "planned" | "dispatched" | "in-progress" | "completed";
  executionMode: "asset" | "brokered";
  notes?: string;
  assignedStops: Stop2[];
}

const sampleShipment = {
  id: "SHP-001",
  orders: [
    { id: "ORD-001", customer: "ACME Corp", poNumber: "PO123456", executionType: "asset" as "asset" | "brokered", assignedTrip: "TRIP-001" },
    { id: "ORD-002", customer: "ACME Corp", poNumber: "PO123457", executionType: "brokered" as "asset" | "brokered", assignedTrip: "TRIP-002" }
  ],
  status: "in-transit" as const,
  executionMode: "hybrid" as "asset" | "brokered" | "hybrid",
  tenderStatus: "partially_tendered" as "pending" | "tendered" | "accepted" | "rejected" | "partially_tendered",
  equipment: "Dry Van 53'",
  driver: {
    name: "John Doe",
    phone: "(555) 123-4567",
    license: "CDL-A-12345"
  },
  vehicle: {
    truck: "T-4567",
    trailer: "TR-8901"
  },
  route: {
    origin: "New York, NY",
    destination: "Boston, MA",
    totalMiles: 215,
    estimatedTime: "4h 15m"
  },
  stops: [
    {
      id: "1",
      type: "pickup" as const,
      sequence: 1,
      location: "ACME Warehouse",
      address: "123 Industrial Blvd, Brooklyn, NY 11201",
      timeWindow: "08:00 - 12:00",
      actualTime: "09:15",
      status: "completed" as const,
      orderId: "ORD-001",
      contact: "Mike Johnson",
      phone: "(555) 987-6543"
    },
    {
      id: "2", 
      type: "pickup" as const,
      sequence: 2,
      location: "ACME Distribution",
      address: "456 Warehouse Ave, Queens, NY 11375",
      timeWindow: "13:00 - 17:00",
      actualTime: "14:30",
      status: "completed" as const,
      orderId: "ORD-002",
      contact: "Sarah Smith",
      phone: "(555) 456-7890"
    },
    {
      id: "3",
      type: "delivery" as const,
      sequence: 3,
      location: "Boston Regional DC",
      address: "789 Commerce St, Boston, MA 02101",
      timeWindow: "08:00 - 17:00",
      actualTime: null,
      status: "scheduled" as const,
      orderId: "ORD-001,ORD-002",
      contact: "Tom Wilson",
      phone: "(555) 234-5678"
    }
  ] as Stop[],
  legs: [
    {
      id: "LEG-001",
      from: "Brooklyn, NY",
      to: "Queens, NY", 
      miles: 25,
      estimatedTime: "45m",
      actualTime: "52m",
      status: "completed"
    },
    {
      id: "LEG-002",
      from: "Queens, NY",
      to: "Boston, MA",
      miles: 190,
      estimatedTime: "3h 30m",
      actualTime: null,
      status: "in-progress"
    }
  ],
  timeline: [
    { 
      id: "1",
      time: "2024-01-15 08:00", 
      timestamp: "2024-01-15 08:00",
      event: "Shipment created", 
      description: "Orders consolidated into shipment",
      actor: { type: "user" as const, name: "Sarah Connor", id: "U001" },
      trigger: "Manual Entry",
      eventType: "status_change" as const
    },
    { 
      id: "2",
      time: "2024-01-15 08:30", 
      timestamp: "2024-01-15 08:30",
      event: "Driver assigned", 
      description: "John Doe assigned to shipment",
      actor: { type: "user" as const, name: "Dispatch Team", id: "U002" },
      trigger: "TMS Assignment",
      eventType: "assignment" as const
    },
    { 
      id: "3",
      time: "2024-01-15 09:15", 
      timestamp: "2024-01-15 09:15",
      event: "First pickup completed", 
      description: "Pickup at ACME Warehouse",
      actor: { type: "driver" as const, name: "John Doe", id: "D001" },
      trigger: "Mobile App",
      eventType: "status_change" as const
    },
    { 
      id: "4",
      time: "2024-01-15 14:30", 
      timestamp: "2024-01-15 14:30",
      event: "Second pickup completed", 
      description: "Pickup at ACME Distribution",
      actor: { type: "driver" as const, name: "John Doe", id: "D001" },
      trigger: "Mobile App",
      eventType: "status_change" as const
    },
    { 
      id: "5",
      time: "2024-01-15 15:00", 
      timestamp: "2024-01-15 15:00",
      event: "En route to delivery", 
      description: "Heading to Boston Regional DC",
      actor: { type: "system" as const, name: "GPS Tracking", id: "SYS001" },
      trigger: "Auto Update",
      eventType: "api_update" as const
    }
  ],
  costs: {
    baserate: 1850,
    fuel: 278,
    accessorials: 125,
    total: 2253
  }
};
const sampleTrips: Trip[] = [
  {
    id: "TRIP-001",
    driverId: "D001",
    driverName: "John Doe",
    driverPhoto: "/api/placeholder/32/32",
    truckId: "T-4567",
    trailerId: "TR-8901",
    stopCount: 3,
    eta: "2024-01-15 18:00",
    status: "in-progress",
    executionMode: "asset",
    notes: "Driver has experience with this route",
    assignedStops: [
      {
        id: "1",
        type: "pickup" as const,
        location: "ACME Warehouse",
        address: "123 Industrial Blvd, Brooklyn, NY 11201",
        orderIds: ["ORD-001"],
        timeWindow: "13:00 - 17:00",
      },
      {
        id: "2", 
        type: "pickup" as const,
        location: "ACME Distribution",
        address: "456 Warehouse Ave, Queens, NY 11375",
        orderIds: ["ORD-002"],
        timeWindow: "13:00 - 17:00",
      },
      {
        id: "3",
        type: "delivery" as const,
        location: "Boston Regional DC",
        address: "789 Commerce St, Boston, MA 02101",
        orderIds: ["ORD-001,ORD-002"],
        timeWindow: "08:00 - 17:00",

      
    }] // assign actual Stop[] instead of strings
  }
];

// Status stepper configuration
const statusSteps = [
  {
    id: "created",
    label: "Created",
    status: "completed" as const,
    timestamp: "Jan 15, 8:00 AM",
    description: "Order received"
  },
  {
    id: "planned",
    label: "Planned",
    status: "completed" as const,
    timestamp: "Jan 15, 8:30 AM",
    description: "Route optimized"
  },
  {
    id: "in-transit",
    label: "In Transit",
    status: "active" as const,
    timestamp: "Jan 15, 3:00 PM",
    description: "En route"
  },
  {
    id: "delivered",
    label: "Delivered",
    status: "upcoming" as const,
    description: "ETA 6:00 PM"
  },
  {
    id: "closed",
    label: "Closed",
    status: "upcoming" as const,
    description: "Pending POD"
  }
];

const getStopStatusBadge = (status: string) => {
  const statusMap: Record<string, any> = {
    completed: "delivered",
    scheduled: "planned",
    skipped: "cancelled"
  };
  return <StatusBadge status={statusMap[status] || "planned"} />;
};

const getTripStatusBadge = (status: string) => {
  const statusMap: Record<string, any> = {
    "in-progress": "in-transit",
    "completed": "delivered",
    "planned": "planned",
    "dispatched": "tendered"
  };
  return <StatusBadge status={statusMap[status] || "planned"} />;
};

// Convert existing stops to new format
const enhancedStops = sampleShipment.stops.map(stop => ({
  ...stop,
  orderIds: [stop.orderId]
}));

// Sample unassigned stops for trip management
const sampleUnassignedStops = [
  {
    id: "unassigned-1",
    type: "pickup" as const,
    location: "Pending Assignment",
    address: "567 Warehouse Rd, Newark, NJ 07102",
    orderIds: ["ORD-003"],
    timeWindow: "14:00 - 18:00"
  }
];

export function ShipmentDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stops, setStops] = useState(enhancedStops);
  const [trips, setTrips] = useState<Trip[]>(sampleTrips);
  const [unassignedStops, setUnassignedStops] = useState(sampleUnassignedStops);
  const [showExceptionBanner, setShowExceptionBanner] = useState(true);

  const handleStopsUpdate = (updatedStops: any[]) => {
    setStops(updatedStops);
  };

  const handleTripsUpdate = (updatedTrips: Trip[]) => {
    setTrips(updatedTrips);
  };

  const handleUnassignedStopsUpdate = (updatedStops: any[]) => {
    setUnassignedStops(updatedStops);
  };

  const handleOrdersUpdate = (updatedOrders: any[]) => {
    // Handle orders update if needed
    console.log('Orders updated:', updatedOrders);
  };

  return (
    <TmsLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/shipments")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shipments
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{sampleShipment.id}</h1>
              <p className="text-muted-foreground">
                {sampleShipment.orders.length} orders • {sampleShipment.route.totalMiles} miles
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`font-medium ${
              sampleShipment.executionMode === 'asset' ? 'bg-blue-100 text-blue-800' :
              sampleShipment.executionMode === 'brokered' ? 'bg-orange-100 text-orange-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {sampleShipment.executionMode.charAt(0).toUpperCase() + sampleShipment.executionMode.slice(1)}
            </Badge>
            <StatusBadge status="in-transit" />
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Shipment
            </Button>
            <Button variant="outline">
              <Truck className="h-4 w-4 mr-2" />
              Track Live
            </Button>
          </div>
        </div>

        {/* Exception Banner */}
        {showExceptionBanner && (
          <ExceptionBanner
            type="attention-required"
            title="Delivery Window At Risk"
            summary="Current ETA (6:00 PM) exceeds customer delivery window (5:00 PM) by 1 hour"
            details={{
              reason: "Traffic delays due to construction on I-95",
              location: "Boston, MA approach",
              timestamp: "Jan 15, 4:30 PM",
              impact: "Potential customer service escalation and delivery fee",
              suggestedAction: "Contact customer to negotiate extended delivery window or expedite route"
            }}
            onDismiss={() => setShowExceptionBanner(false)}
          />
        )}

        {/* Status Stepper */}
        <Card className="pt-3">
          <CardContent>
            <StatusStepper steps={statusSteps} />
          </CardContent>
        </Card>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="stops">Stops</TabsTrigger>
            <TabsTrigger value="legs">Legs</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
            {(sampleShipment.executionMode === 'brokered' || sampleShipment.executionMode === 'hybrid') && (
              <TabsTrigger value="tendering">Tendering</TabsTrigger>
            )}
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipment Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>Shipment Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Execution Mode</label>
                        <p className="font-medium">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {sampleShipment.executionMode}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Equipment</label>
                        <p className="font-medium">{sampleShipment.equipment}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Total Distance</label>
                        <p className="font-medium">{sampleShipment.route.totalMiles} miles</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Estimated Time</label>
                        <p className="font-medium">{sampleShipment.route.estimatedTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visual Status Propagation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status Overview</CardTitle>
                    <CardDescription>Hierarchical status view across all levels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Trips Status */}
                    <div>
                      <h4 className="font-medium mb-2">Trips</h4>
                      <div className="flex flex-wrap gap-2">
                        {trips.map((trip) => (
                          <div key={trip.id} className="flex items-center space-x-2 p-2 border rounded">
                            <span className="text-sm font-medium">{trip.id}</span>
                            {getTripStatusBadge(trip.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Stops Status */}
                    <div>
                      <h4 className="font-medium mb-2">Stops</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {stops.map((stop) => (
                          <div key={stop.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                                {stop.sequence}
                              </span>
                              <span className="text-sm">{stop.location}</span>
                            </div>
                            {getStopStatusBadge(stop.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Orders Status */}
                    <div>
                      <h4 className="font-medium mb-2">Linked Orders</h4>
                      <div className="space-y-2">
                        {sampleShipment.orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="font-medium">{order.id}</span>
                              <p className="text-sm text-muted-foreground">{order.customer}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Awaiting POD
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Route Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Route className="h-5 w-5" />
                      <span>Route Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{sampleShipment.route.origin}</p>
                          <p className="text-sm text-muted-foreground">Origin</p>
                        </div>
                      </div>
                      <div className="ml-1.5 w-0.5 h-8 bg-muted"></div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{sampleShipment.route.destination}</p>
                          <p className="text-sm text-muted-foreground">Destination</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Driver & Vehicle Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Truck className="h-5 w-5" />
                      <span>Driver & Vehicle</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Driver</label>
                      <p className="font-medium">{sampleShipment.driver.name}</p>
                      <p className="text-sm text-muted-foreground">{sampleShipment.driver.phone}</p>
                      <p className="text-sm text-muted-foreground">{sampleShipment.driver.license}</p>
                    </div>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Equipment</label>
                      <div className="space-y-1">
                        <p className="font-medium">Truck: {sampleShipment.vehicle.truck}</p>
                        <p className="font-medium">Trailer: {sampleShipment.vehicle.trailer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">2/3</div>
                        <div className="text-xs text-muted-foreground">Stops Complete</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">67%</div>
                        <div className="text-xs text-muted-foreground">Route Progress</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Cost Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Rate</span>
                      <span>${sampleShipment.costs.baserate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fuel Surcharge</span>
                      <span>${sampleShipment.costs.fuel.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accessorials</span>
                      <span>${sampleShipment.costs.accessorials.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${sampleShipment.costs.total.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <EnhancedOrdersManagement 
              orders={sampleShipment.orders.map(order => ({
                ...order,
                orderType: "LTL" as const,
                status: "Awaiting POD",
                linkedStops: ["Stop 1", "Stop 3"],
                weight: "2,500 lbs",
                dimensions: "48x40x36",
                packageType: "Pallets",
                pickupLocation: "Brooklyn, NY",
                deliveryLocation: "Boston, MA"
              }))}
              onOrdersUpdate={handleOrdersUpdate}
              executionMode={sampleShipment.executionMode}
            />
          </TabsContent>

          <TabsContent value="stops" className="space-y-6">
            <EnhancedStopsManagement 
              stops={stops}
              onStopsUpdate={handleStopsUpdate}
              executionMode={sampleShipment.executionMode}
            />
          </TabsContent>
          <TabsContent value="legs" className="space-y-6">
            </TabsContent>
          <TabsContent value="trips" className="space-y-6">
            <EnhancedTripManagement 
              trips={trips}
              unassignedStops={unassignedStops}
              onTripsUpdate={handleTripsUpdate}
              onUnassignedStopsUpdate={handleUnassignedStopsUpdate}
              executionMode={sampleShipment.executionMode}
            />
          </TabsContent>

          {(sampleShipment.executionMode === 'brokered' || sampleShipment.executionMode === 'hybrid') && (
            <TabsContent value="tendering" className="space-y-6">
              <TenderingSection 
                shipmentId={sampleShipment.id}
                executionMode={sampleShipment.executionMode}
                tenderStatus={sampleShipment.tenderStatus}
              />
            </TabsContent>
          )}

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail & Timeline</CardTitle>
                <CardDescription>Complete activity history with detailed event tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline events={sampleShipment.timeline} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>Detailed shipment cost analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Rate</span>
                      <span className="font-medium">${sampleShipment.costs.baserate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuel Surcharge (15%)</span>
                      <span className="font-medium">${sampleShipment.costs.fuel.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accessorials</span>
                      <span className="font-medium">${sampleShipment.costs.accessorials.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-medium">Total Cost</span>
                      <span className="font-bold">${sampleShipment.costs.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Metrics</CardTitle>
                  <CardDescription>Performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost per Mile</span>
                      <span className="font-medium">${(sampleShipment.costs.total / sampleShipment.route.totalMiles).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue per Order</span>
                      <span className="font-medium">${(sampleShipment.costs.total / sampleShipment.orders.length).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Margin Estimate</span>
                      <span className="font-medium text-green-600">18.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TmsLayout>
  );
}
