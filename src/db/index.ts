import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * Two drivers, chosen by the host in DATABASE_URL.
 *
 * `drizzle-orm/neon-http` speaks Neon's HTTP protocol over `fetch`. It cannot
 * talk to an ordinary Postgres server on localhost — the failure is
 * `TypeError: fetch failed`, surfacing as a 500 from any route that touches the
 * database rather than as a connection error at startup.
 *
 * That is why `.env.local` carried a second, Neon `DATABASE_URL` after the local
 * one: with a single driver, pointing at localhost broke the whole app, so the
 * Neon URL was the only way it ran. dotenv keeps the last value for a repeated
 * key, so the workaround silently sent every "local" run to the production
 * database from May 2026 until 2026-09-07 — found when test bookings appeared
 * in production.
 *
 * Removing the duplicate is therefore not enough on its own. Local development
 * needs a driver that speaks the Postgres wire protocol, which `pg` already is
 * and already ships as a dependency.
 */
const url = process.env.DATABASE_URL!;
const isNeon = new URL(url).hostname.endsWith('.neon.tech');

/**
 * The exported type is pinned to the Neon driver rather than left as a union of
 * the two.
 *
 * A union collapses the overloads on builder methods — `.returning()` in
 * particular resolves to its zero-argument form, so three call sites that pass
 * a column selection stop typechecking. The two drivers expose the same query
 * surface for everything this app does; they differ only in transport. Pinning
 * to the shape production actually runs keeps the types honest about the
 * deployed target while letting development use the wire-protocol driver.
 */
type NeonDb = ReturnType<typeof drizzleNeon<typeof schema>>;

export const db: NeonDb = (
  isNeon
    ? drizzleNeon(neon(url), { schema })
    : drizzlePg(new Pool({ connectionString: url }), { schema })
) as unknown as NeonDb;

export type DB = typeof db;
