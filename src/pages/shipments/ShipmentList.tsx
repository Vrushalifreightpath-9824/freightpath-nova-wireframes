
import { TmsLayout } from "@/components/TmsLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, Filter, Ship, MapPin, Clock, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"; // shadcn

// Sample shipment data
const shipments = [
  {
    id: "SHIP-001",
    orderCount: 2,
    orders: ["ORD-001", "ORD-002"],
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    equipment: "Dry Van 53'",
    mode: "Asset",
    status: "planned" as const,
    carrier: "Internal Fleet",
    eta: "2024-01-16 14:30",
    totalWeight: "23,500 lbs",
    customer: "ABC Logistics Inc."
  },
  {
    id: "SHIP-002",
    orderCount: 1,
    orders: ["ORD-003"],
    origin: "Los Angeles, CA",
    destination: "San Francisco, CA",
    equipment: "Reefer 53'",
    mode: "Brokered",
    status: "tendered" as const,
    carrier: "West Coast Freight",
    eta: "2024-01-17 09:15",
    totalWeight: "15,000 lbs",
    customer: "TechCorp Solutions"
  },
  {
    id: "SHIP-003",
    orderCount: 3,
    orders: ["ORD-004", "ORD-005", "ORD-006"],
    origin: "Chicago, IL",
    destination: "Detroit, MI",
    equipment: "Dry Van 53'",
    mode: "Hybrid",
    status: "dispatched" as const,
    carrier: "Midwest Express",
    eta: "2024-01-15 16:45",
    totalWeight: "28,200 lbs",
    customer: "Manufacturing Co."
  },
  {
    id: "SHIP-004",
    orderCount: 1,
    orders: ["ORD-007"],
    origin: "Miami, FL",
    destination: "Atlanta, GA",
    equipment: "Flatbed 48'",
    mode: "Asset",
    status: "in-transit" as const,
    carrier: "Internal Fleet",
    eta: "2024-01-15 11:30",
    totalWeight: "19,800 lbs",
    customer: "Steel Works Ltd."
  }
];

export default function ShipmentList() {
  return (
    <TmsLayout 
      title="Shipment Management"
      breadcrumbs={[
        { label: "Shipments" }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search shipments..."
                className="pl-10 w-80"
              />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="tendered">Tendered</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="asset">Asset</SelectItem>
                <SelectItem value="brokered">Brokered</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Link to="/shipments/planning">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Shipment
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Total Shipments</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">In Transit</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Delayed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Delivered Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">
                      <Link to={`/shipments/${shipment.id}`}>
                        {shipment.id}
                      </Link>
                    </TableCell>
                    <TableCell>
  <div className="flex flex-wrap gap-1">
    {shipment.orders.slice(0, 2).map((orderId) => (
      <Badge key={orderId} variant="outline" className="text-xs">
        {orderId}
      </Badge>
    ))}

    {shipment.orders.length > 2 && (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Badge variant="secondary" className="cursor-pointer text-xs">
            +{shipment.orders.length - 2} more
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="space-y-1 p-3 w-auto text-xs">
          {shipment.orders.map((orderId) => (
            <div key={orderId}>{orderId}</div>
          ))}
        </HoverCardContent>
      </HoverCard>
    )}
  </div>
</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {shipment.origin} → {shipment.destination}
                      </div>
                    </TableCell>
                    <TableCell>{shipment.equipment}</TableCell>
                    <TableCell>
                      <Badge variant={
                        shipment.mode === 'Asset' ? 'default' : 
                        shipment.mode === 'Brokered' ? 'secondary' : 'outline'
                      }>
                        {shipment.mode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={shipment.status} />
                    </TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {shipment.eta}
                      </div>
                    </TableCell>
                    <TableCell>{shipment.totalWeight}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" asChild>
                        <Link to="/shipments/SHP-001">View</Link>
                        
                          {/* <Link to={`/shipments/${shipment.id}`}>View</Link> */}
                        </Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TmsLayout>
  );
}
