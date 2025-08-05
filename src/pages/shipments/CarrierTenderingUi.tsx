
import { useState } from "react";
import { TmsLayout } from "@/components/TmsLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Clock, CheckCircle, XCircle, AlertCircle, Truck, Mail, Smartphone, Globe } from "lucide-react";

// Sample data
const carriers = [
  {
    id: "CAR-001",
    name: "Swift Transportation",
    rating: 4.8,
    equipment: ["Dry Van", "Reefer"],
    regions: ["West", "Southwest"],
    contractRate: "$2,400",
    spotRate: "$2,650",
    preferredMethod: "Portal",
    responseTime: "15 mins avg",
    approved: true
  },
  {
    id: "CAR-002", 
    name: "JB Hunt Transport",
    rating: 4.6,
    equipment: ["Dry Van", "Flatbed"],
    regions: ["West", "Central"],
    contractRate: "$2,350",
    spotRate: "$2,600",
    preferredMethod: "EDI",
    responseTime: "12 mins avg",
    approved: true
  },
  {
    id: "CAR-003",
    name: "Local Freight LLC",
    rating: 4.2,
    equipment: ["Dry Van"],
    regions: ["West"],
    contractRate: null,
    spotRate: "$2,800",
    preferredMethod: "Email",
    responseTime: "45 mins avg",
    approved: true
  }
];

const tenderHistory = [
  {
    shipmentId: "SHIP-001",
    carrier: "Swift Transportation",
    method: "Portal",
    sentAt: "2024-01-15 10:30",
    expiresAt: "2024-01-15 11:00",
    status: "accepted",
    responseTime: "12 mins"
  },
  {
    shipmentId: "SHIP-002", 
    carrier: "JB Hunt Transport",
    method: "EDI",
    sentAt: "2024-01-15 09:15",
    expiresAt: "2024-01-15 09:45",
    status: "declined",
    responseTime: "18 mins"
  },
  {
    shipmentId: "SHIP-003",
    carrier: "Local Freight LLC", 
    method: "Email",
    sentAt: "2024-01-15 08:00",
    expiresAt: "2024-01-15 08:30",
    status: "expired",
    responseTime: null
  }
];

export function CarrierTenderingUi() {
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [tenderMethod, setTenderMethod] = useState("auto");
  const [tenderWindow, setTenderWindow] = useState("30");
  const [activeTab, setActiveTab] = useState("selector");

  const handleCarrierSelect = (carrierId: string, checked: boolean) => {
    if (checked) {
      setSelectedCarriers(prev => [...prev, carrierId]);
    } else {
      setSelectedCarriers(prev => prev.filter(id => id !== carrierId));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Portal':
        return <Globe className="h-4 w-4" />;
      case 'EDI':
        return <Smartphone className="h-4 w-4" />;
      case 'Email':
        return <Mail className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  return (
  
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="selector">Carrier Selection</TabsTrigger>
            <TabsTrigger value="tender">Tender Setup</TabsTrigger>
            <TabsTrigger value="tracking">Response Tracking</TabsTrigger>
            <TabsTrigger value="history">Tender History</TabsTrigger>
          </TabsList>

          {/* Carrier Selection */}
          <TabsContent value="selector">
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Carrier Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label>Equipment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Equipment</SelectItem>
                          <SelectItem value="dry-van">Dry Van</SelectItem>
                          <SelectItem value="reefer">Refrigerated</SelectItem>
                          <SelectItem value="flatbed">Flatbed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Region</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Regions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="west">West</SelectItem>
                          <SelectItem value="central">Central</SelectItem>
                          <SelectItem value="east">East</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="4.5">4.5+ Stars</SelectItem>
                          <SelectItem value="4.0">4.0+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search carriers..." className="pl-10" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carrier List */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Carriers ({carriers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {carriers.map((carrier) => (
                      <div key={carrier.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedCarriers.includes(carrier.id)}
                            onCheckedChange={(checked) => handleCarrierSelect(carrier.id, checked as boolean)}
                          />
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <h3 className="font-medium">{carrier.name}</h3>
                                <Badge variant="outline">{carrier.rating}★</Badge>
                                {carrier.approved && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Approved
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                {carrier.contractRate && (
                                  <div className="font-medium text-green-600">
                                    Contract: {carrier.contractRate}
                                  </div>
                                )}
                                <div className="text-sm text-muted-foreground">
                                  Spot: {carrier.spotRate}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Equipment:</span>
                                <div className="flex gap-1 mt-1">
                                  {carrier.equipment.map((eq) => (
                                    <Badge key={eq} variant="outline" className="text-xs">
                                      {eq}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Regions:</span>
                                <div className="flex gap-1 mt-1">
                                  {carrier.regions.map((region) => (
                                    <Badge key={region} variant="outline" className="text-xs">
                                      {region}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Response Time:</span>
                                <p className="mt-1">{carrier.responseTime}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                              {getMethodIcon(carrier.preferredMethod)}
                              <span className="text-muted-foreground">
                                Preferred Method: {carrier.preferredMethod}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tender Setup */}
          <TabsContent value="tender">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Carriers ({selectedCarriers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCarriers.length === 0 ? (
                    <p className="text-muted-foreground">No carriers selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedCarriers.map((carrierId) => {
                        const carrier = carriers.find(c => c.id === carrierId);
                        return carrier ? (
                          <div key={carrierId} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span>{carrier.name}</span>
                            <Badge variant="outline">{carrier.preferredMethod}</Badge>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tender Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Tender Method</Label>
                      <Select value={tenderMethod} onValueChange={setTenderMethod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto-detect Preferred</SelectItem>
                          <SelectItem value="portal">Carrier Portal</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="edi">EDI 204</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Response Window (minutes)</Label>
                      <Select value={tenderWindow} onValueChange={setTenderWindow}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Additional Instructions</Label>
                      <Textarea 
                        placeholder="Special instructions for carriers..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shipment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Shipment ID:</span>
                        <span className="font-medium">SHIP-001</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span>Los Angeles, CA → Phoenix, AZ</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span>425 miles</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equipment:</span>
                        <span>Dry Van (53')</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pickup Date:</span>
                        <span>2024-01-15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Date:</span>
                        <span>2024-01-18</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-medium">
                      <span>Target Rate:</span>
                      <span className="text-green-600">$2,400 - $2,650</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Preview Tender</Button>
                <Button disabled={selectedCarriers.length === 0}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Tender
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Response Tracking */}
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Active Tenders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenderHistory.slice(0, 3).map((tender, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{tender.shipmentId}</TableCell>
                        <TableCell>{tender.carrier}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMethodIcon(tender.method)}
                            {tender.method}
                          </div>
                        </TableCell>
                        <TableCell>{tender.sentAt}</TableCell>
                        <TableCell>{tender.expiresAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tender.status)}
                            <Badge 
                              variant={
                                tender.status === 'accepted' ? 'secondary' :
                                tender.status === 'declined' ? 'destructive' : 'outline'
                              }
                            >
                              {tender.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Resend</Button>
                            <Button variant="outline" size="sm">Cancel</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tender History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Tender History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenderHistory.map((tender, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{tender.shipmentId}</TableCell>
                        <TableCell>{tender.carrier}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMethodIcon(tender.method)}
                            {tender.method}
                          </div>
                        </TableCell>
                        <TableCell>{tender.sentAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tender.status)}
                            <Badge 
                              variant={
                                tender.status === 'accepted' ? 'secondary' :
                                tender.status === 'declined' ? 'destructive' : 'outline'
                              }
                            >
                              {tender.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{tender.responseTime || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
