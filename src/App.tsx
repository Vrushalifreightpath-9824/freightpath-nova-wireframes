
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateOrder from "./pages/orders/CreateOrder";
import OrderDetail from "./pages/orders/OrderDetail";
import BulkUpload from "./pages/orders/BulkUpload";
import ShipmentList from "./pages/shipments/ShipmentList";
import { ShipmentDetailView } from "./pages/shipments/ShipmentDetailView";
import ShipmentPlanning from "./pages/shipments/ShipmentPlanning";
import DragDropPlanning from "./pages/shipments/DragDropPlanning";
import CarrierTendering from "./pages/shipments/CarrierTendering";
import DispatchBoard from "./pages/shipments/DispatchBoard";
import NotFound from "./pages/NotFound";
import { EDILogsView } from "./pages/orders/EDILogsView";
import { OrderTemplatePicker } from "./components/orders/ListTemplates";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/orders/create" element={<CreateOrder />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/orders/bulk-upload" element={<BulkUpload />} />
          <Route path="/orders/edi-logs" element={<EDILogsView />} />
          <Route path="/orders/OrderTemplatePicker" element={<OrderTemplatePicker />} />
          <Route path="/shipments" element={<ShipmentList />} />
          <Route path="/shipments/:id" element={<ShipmentDetailView />} />
          <Route path="/shipments/planning" element={<ShipmentPlanning />} />
          <Route path="/shipments/planning/drag-drop" element={<DragDropPlanning />} />
          <Route path="/shipments/tendering" element={<CarrierTendering />} />
          <Route path="/shipments/dispatch" element={<DispatchBoard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
