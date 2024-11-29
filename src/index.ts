import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

const port = 3000;
const app = new OpenAPIHono();

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "KAI API ANJAY",
  },
});

app.get("/", swaggerUI({ url: "/doc" }));

console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
