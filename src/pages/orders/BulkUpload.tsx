import { useState } from "react";
import { TmsLayout } from "@/components/TmsLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export default function BulkUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validRows, setValidRows] = useState(0);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      validateFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const validateFile = async (file: File) => {
    setIsValidating(true);
    
    // Simulate validation
    setTimeout(() => {
      const errors: ValidationError[] = [
        { row: 3, field: "Customer Name", message: "Customer name is required" },
        { row: 5, field: "Weight", message: "Weight must be a positive number" },
        { row: 7, field: "Pickup Date", message: "Invalid date format" },
        { row: 12, field: "Origin ZIP", message: "Invalid ZIP code format" }
      ];
      
      setValidationErrors(errors);
      setValidRows(15); // Simulated valid rows
      setIsValidating(false);
    }, 2000);
  };

  const downloadTemplate = () => {
    // In a real app, this would download a CSV template
    const templateData = [
      'Customer Name,PO Number,Origin Address,Origin City,Origin State,Origin ZIP,Destination Address,Destination City,Destination State,Destination ZIP,Pickup Date,Delivery Date,Weight,Pallets,Commodity,Equipment Type',
      'ABC Logistics Inc.,PO-2024-001,123 Main St,Los Angeles,CA,90210,456 Oak Ave,Phoenix,AZ,85001,2024-01-15,2024-01-18,15000,10,Electronics,Dry Van',
      'Global Supply Chain,PO-2024-002,789 Industrial Blvd,Atlanta,GA,30309,321 Commerce Dr,Miami,FL,33101,2024-01-16,2024-01-19,22500,15,Automotive Parts,Reefer'
    ];
    
    const blob = new Blob([templateData.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'order_upload_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setValidationErrors([]);
    setValidRows(0);
  };

  const processUpload = () => {
    // Handle successful upload processing
    console.log("Processing upload...");
  };

  return (
    <TmsLayout 
      title="Bulk Order Upload"
      breadcrumbs={[
        { label: "Orders", href: "/" },
        { label: "Bulk Upload" }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Upload Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Supported Formats</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• CSV (.csv)</li>
                  <li>• Excel (.xlsx, .xls)</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Maximum 1,000 orders per file</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Required Fields</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Customer Name</li>
                  <li>• PO Number</li>
                  <li>• Origin & Destination Addresses</li>
                  <li>• Pickup & Delivery Dates</li>
                  <li>• Weight and Commodity</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <span className="text-sm text-muted-foreground">
                Use our template to ensure proper formatting
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
          </CardHeader>
          <CardContent>
            {!uploadedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-lg">Drop the file here...</p>
                ) : (
                  <div>
                    <p className="text-lg mb-2">Drag & drop your order file here</p>
                    <p className="text-muted-foreground mb-4">or click to select a file</p>
                    <Button>Choose File</Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {isValidating && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Validating file contents... This may take a few moments.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Validation Results */}
        {uploadedFile && !isValidating && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Validation Results
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {validRows} Valid
                  </Badge>
                  {validationErrors.length > 0 && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.length} Errors
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {validationErrors.length > 0 ? (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Found {validationErrors.length} validation errors. Please correct these issues before proceeding.
                    </AlertDescription>
                  </Alert>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Error Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationErrors.map((error, index) => (
                        <TableRow key={index}>
                          <TableCell>{error.row}</TableCell>
                          <TableCell>{error.field}</TableCell>
                          <TableCell className="text-destructive">{error.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All {validRows} orders passed validation! Ready to import.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {uploadedFile && !isValidating && (
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={removeFile}>
              Upload Different File
            </Button>
            
            <div className="flex items-center gap-3">
              {validationErrors.length === 0 ? (
                <Button onClick={processUpload}>
                  Import {validRows} Orders
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Fix validation errors to proceed
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TmsLayout>
  );
}