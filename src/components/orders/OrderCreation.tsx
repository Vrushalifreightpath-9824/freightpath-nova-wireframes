import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, MapPin, Package, Truck, FileUp, Plus, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { CommodityFormSection } from "./CommodityFormSection";

interface OrderFormData {
  // Order Type
  orderType: "FTL" | "LTL";
  
  // Customer Info
  customerName: string;
  poNumber: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  
  // Origin & Destination
  originAddress: string;
  originCity: string;
  originState: string;
  originZip: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationZip: string;
  
  // Freight Details
  pallets: number;
  weight: number;
  commodity: string;
  dimensions: string;
  
  // Equipment
  equipmentType: string;
  
  // Pickup/Delivery Windows
  pickupDate: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  deliveryDate: string;
  deliveryTimeStart: string;
  deliveryTimeEnd: string;
  
  // Notes
  specialInstructions: string;
  internalNotes: string;
}

const accessorialOptions = [
  "Liftgate - Origin",
  "Liftgate - Destination", 
  "Lumper Service",
  "Inside Delivery",
  "Appointment Required",
  "Residential Delivery",
  "Limited Access",
  "Trade Show",
  "Detention",
  "Storage"
];

export function OrderCreation() {
  const [selectedAccessorials, setSelectedAccessorials] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [orderType, setOrderType] = useState<"FTL" | "LTL">("FTL");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<OrderFormData>();

  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAccessorial = (accessorial: string) => {
    setSelectedAccessorials(prev => 
      prev.includes(accessorial)
        ? prev.filter(a => a !== accessorial)
        : [...prev, accessorial]
    );
  };

  const onSubmit = (data: OrderFormData) => {
    console.log("Order Data:", { ...data, orderType });
    console.log("Accessorials:", selectedAccessorials);
    console.log("Files:", uploadedFiles);
    // Handle form submission
  };
 
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create New Order</h1>
          <p className="text-muted-foreground">Enter order details and shipment information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Order Type Selection - Prominent placement at top */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Type
              </CardTitle>
              <CardDescription>
                Select whether this is a Full Truckload (FTL) or Less-than-Truckload (LTL) shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={orderType}
                onValueChange={(value: "FTL" | "LTL") => setOrderType(value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FTL" id="ftl" />
                  <Label htmlFor="ftl" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      FTL
                    </Badge>
                    <span>Full Truckload - Dedicated truck for your shipment</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="LTL" id="ltl" />
                  <Label htmlFor="ltl" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      LTL
                    </Badge>
                    <span>Less-than-Truckload - Shared truck space</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Tabs defaultValue="customer" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <div className="w-2 h-2 bg-current rounded-full" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="freight" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Freight
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Equipment
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Details
              </TabsTrigger>
            </TabsList>

            {/* Customer Information */}
            <TabsContent value="customer">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        {...register("customerName", { required: "Customer name is required" })}
                        placeholder="Enter customer name"
                      />
                      {errors.customerName && (
                        <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="poNumber">PO Number *</Label>
                      <Input
                        id="poNumber"
                        {...register("poNumber", { required: "PO number is required" })}
                        placeholder="Enter PO number"
                      />
                      {errors.poNumber && (
                        <p className="text-sm text-destructive mt-1">{errors.poNumber.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        {...register("contactName")}
                        placeholder="Contact person"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        {...register("contactPhone")}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        {...register("contactEmail")}
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Origin & Destination */}
            <TabsContent value="addresses">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      Origin Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="originAddress">Street Address *</Label>
                      <Input
                        id="originAddress"
                        {...register("originAddress", { required: "Origin address is required" })}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="originCity">City *</Label>
                        <Input
                          id="originCity"
                          {...register("originCity", { required: "City is required" })}
                          placeholder="Los Angeles"
                        />
                      </div>
                      <div>
                        <Label htmlFor="originState">State *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            {/* Add more states */}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <Label htmlFor="originZip">ZIP Code *</Label>
                      <Input
                        id="originZip"
                        {...register("originZip", { required: "ZIP code is required" })}
                        placeholder="90210"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      Destination Address
                      {orderType === "LTL" && (
                        <Badge variant="secondary" className="ml-2">
                          Multiple stops supported
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="destinationAddress">Street Address *</Label>
                      <Input
                        id="destinationAddress"
                        {...register("destinationAddress", { required: "Destination address is required" })}
                        placeholder="456 Oak Avenue"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="destinationCity">City *</Label>
                        <Input
                          id="destinationCity"
                          {...register("destinationCity", { required: "City is required" })}
                          placeholder="Phoenix"
                        />
                      </div>
                      <div>
                        <Label htmlFor="destinationState">State *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            {/* Add more states */}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <Label htmlFor="destinationZip">ZIP Code *</Label>
                      <Input
                        id="destinationZip"
                        {...register("destinationZip", { required: "ZIP code is required" })}
                        placeholder="85001"
                      />
                    </div>
                    
                    {orderType === "LTL" && (
                      <div className="pt-4 border-t">
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Additional Stop
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          LTL orders can have multiple delivery locations
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Freight Details */}
            <TabsContent value="freight">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Freight Details
                    <Badge variant={orderType === "FTL" ? "default" : "secondary"}>
                      {orderType}
                    </Badge>
                  </CardTitle>
                  {orderType === "LTL" && (
                    <CardDescription>
                      For LTL shipments, specify freight class and handling requirements
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <CommodityFormSection/>
                  
                  {orderType === "LTL" && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label htmlFor="freightClass">Freight Class</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50">Class 50</SelectItem>
                            <SelectItem value="55">Class 55</SelectItem>
                            <SelectItem value="60">Class 60</SelectItem>
                            <SelectItem value="65">Class 65</SelectItem>
                            <SelectItem value="70">Class 70</SelectItem>
                            <SelectItem value="77.5">Class 77.5</SelectItem>
                            <SelectItem value="85">Class 85</SelectItem>
                            <SelectItem value="92.5">Class 92.5</SelectItem>
                            <SelectItem value="100">Class 100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="stackable">Stackable</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Accessorials</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {accessorialOptions.map((accessorial) => (
                        <div key={accessorial} className="flex items-center space-x-2">
                          <Checkbox
                            id={accessorial}
                            checked={selectedAccessorials.includes(accessorial)}
                            onCheckedChange={() => toggleAccessorial(accessorial)}
                          />
                          <Label htmlFor={accessorial} className="text-sm font-normal">
                            {accessorial}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {selectedAccessorials.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedAccessorials.map((accessorial) => (
                          <Badge key={accessorial} variant="secondary" className="flex items-center gap-1">
                            {accessorial}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => toggleAccessorial(accessorial)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Equipment Type */}
            <TabsContent value="equipment">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Requirements</CardTitle>
                  {orderType === "FTL" && (
                    <CardDescription>
                      FTL orders require dedicated equipment
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="equipmentType">Equipment Type *</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select equipment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dry-van">Dry Van (53')</SelectItem>
                        <SelectItem value="reefer">Refrigerated (53')</SelectItem>
                        <SelectItem value="flatbed">Flatbed (48')</SelectItem>
                        <SelectItem value="step-deck">Step Deck</SelectItem>
                        <SelectItem value="box-truck">Box Truck</SelectItem>
                        {orderType === "LTL" && (
                          <SelectItem value="ltl">LTL Carrier Network</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pickup/Delivery Schedule */}
            <TabsContent value="schedule">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pickup Window</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="pickupDate">Pickup Date *</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        {...register("pickupDate", { required: "Pickup date is required" })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pickupTimeStart">Start Time</Label>
                        <Input
                          id="pickupTimeStart"
                          type="time"
                          {...register("pickupTimeStart")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickupTimeEnd">End Time</Label>
                        <Input
                          id="pickupTimeEnd"
                          type="time"
                          {...register("pickupTimeEnd")}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Window</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="deliveryDate">Delivery Date *</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        {...register("deliveryDate", { required: "Delivery date is required" })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryTimeStart">Start Time</Label>
                        <Input
                          id="deliveryTimeStart"
                          type="time"
                          {...register("deliveryTimeStart")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryTimeEnd">End Time</Label>
                        <Input
                          id="deliveryTimeEnd"
                          type="time"
                          {...register("deliveryTimeEnd")}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Additional Details */}
            <TabsContent value="details">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notes & Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <Textarea
                        id="specialInstructions"
                        {...register("specialInstructions")}
                        placeholder="Enter any special handling instructions..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="internalNotes">Internal Notes</Label>
                      <Textarea
                        id="internalNotes"
                        {...register("internalNotes")}
                        placeholder="Internal notes for dispatch team..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>File Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      {isDragActive ? (
                        <p>Drop the files here...</p>
                      ) : (
                        <div>
                          <p>Drag & drop files here, or click to select</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Supports PDF, DOC, DOCX, and images
                          </p>
                        </div>
                      )}
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label>Uploaded Files ({uploadedFiles.length})</Label>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline">
                Save as Template
              </Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">
                Create {orderType} Order
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
