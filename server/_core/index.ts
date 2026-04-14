import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createVeventaContext } from "../utils/context";
import { connectDB } from "../db/connection";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Connect to MongoDB
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  const app = express();
  const server = createServer(app);

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  const corsOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: corsOrigins.length > 0 ? corsOrigins : true,
      credentials: true,
    })
  );

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const hasOAuthConfig = Boolean(process.env.OAUTH_SERVER_URL && process.env.VITE_APP_ID);
  if (hasOAuthConfig) {
    // Lazy-load OAuth wiring only when fully configured.
    const { registerOAuthRoutes } = await import("./oauth");
    registerOAuthRoutes(app);
  } else {
    console.log("[OAuth] Disabled: set OAUTH_SERVER_URL and VITE_APP_ID to enable /api/oauth/callback");
  }

  // tRPC API with custom MongoDB context
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: createVeventaContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const envPort = Number(process.env.PORT);
  const useEnvPort = Number.isFinite(envPort) && envPort > 0;
  const port = useEnvPort ? envPort : await findAvailablePort();
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
