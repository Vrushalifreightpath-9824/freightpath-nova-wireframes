import { TmsLayout } from "@/components/TmsLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { TmsMap } from "@/components/maps/TmsMap";
import { Separator } from "@/components/ui/separator";
import { FileText, MapPin, Truck, Clock, User, Edit, X, CheckCircle, Trash2, Eye, GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { VisualFlowModal } from "@/components/orders/VisualFlowModal";
import { useNavigate } from "react-router-dom";

// Sample order data - in real app this would come from API/router params
const orderData = {
  id: "ORD-001",
  customer: "ABC Logistics Inc.",
  poNumber: "PO-2024-001",
  pickupDate: "2024-01-15",
  deliveryDate: "2024-01-18",
  status: "created" as const,
  division: "West",
  orderType: "FTL" as const,
  origin: {
    address: "1234 Industrial Blvd",
    city: "Los Angeles",
    state: "CA",
    zip: "90210",
    coordinates: [-118.2437, 34.0522] as [number, number]
  },
  destination: {
    address: "5678 Commerce Way", 
    city: "Phoenix",
    state: "AZ",
    zip: "85001",
    coordinates: [-112.0740, 33.4484] as [number, number]
  },
  freight: {
    pallets: 15,
    weight: "15,000 lbs",
    commodity: "Electronics",
    dimensions: "48x40x48"
  },
  equipment: "Dry Van (53')",
  value: "$2,850.00",
  accessorials: ["Liftgate - Origin", "Appointment Required"],
  specialInstructions: "Handle with care - fragile electronics. Call 2 hours before delivery.",
  internalNotes: "High-value customer - priority handling",
  linkedShipments: [
    {
      id: "SHIP-001",
      status: "planned" as const,
      stopNumber: 1,
      totalStops: 2,
      equipment: "Dry Van 53'",
      driver: "John Smith"
    }
  ]
};

const auditTrail = [
  { timestamp: "2024-01-14 09:15", user: "John Dispatcher", action: "Order Created", details: "Initial order entry completed" },
  { timestamp: "2024-01-14 09:20", user: "System", action: "Validation Passed", details: "All required fields validated" },
  { timestamp: "2024-01-14 10:30", user: "Jane CSR", action: "Customer Contacted", details: "Confirmed pickup window with customer" },
  { timestamp: "2024-01-14 14:45", user: "Mike Planner", action: "Rate Quoted", details: "Rate of $2,850 quoted and accepted" }
];

const attachedDocuments = [
  { name: "BOL_ORD001.pdf", type: "Bill of Lading", size: "245 KB", uploadedBy: "John Dispatcher", uploadedAt: "2024-01-14 09:25" },
  { name: "Special_Instructions.docx", type: "Instructions", size: "12 KB", uploadedBy: "Jane CSR", uploadedAt: "2024-01-14 10:35" }
];

export default function OrderDetail() {
  const [showFlowModal, setShowFlowModal] = useState(false);
  const navigate = useNavigate();

  const mapLocations = [
    {
      id: 'pickup',
      coordinates: orderData.origin.coordinates,
      type: 'pickup' as const,
      label: `${orderData.origin.city}, ${orderData.origin.state}`,
      status: 'pending' as const
    },
    {
      id: 'delivery',
      coordinates: orderData.destination.coordinates,
      type: 'delivery' as const,
      label: `${orderData.destination.city}, ${orderData.destination.state}`,
      status: 'pending' as const
    }
  ];

  type TripStatus = "created" | "dispatched" | "in-progress" | "delivered" | "closed";

  const sampleTrip = {
    id: "TRP-001",
    shipmentId: "SHP-001",
    status: "in-progress" as TripStatus,
    driver: {
      name: "John Doe",
      phone: "(555) 123-4567",
      license: "CDL-A",
      terminal: "Northeast Hub"
    },
    equipment: {
      tractorId: "TRC-001",
      trailerId: "TRL-001",
      type: "Dry Van",
      capacity: "48,000 lbs"
    },
    route: {
      origin: "New York, NY",
      destination: "Boston, MA",
      distance: "215 miles",
      estimatedDuration: "4-6 hours"
    },
    stops: [
      {
        id: "1",
        type: "pickup" as const,
        location: "Warehouse A, 123 Main St, New York, NY",
        coordinates: [-74.0, 40.7] as [number, number],
        scheduledTime: "08:00",
        actualTime: "08:15",
        status: "completed",
        notes: "Loaded 10 pallets"
      },
      {
        id: "2", 
        type: "delivery" as const,
        location: "Distribution Center, 456 Oak Ave, Boston, MA",
        coordinates: [-71.0, 42.3] as [number, number],
        scheduledTime: "16:00",
        actualTime: null,
        status: "in-progress",
        notes: ""
      }
    ],
    currentLocation: [-72.5, 41.5] as [number, number],
    createdAt: "2024-01-15T06:00:00Z",
    dispatchedAt: "2024-01-15T07:30:00Z",
    estimatedArrival: "2024-01-15T16:30:00Z"
  };

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === sampleTrip.status);
  };

  const statusSteps = [
    { key: "created", label: "Created", icon: FileText },
    { key: "dispatched", label: "Dispatched", icon: Truck },
    { key: "in-progress", label: "In Progress", icon: MapPin },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
    { key: "closed", label: "Closed", icon: FileText }
  ];

  function CommodityFormSection() {
    const [commodities, setCommodities] = useState([
      { description: "", pallets: "", weight: "", length: "" }
    ]);
  
    const addCommodity = () => {
      setCommodities([...commodities, { description: "", pallets: "", weight: "", length: "" }]);
    };
  
    const removeCommodity = (index: number) => {
      const updated = [...commodities];
      updated.splice(index, 1);
      setCommodities(updated);
    };
  
    const handleChange = (index: number, field: string, value: string) => {
      const updated = [...commodities];
      updated[index][field] = value;
      setCommodities(updated);
    };
  
    return (
      <>
          {commodities.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Description *</Label>
                <Input
                  placeholder="e.g., Electronics"
                  value={item.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Pallets</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={item.pallets}
                  onChange={(e) => handleChange(index, "pallets", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (lbs) *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={item.weight}
                  onChange={(e) => handleChange(index, "weight", e.target.value)}
                  required
                />
              </div>
              <div className="flex items-end space-x-2">
                <Input
                  type="number"
                  placeholder="Length (ft)"
                  value={item.length}
                  onChange={(e) => handleChange(index, "length", e.target.value)}
                />
                {commodities.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeCommodity(index)}
                    className="text-red-500"
                  >
                    <Trash2 className=" w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))} 
          <Button type="button" variant="outline" onClick={addCommodity}>
            + Add Another Commodity
          </Button>
          </>
    );
  }

  const getOrderTypeBadge = (orderType: string) => {
    return orderType === "FTL" ? 
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">FTL</Badge> :
      <Badge className="bg-green-100 text-green-800 border-green-200">LTL</Badge>;
  };

  return (
    <TmsLayout 
      title="Order Details"
      breadcrumbs={[
        { label: "Orders", href: "/" },
        { label: orderData.id }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{orderData.id}</h1>
              <p className="text-muted-foreground">{orderData.customer}</p>
            </div>
            <StatusBadge status={orderData.status} />
            {getOrderTypeBadge(orderData.orderType)}
            <Badge variant="outline">{orderData.division}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFlowModal(true)}>
              <GitBranch className="h-4 w-4 mr-2" />
              View Flow
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </Button>
            <Button variant="outline" size="sm">
              Duplicate
            </Button>
            <Button variant="destructive" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          </div>
        </div>

        <Card>
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const isCompleted = index < getCurrentStepIndex();
              const isCurrent = index === getCurrentStepIndex();
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted ? "bg-green-100 text-green-600" :
                    isCurrent ? "bg-blue-100 text-blue-600" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-2 text-sm">
                    <p className={`font-medium ${isCurrent ? "text-blue-600" : ""}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`mx-4 h-px w-16 ${
                      isCompleted ? "bg-green-300" : "bg-gray-300"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="quote">Quote</TabsTrigger>
            <TabsTrigger value="shipments">Linked Shipments</TabsTrigger>
            <TabsTrigger value="stops">Stops & Route</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="space-y-4">

            <div className="grid grid-cols-4 gap-4">
              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">PO Number:</span>
                      <p>{orderData.poNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium">Equipment:</span>
                      <p>{orderData.equipment}</p>
                    </div>
                    <div>
                      <span className="font-medium">Pickup Date:</span>
                      <p>{orderData.pickupDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Delivery Date:</span>
                      <p>{orderData.deliveryDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Value:</span>
                      <p className="font-semibold text-green-600">{orderData.value}</p>
                    </div>
                    <div>
                      <span className="font-medium">Division:</span>
                      <p>{orderData.division}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Route
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="font-medium text-sm">Origin</span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-5">
                      <p>{orderData.origin.address}</p>
                      <p>{orderData.origin.city}, {orderData.origin.state} {orderData.origin.zip}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="font-medium text-sm">Destination</span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-5">
                      <p>{orderData.destination.address}</p>
                      <p>{orderData.destination.city}, {orderData.destination.state} {orderData.destination.zip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Additional Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Label:</span>
                      <p>Value</p>
                    </div>
                    <div>
                      <span className="font-medium">Label:</span>
                      <p>Value</p>
                    </div>
                    <div>
                      <span className="font-medium">Label:</span>
                      <p>Value</p>
                    </div>
                    <div>
                      <span className="font-medium">Label:</span>
                      <p>Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      Special Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <p className="text-sm">{orderData.specialInstructions}</p>
                  <Separator />
                  
                  <div>
                    <span className="font-medium text-sm">Internal Notes:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                    <p className="text-sm">{orderData.internalNotes}</p>

                    </div>
                  </div>
                </CardContent>
              </Card>              
             
            </div>
            <div className="grid grid-cols-1 gap-6">

              {/* Freight Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Freight Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Pallets:</span>
                      <p>{orderData.freight.pallets}</p>
                    </div>
                    <div>
                      <span className="font-medium">Weight:</span>
                      <p>{orderData.freight.weight}</p>
                    </div>
                    <div>
                      <span className="font-medium">Commodity:</span>
                      <p>{orderData.freight.commodity}</p>
                    </div>
                    <div>
                      <span className="font-medium">Dimensions:</span>
                      <p>{orderData.freight.dimensions}</p>
                    </div>
                  </div>

                  <Separator/>

                  <CommodityFormSection/>
                  
                  <Separator />
                  
                  <div>
                    <span className="font-medium text-sm">Accessorials:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {orderData.accessorials.map((accessorial) => (
                        <Badge key={accessorial} variant="secondary" className="text-xs">
                          {accessorial}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Notes */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{orderData.specialInstructions}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Internal Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{orderData.internalNotes}</p>
                </CardContent>
              </Card>
            </div>
            </div>
          </TabsContent>

          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Linked Shipments
                </CardTitle>
                <CardDescription>
                  {orderData.orderType === "FTL" ? 
                    "This FTL order is assigned to a single shipment." :
                    "This LTL order may be part of multiple shipments for consolidation."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orderData.linkedShipments.length > 0 ? (
                  <div className="space-y-4">
                    {orderData.linkedShipments.map((shipment) => (
                      <Card key={shipment.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="font-semibold">{shipment.id}</div>
                                <div className="text-sm text-muted-foreground">
                                  Stop {shipment.stopNumber} of {shipment.totalStops}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Equipment: {shipment.equipment} • Driver: {shipment.driver}
                                </div>
                              </div>
                              <StatusBadge status={shipment.status} />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => navigate(`/shipments/${shipment.id}`)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Shipment
                              </Button>
                              <Button size="sm" variant="outline">
                                Remove
                              </Button>
                              <Button size="sm" variant="outline">
                                Reassign
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No shipments linked to this order yet.</p>
                    <Button className="mt-4" onClick={() => navigate('/shipments/planning')}>
                      Create Shipment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quote">
          </TabsContent>

          <TabsContent value="stops">
  <div className="grid grid-cols-2 gap-6">
    {/* Left: Map (50%) */}
    <div>
      <TmsMap locations={mapLocations} showRoutes={true} />
    </div>

    {/* Right: Stop Cards (50%) */}
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            Pickup Stop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-medium">{orderData.origin.address}</p>
          <p className="text-sm text-muted-foreground">
            {orderData.origin.city}, {orderData.origin.state} {orderData.origin.zip}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Scheduled: {orderData.pickupDate} 08:00 - 17:00</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            Delivery Stop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-medium">{orderData.destination.address}</p>
          <p className="text-sm text-muted-foreground">
            {orderData.destination.city}, {orderData.destination.state} {orderData.destination.zip}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Scheduled: {orderData.deliveryDate} 08:00 - 17:00</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Attached Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attachedDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditTrail.map((entry, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{entry.action}</span>
                            <Badge variant="outline" className="text-xs">{entry.user}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{entry.details}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {entry.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <VisualFlowModal 
          isOpen={showFlowModal}
          onClose={() => setShowFlowModal(false)}
          orderId={orderData.id}
          orderType={orderData.orderType}
        />
      </div>
    </TmsLayout>
  );
}
