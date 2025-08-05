
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { existingShipments } from "@/data/shipmentPlanningData";

export function ActiveShipmentsTab() {
  const getOrderTypeBadge = (orderType: string) => {
    switch (orderType) {
      case "FTL":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">FTL</Badge>;
      case "LTL":
        return <Badge className="bg-green-100 text-green-800 border-green-200">LTL</Badge>;
      case "Mixed":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Mixed</Badge>;
      default:
        return <Badge variant="outline">{orderType}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Shipments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Miles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {existingShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell>
                  {getOrderTypeBadge(shipment.orderType)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={shipment.status} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{shipment.orderCount} orders</Badge>
                </TableCell>
                <TableCell>{shipment.totalWeight}</TableCell>
                <TableCell>{shipment.equipment}</TableCell>
                <TableCell>{shipment.route}</TableCell>
                <TableCell>{shipment.driver}</TableCell>
                <TableCell>{shipment.estimatedMiles} mi</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
