import { useState } from "react";
import { RefreshCw, Download, AlertCircle, CheckCircle, Clock, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TmsLayout } from "@/components/TmsLayout";
const sampleLogs = [
  {
    id: "EDI-001",
    timestamp: "2024-01-15 14:32:15",
    type: "810 Invoice",
    partner: "ACME Corp",
    status: "success",
    recordsProcessed: 5,
    ordersCreated: 5,
    errors: 0,
    fileSize: "2.3 KB"
  },
  {
    id: "EDI-002", 
    timestamp: "2024-01-15 13:45:22",
    type: "940 Warehouse Shipping Order",
    partner: "Global Logistics",
    status: "partial",
    recordsProcessed: 8,
    ordersCreated: 6,
    errors: 2,
    fileSize: "4.1 KB"
  },
  {
    id: "EDI-003",
    timestamp: "2024-01-15 12:18:09",
    type: "204 Motor Carrier Load Tender",
    partner: "Supply Chain Solutions",
    status: "failed",
    recordsProcessed: 0,
    ordersCreated: 0,
    errors: 12,
    fileSize: "1.8 KB"
  },
  {
    id: "EDI-004",
    timestamp: "2024-01-15 11:05:44",
    type: "214 Transportation Carrier Shipment Status",
    partner: "FastTrack Shipping",
    status: "success",
    recordsProcessed: 15,
    ordersCreated: 15,
    errors: 0,
    fileSize: "7.2 KB"
  },
  {
    id: "EDI-005",
    timestamp: "2024-01-15 09:22:33",
    type: "990 Response to a Load Tender",
    partner: "Reliable Transport",
    status: "processing",
    recordsProcessed: 3,
    ordersCreated: 2,
    errors: 0,
    fileSize: "3.5 KB"
  }
];

type LogStatus = "success" | "partial" | "failed" | "processing";

const getStatusBadge = (status: LogStatus) => {
  const variants: Record<LogStatus, any> = {
    success: "delivered",
    partial: "tendered", 
    failed: "cancelled",
    processing: "planned"
  };
  
  const labels: Record<LogStatus, string> = {
    success: "Success",
    partial: "Partial",
    failed: "Failed", 
    processing: "Processing"
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
};

const getStatusIcon = (status: LogStatus) => {
  switch (status) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-status-delivered" />;
    case "partial":
      return <AlertCircle className="h-4 w-4 text-status-tendered" />;
    case "failed":
      return <AlertCircle className="h-4 w-4 text-status-cancelled" />;
    case "processing":
      return <Clock className="h-4 w-4 text-status-planned" />;
    default:
      return null;
  }
};

export function EDILogsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLogs = sampleLogs.filter(log => {
    const matchesSearch = log.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesType = typeFilter === "all" || log.type.includes(typeFilter);
    return matchesSearch && matchesStatus && matchesType;
  });

  const successCount = sampleLogs.filter(log => log.status === "success").length;
  const failedCount = sampleLogs.filter(log => log.status === "failed").length;
  const processingCount = sampleLogs.filter(log => log.status === "processing").length;

  return (
    <TmsLayout 
   
    >
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">EDI Integration Logs</h1>
          <p className="text-muted-foreground">Monitor EDI file processing and order ingestion</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{sampleLogs.length}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <RefreshCw className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-status-delivered">{successCount}</p>
              </div>
              <div className="w-8 h-8 bg-status-delivered-bg rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-status-delivered" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-status-cancelled">{failedCount}</p>
              </div>
              <div className="w-8 h-8 bg-status-cancelled-bg rounded-full flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-status-cancelled" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-status-planned">{processingCount}</p>
              </div>
              <div className="w-8 h-8 bg-status-planned-bg rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-status-planned" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Processing History</CardTitle>
              <CardDescription>EDI file processing logs and status updates</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="810">810 Invoice</SelectItem>
                  <SelectItem value="940">940 Warehouse</SelectItem>
                  <SelectItem value="204">204 Load Tender</SelectItem>
                  <SelectItem value="214">214 Status</SelectItem>
                  <SelectItem value="990">990 Response</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>EDI Type</TableHead>
                <TableHead>Trading Partner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Orders Created</TableHead>
                <TableHead>Errors</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{log.timestamp}</TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.partner}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status as LogStatus)}
                      {getStatusBadge(log.status as LogStatus)}
                    </div>
                  </TableCell>
                  <TableCell>{log.recordsProcessed}</TableCell>
                  <TableCell>{log.ordersCreated}</TableCell>
                  <TableCell>
                    {log.errors > 0 ? (
                      <span className="text-status-cancelled font-medium">{log.errors}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>{log.fileSize}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                      {log.status === "failed" && (
                        <Button variant="outline" size="sm">
                          Retry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No logs found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Important notifications and system alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection Issue:</strong> Trading partner "Supply Chain Solutions" has been experiencing connectivity issues for the past 2 hours.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <AlertDescription>
              <strong>Processing Delay:</strong> EDI 940 files are experiencing a 15-minute processing delay due to high volume.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
    </TmsLayout>
  );
}