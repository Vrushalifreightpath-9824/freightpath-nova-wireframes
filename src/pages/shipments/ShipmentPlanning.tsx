
import { TmsLayout } from "@/components/TmsLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShipmentPlanningForm } from "./ShipmentPlanningForm";
import { CarrierTenderingUi } from "./CarrierTenderingUi";
import { ActiveShipmentsTab } from "@/components/shipments/ActiveShipmentsTab";
import { RoutePlanningTab } from "@/components/shipments/RoutePlanningTab";
import { MousePointer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ShipmentPlanning() {
  const navigate = useNavigate();

  return (
    <TmsLayout 
      title="Shipment Planning"
      breadcrumbs={[
        { label: "Shipments", href: "/shipments" },
        { label: "Planning" }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Planning Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Planning Interface</h2>
            <Badge variant="outline">Standard View</Badge>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/shipments/planning/drag-drop")}
            className="flex items-center gap-2"
          >
            <MousePointer className="h-4 w-4" />
            Switch to Drag & Drop Planning
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Order Selection</TabsTrigger>
            <TabsTrigger value="Carrier">Carrier Assignment</TabsTrigger>
            <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
            <TabsTrigger value="route">Route Planning</TabsTrigger>
            
          </TabsList>

          {/* Order Selection Tab */}
          <TabsContent value="orders" className="space-y-6">
            <ShipmentPlanningForm />
          </TabsContent>

          {/* Active Shipments Tab */}
          <TabsContent value="shipments">
            <ActiveShipmentsTab />
          </TabsContent>

          {/* Route Planning Tab */}
          <TabsContent value="route" className="space-y-6">
            <RoutePlanningTab />
          </TabsContent>

          <TabsContent value="Carrier" className="space-y-6">
            <CarrierTenderingUi />
          </TabsContent>
        </Tabs>
      </div>
    </TmsLayout>
  );
}
