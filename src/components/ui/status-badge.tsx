
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type OrderStatus = "created" | "planned" | "tendered" | "dispatched" | "in-transit" | "delivered" | "cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; variant: string; className: string }> = {
  created: {
    label: "Created",
    variant: "secondary",
    className: "bg-status-created text-white"
  },
  planned: {
    label: "Planned", 
    variant: "secondary",
    className: "bg-status-planned text-white"
  },
  tendered: {
    label: "Tendered",
    variant: "secondary", 
    className: "bg-status-tendered text-white"
  },
  dispatched: {
    label: "Dispatched",
    variant: "secondary",
    className: "bg-status-dispatched text-green"
  },
  "in-transit": {
    label: "In Transit",
    variant: "secondary",
    className: "bg-status-in-transit text-white"
  },
  delivered: {
    label: "Delivered",
    variant: "secondary",
    className: "bg-status-delivered text-white"
  },
  cancelled: {
    label: "Cancelled",
    variant: "secondary",
    className: "bg-status-cancelled text-white"
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="secondary"
      className={cn(config.className, "font-medium", className)}
    >
      {config.label}
    </Badge>
  );
}
