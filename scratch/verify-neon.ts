import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env') });

// Using require to ensure env variables are loaded before db.ts initialization
const { prisma } = require('../src/lib/db');

async function main() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
  try {
    const userCount = await prisma.user.count();
    console.log('✅ Connection successful!');
    console.log(`Total users in database: ${userCount}`);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
