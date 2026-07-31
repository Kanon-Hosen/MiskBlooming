require('dotenv').config();
import { prisma } from "../src/lib/db";
import { redis } from "../src/lib/redis";

async function diagnostic() {
  console.log("--- Diagnostic Start ---");
  
  try {
    console.log("Testing Redis connection...");
    const testKey = "test_connection_" + Date.now();
    await redis.set(testKey, "working");
    const result = await redis.get(testKey);
    console.log("Redis Result:", result);
    if (result === "working") {
      console.log("✅ Redis connection successful.");
    } else {
      console.log("❌ Redis connection failed: Unexpected result.");
    }
  } catch (err: any) {
    console.log("❌ Redis connection error:", err.message);
  }

  try {
    console.log("Testing Prisma connection...");
    const count = await prisma.storeSettings.count();
    console.log("StoreSettings count:", count);
    console.log("✅ Prisma connection successful.");
    
    if (count > 0) {
      const settings = await prisma.storeSettings.findFirst();
      console.log("StoreSettings found:", !!settings);
    } else {
      console.log("⚠️ No store settings found in DB.");
    }
  } catch (err: any) {
    console.log("❌ Prisma connection error:", err.message);
  }

  console.log("--- Diagnostic End ---");
}

diagnostic().catch(console.error).finally(() => prisma.$disconnect());
