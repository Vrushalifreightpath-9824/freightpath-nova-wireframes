import { TmsLayout } from "@/components/TmsLayout";
import { OrderList } from "@/components/orders/OrderList";

const Index = () => {
  return (
    <TmsLayout 
      title="Order Management"
      breadcrumbs={[
        { label: "Orders" }
      ]}
    >
      <OrderList />
    </TmsLayout>
  );
};

export default Index;
