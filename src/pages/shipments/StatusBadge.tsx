import { Badge } from "@/components/ui/badge";

type OrderStatus = "created" | "planned" | "tendered" | "in-transit" | "delivered" | "cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusLabels: Record<OrderStatus, string> = {
  created: "Created",
  planned: "Planned",
  tendered: "Tendered",
  "in-transit": "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={status as any}>
      {statusLabels[status]}
    </Badge>
  );
}