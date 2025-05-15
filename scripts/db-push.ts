import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

async function main() {
  console.log("Pushing schema to database...");
  
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  
  // Push schema to database
  await migrate(db, { migrationsFolder: "drizzle" });
  
  console.log("Schema pushed successfully!");
  await pool.end();
}

main().catch((e) => {
  console.error("Error pushing schema:", e);
  process.exit(1);
});