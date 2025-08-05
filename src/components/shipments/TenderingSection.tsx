import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Mail, Phone, Send, Clock, DollarSign, FileText } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface TenderRecord {
  id: string;
  carrierId: string;
  carrierName: string;
  contactEmail: string;
  contactPhone: string;
  method: "manual" | "email" | "edi";
  rate: number;
  sentDate: string;
  responseDate?: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  notes?: string;
}

interface TenderingSectionProps {
  shipmentId: string;
  executionMode: "asset" | "brokered" | "hybrid";
  tenderStatus: "pending" | "tendered" | "accepted" | "rejected" | "partially_tendered";
}

const sampleCarriers = [
  { id: "CAR-001", name: "Reliable Transport LLC", email: "dispatch@reliable.com", phone: "(555) 100-2000" },
  { id: "CAR-002", name: "Express Logistics Co", email: "ops@expresslog.com", phone: "(555) 200-3000" },
  { id: "CAR-003", name: "Swift Freight Solutions", email: "loads@swiftfreight.com", phone: "(555) 300-4000" }
];

const sampleTenders: TenderRecord[] = [
  {
    id: "TND-001",
    carrierId: "CAR-002",
    carrierName: "Express Logistics Co",
    contactEmail: "ops@expresslog.com",
    contactPhone: "(555) 200-3000",
    method: "email",
    rate: 2100,
    sentDate: "2024-01-15 10:30",
    responseDate: "2024-01-15 14:20",
    status: "accepted",
    notes: "Equipment available immediately"
  },
  {
    id: "TND-002",
    carrierId: "CAR-001",
    carrierName: "Reliable Transport LLC",
    contactEmail: "dispatch@reliable.com",
    contactPhone: "(555) 100-2000",
    method: "manual",
    rate: 1950,
    sentDate: "2024-01-15 09:15",
    status: "rejected",
    notes: "Equipment not available on required date"
  }
];

export function TenderingSection({ shipmentId, executionMode, tenderStatus }: TenderingSectionProps) {
  const [tenders, setTenders] = useState<TenderRecord[]>(sampleTenders);
  const [showNewTenderForm, setShowNewTenderForm] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [tenderMethod, setTenderMethod] = useState<"manual" | "email" | "edi">("email");
  const [proposedRate, setProposedRate] = useState<string>("");
  const [tenderNotes, setTenderNotes] = useState<string>("");

  const handleSubmitTender = () => {
    const carrier = sampleCarriers.find(c => c.id === selectedCarrier);
    if (!carrier) return;

    const newTender: TenderRecord = {
      id: `TND-${(tenders.length + 1).toString().padStart(3, '0')}`,
      carrierId: selectedCarrier,
      carrierName: carrier.name,
      contactEmail: carrier.email,
      contactPhone: carrier.phone,
      method: tenderMethod,
      rate: parseFloat(proposedRate),
      sentDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: "pending",
      notes: tenderNotes
    };

    setTenders([...tenders, newTender]);
    setShowNewTenderForm(false);
    setSelectedCarrier("");
    setProposedRate("");
    setTenderNotes("");
  };

  const getTenderStatusBadge = (status: string) => {
    const statusMap: Record<string, any> = {
      pending: "planned",
      accepted: "delivered", 
      rejected: "cancelled",
      expired: "cancelled"
    };
    return <StatusBadge status={statusMap[status] || "planned"} />;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "email": return <Mail className="h-4 w-4" />;
      case "manual": return <Phone className="h-4 w-4" />;
      case "edi": return <Send className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Carrier Tendering</h3>
          <p className="text-sm text-muted-foreground">
            Manage carrier relationships and tender responses for {executionMode} execution
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`${
            tenderStatus === 'accepted' ? 'bg-green-100 text-green-800' :
            tenderStatus === 'tendered' ? 'bg-blue-100 text-blue-800' :
            tenderStatus === 'partially_tendered' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {tenderStatus.charAt(0).toUpperCase() + tenderStatus.slice(1).replace('_', ' ')}
          </Badge>
          <Button onClick={() => setShowNewTenderForm(!showNewTenderForm)}>
            <Send className="h-4 w-4 mr-2" />
            New Tender
          </Button>
        </div>
      </div>

      {/* New Tender Form */}
      {showNewTenderForm && (
        <Card className="border-2 border-dashed border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Create New Tender</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Carrier</Label>
                <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleCarriers.map(carrier => (
                      <SelectItem key={carrier.id} value={carrier.id}>
                        {carrier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tender Method</Label>
                <Select value={tenderMethod} onValueChange={(value: any) => setTenderMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="manual">Phone/Manual</SelectItem>
                    <SelectItem value="edi">EDI/API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Proposed Rate ($)</Label>
                <Input
                  type="number"
                  value={proposedRate}
                  onChange={(e) => setProposedRate(e.target.value)}
                  placeholder="2100"
                />
              </div>

              <div>
                <Label>Offer Expiration</Label>
                <Input
                  type="datetime-local"
                  defaultValue="2024-01-16T17:00"
                />
              </div>
            </div>

            <div>
              <Label>Notes / Special Instructions</Label>
              <Textarea
                value={tenderNotes}
                onChange={(e) => setTenderNotes(e.target.value)}
                placeholder="Equipment requirements, timing constraints, etc."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewTenderForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitTender}>
                <Send className="h-4 w-4 mr-2" />
                Send Tender
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tender History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Tender History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carrier</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenders.map((tender) => (
                <TableRow key={tender.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tender.carrierName}</div>
                      <div className="text-sm text-muted-foreground">{tender.contactEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(tender.method)}
                      <span className="capitalize">{tender.method}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-medium">{tender.rate.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{tender.sentDate}</TableCell>
                  <TableCell className="text-sm">
                    {tender.responseDate || <span className="text-muted-foreground">Pending</span>}
                  </TableCell>
                  <TableCell>
                    {getTenderStatusBadge(tender.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      {tender.status === "accepted" && (
                        <Button variant="ghost" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Rate Confirmation & BOL Upload */}
      {tenders.some(t => t.status === "accepted") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Documentation Upload</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rate Confirmation</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, JPG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bill of Lading (BOL)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}