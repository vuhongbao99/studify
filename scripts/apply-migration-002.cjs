/**
 * Applies supabase/migrations/002_cards_quiz_fields.sql to your Supabase Postgres.
 *
 * Requires DATABASE_URL (URI) in .env.local — Supabase Dashboard → Project Settings →
 * Database → Connection string → URI (use Session mode or Transaction mode; include password).
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const pg = require("pg");

require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const conn = process.env.DATABASE_URL;
if (!conn || !String(conn).trim()) {
  console.error(`
Missing DATABASE_URL.

1. Supabase Dashboard → Settings → Database
2. Copy "Connection string" → URI (replace [YOUR-PASSWORD])
3. Add to .env.local:

   DATABASE_URL="postgresql://postgres...."

Then run: npm run db:apply-quiz-fields
`);
  process.exit(1);
}

const sqlPath = path.join(__dirname, "..", "supabase", "migrations", "002_cards_quiz_fields.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

async function main() {
  const client = new pg.Client({
    connectionString: conn,
    ssl: /localhost|127\.0\.0\.1/i.test(conn) ? false : { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    console.log("OK: Applied 002_cards_quiz_fields.sql (question_type, options on public.cards)");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
