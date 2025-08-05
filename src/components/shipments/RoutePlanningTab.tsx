
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TmsMap } from "@/components/maps/TmsMap";
import { Route, MapPin, Clock, Plus, GripVertical } from "lucide-react";

interface Stop {
  id: string;
  type: string;
  address: string;
  orderIds: string[];
}

export function RoutePlanningTab() {
  const [stops, setStops] = useState<Stop[]>([
    { id: "stop-1", type: "pickup", address: "Los Angeles, CA", orderIds: ["ORD-001"] },
    { id: "stop-2", type: "pickup", address: "Los Angeles, CA", orderIds: ["ORD-002"] },
    { id: "stop-3", type: "delivery", address: "Las Vegas, NV", orderIds: ["ORD-002"] },
    { id: "stop-4", type: "delivery", address: "Phoenix, AZ", orderIds: ["ORD-001"] }
  ]);

  const mapLocations = stops.map((stop, index) => ({
    id: stop.id,
    coordinates: [
      stop.address.includes("Los Angeles") ? -118.2437 : 
      stop.address.includes("Las Vegas") ? -115.1398 :
      stop.address.includes("Phoenix") ? -112.0740 : -118.2437,
      stop.address.includes("Los Angeles") ? 34.0522 :
      stop.address.includes("Las Vegas") ? 36.1699 :
      stop.address.includes("Phoenix") ? 33.4484 : 34.0522
    ] as [number, number],
    type: stop.type as 'pickup' | 'delivery',
    label: `${stop.type} - ${stop.address}`,
    status: index < 2 ? 'completed' : 'pending' as any
  }));

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Stop Sequence */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Stop Sequence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-2 p-2 border rounded">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={stop.type === 'pickup' ? 'default' : 'secondary'}>
                      {stop.type}
                    </Badge>
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{stop.address}</div>
                  <div className="text-xs text-muted-foreground">
                    Orders: {stop.orderIds.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Stop
          </Button>
        </CardContent>
      </Card>

      {/* Route Map */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Visualization
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Est. 6.5 hours
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TmsMap 
            locations={mapLocations}
            showRoutes={true}
          />
          
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div className="p-3 bg-muted rounded">
              <div className="text-2xl font-bold">425</div>
              <div className="text-sm text-muted-foreground">Total Miles</div>
            </div>
            <div className="p-3 bg-muted rounded">
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">Stops</div>
            </div>
            <div className="p-3 bg-muted rounded">
              <div className="text-2xl font-bold">6.5</div>
              <div className="text-sm text-muted-foreground">Est. Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
