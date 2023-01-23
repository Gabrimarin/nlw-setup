import Fastify from "fastify";
import { prisma } from "./lib/prisma";
import { appRoutes } from "./routes";
import cors from "@fastify/cors";
const app = Fastify();

app.register(appRoutes);
app.register(cors);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server is running on port 3333");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
