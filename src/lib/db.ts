import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

// Polyfill WebSocket for environments where it's not natively available (like Node.js)
if (typeof global.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const prismaClientSingleton = () => {
  const connectionString = (process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED);
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  // Neon adapter with pooling for serverless stability
  const adapter = new PrismaNeon({ 
    connectionString,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10
  });

  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;