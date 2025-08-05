import { TmsLayout } from "@/components/TmsLayout";
import { OrderCreation } from "@/components/orders/OrderCreation";

export default function CreateOrder() {
  return (
    <TmsLayout 
      // title="Create Order"
      breadcrumbs={[
        { label: "Orders", href: "/" },
        { label: "Create Order" }
      ]}
    >
      <OrderCreation />
    </TmsLayout>
  );
}