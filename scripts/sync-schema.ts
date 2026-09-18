/**
 * One-time table creation for a fresh production database (e.g. right
 * after creating a new Neon/Supabase/Render Postgres instance). Run with:
 *   npm run db:sync
 *
 * This is deliberately separate from the app's own bootstrap - the running
 * app (see src/app.module.ts) never auto-syncs the schema in production,
 * so a stray deploy can't silently alter or drop columns. This script is
 * meant to be run by hand, once, right after provisioning a new database.
 * There are no migrations in this project yet; if the schema changes after
 * this, re-run this script by hand again (safe - TypeORM's synchronize
 * only adds what's missing, it doesn't drop existing data/columns unless
 * a column/table was actually removed from the entities).
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';

async function syncSchema() {
  const databaseUrl = process.env.DATABASE_URL;

  const dataSource = new DataSource({
    type: 'postgres',
    ...(databaseUrl
      ? { url: databaseUrl, ssl: { rejectUnauthorized: false } }
      : {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT ?? 5432),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }),
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
    synchronize: true,
  });

  console.log('Connecting and syncing schema...');
  await dataSource.initialize();
  console.log('Schema synced successfully.');
  await dataSource.destroy();
}

syncSchema().catch((error) => {
  console.error('Failed to sync schema:', error);
  process.exit(1);
});
