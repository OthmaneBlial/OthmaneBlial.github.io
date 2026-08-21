import { createAtlas } from "@runtime-atlas/sdk";

const atlas = createAtlas({
  serviceName: "orders-api",
  collectorUrl: process.env.ATLAS_COLLECTOR_URL ?? "http://localhost:4319",
  headers: process.env.ATLAS_INGEST_TOKEN
    ? { authorization: `Bearer ${process.env.ATLAS_INGEST_TOKEN}` }
    : undefined,
  onError: (error) =>
    console.warn("Atlas collector unavailable", error.message),
});

export const ordersDatabase = atlas.database(
  {
    id: "db.orders-example",
    label: "Orders database",
    description: "Persists the customer order.",
    meta: { engine: "PostgreSQL" },
  },
  async () => ({ id: `ord_${Date.now()}` }),
);

export const paymentApi = atlas.external(
  {
    id: "external.payments-example",
    label: "Payments API",
    description: "Authorizes payment with an external provider.",
    meta: { provider: "Stripe" },
  },
  async () => ({ authorized: true }),
);

export const createOrder = atlas.service(
  {
    id: "service.orders-example",
    label: "Order service",
    description: "Coordinates payment and persistence.",
  },
  async () => {
    const payment = await paymentApi();
    const order = await ordersDatabase();
    return { payment, order };
  },
);

export const createOrderRoute = atlas.route(
  {
    id: "route.orders-example",
    label: "POST /orders",
    meta: { method: "POST", path: "/orders" },
  },
  async () => createOrder(),
);

// Call this from the real framework route handler.
export const handleCreateOrder = () =>
  atlas.trace(
    { method: "POST", path: "/orders", status: 201 },
    createOrderRoute,
  );
