
// Sample unplanned orders
export const unplannedOrders = [
  {
    id: "ORD-001",
    customer: "ABC Logistics Inc.",
    poNumber: "PO-2024-001",
    origin: "Los Angeles, CA 90210",
    destination: "Phoenix, AZ 85001",
    pickupDate: "2024-01-15",
    weight: "15,000 lbs",
    pallets: 10,
    equipment: "Dry Van",
    priority: "Standard",
    orderType: "FTL" as const
  },
  {
    id: "ORD-002", 
    customer: "Global Supply Chain",
    origin: "Los Angeles, CA 90028",
    destination: "Las Vegas, NV 89101",
    pickupDate: "2024-01-15",
    weight: "8,500 lbs",
    pallets: 6,
    equipment: "Dry Van",
    priority: "High",
    orderType: "LTL" as const
  },
  {
    id: "ORD-003",
    customer: "TechCorp Solutions",
    origin: "Los Angeles, CA 90045",
    destination: "San Diego, CA 92101",
    pickupDate: "2024-01-16",
    weight: "12,200 lbs",
    pallets: 8,
    equipment: "Dry Van",
    priority: "Standard",
    orderType: "FTL" as const
  },
  {
    id: "ORD-004",
    customer: "Retail Distribution Co",
    origin: "Los Angeles, CA 90015",
    destination: "Bakersfield, CA 93301",
    pickupDate: "2024-01-16",
    weight: "3,200 lbs",
    pallets: 2,
    equipment: "Dry Van",
    priority: "Standard",
    orderType: "LTL" as const
  }
];

export const existingShipments = [
  {
    id: "SHIP-001",
    status: "planned" as const,
    orderCount: 2,
    totalWeight: "23,500 lbs",
    equipment: "Dry Van 53'",
    route: "LA → Vegas → Phoenix",
    driver: "John Smith",
    estimatedMiles: 425,
    orderType: "Mixed" as const, // Mixed FTL/LTL
    orders: ["ORD-001", "ORD-002"]
  },
  {
    id: "SHIP-002", 
    status: "tendered" as const,
    orderCount: 1,
    totalWeight: "15,000 lbs",
    equipment: "Reefer 53'",
    route: "LA → San Francisco",
    driver: "Maria Garcia",
    estimatedMiles: 380,
    orderType: "FTL" as const,
    orders: ["ORD-005"]
  },
  {
    id: "SHIP-003",
    status: "dispatched" as const,
    orderCount: 3,
    totalWeight: "11,700 lbs",
    equipment: "LTL Network",
    route: "LA → Multiple Stops",
    driver: "LTL Carrier",
    estimatedMiles: 250,
    orderType: "LTL" as const,
    orders: ["ORD-006", "ORD-007", "ORD-008"]
  }
];
