import { readFileSync } from 'fs';
import { pool } from '../server/db';
import path from 'path';

async function runMigration() {
  try {
    console.log('Running SQL migration script...');
    
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'drizzle', '0000_create_tables.sql');
    const sql = readFileSync(sqlPath, 'utf-8');
    
    // Execute the SQL statements
    await pool.query(sql);
    
    console.log('SQL migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();