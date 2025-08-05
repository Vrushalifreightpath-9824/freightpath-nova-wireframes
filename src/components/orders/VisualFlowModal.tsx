
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package, Truck, User, MapPin } from "lucide-react";

interface VisualFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderType: "FTL" | "LTL";
}

export function VisualFlowModal({ isOpen, onClose, orderId, orderType }: VisualFlowModalProps) {
  // Mock data - in real app this would come from API
  const flowData = {
    order: {
      id: orderId,
      type: orderType,
      customer: "ABC Logistics Inc.",
      origin: "Los Angeles, CA",
      destination: "Phoenix, AZ"
    },
    shipments: [
      {
        id: "SHIP-001",
        stops: [
          { id: "1", type: "pickup", location: "Los Angeles, CA", stopNumber: 1 },
          { id: "2", type: "delivery", location: "Phoenix, AZ", stopNumber: 2 }
        ]
      }
    ],
    trips: [
      {
        id: "TRP-001",
        driver: "John Smith",
        equipment: "TRC-001 / TRL-001",
        status: "dispatched"
      }
    ]
  };

  const getOrderTypeBadge = (type: string) => {
    return type === "FTL" ? 
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">FTL</Badge> :
      <Badge className="bg-green-100 text-green-800 border-green-200">LTL</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Flow Visualization
            {getOrderTypeBadge(orderType)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Stage */}
          <div className="flex items-center gap-4">
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-semibold">{flowData.order.id}</div>
                    <div className="text-sm text-muted-foreground">{flowData.order.customer}</div>
                    <div className="text-xs text-muted-foreground">
                      {flowData.order.origin} → {flowData.order.destination}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Shipments Stage */}
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              {flowData.shipments.map((shipment) => (
                <Card key={shipment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-8 w-8 text-green-600" />
                      <div className="flex-1">
                        <div className="font-semibold">{shipment.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {shipment.stops.length} stops configured
                        </div>
                        <div className="flex gap-2 mt-2">
                          {shipment.stops.map((stop) => (
                            <div key={stop.id} className="flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3" />
                              <span>Stop {stop.stopNumber}: {stop.location}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Trips Stage */}
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              {flowData.trips.map((trip) => (
                <Card key={trip.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-purple-600" />
                      <div>
                        <div className="font-semibold">{trip.id}</div>
                        <div className="text-sm text-muted-foreground">
                          Driver: {trip.driver}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Equipment: {trip.equipment}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {trip.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* LTL Multi-Path Indicator */}
          {orderType === "LTL" && (
            <div className="border-t pt-4">
              <div className="text-sm text-muted-foreground">
                <strong>Note:</strong> LTL orders may involve multiple shipments and trips for pickup and delivery consolidation.
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
