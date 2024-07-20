import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `gain-tracker_${name}`);

// Users Table
export const users = createTable("users", {
  id: serial("id").primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).unique().notNull(), // Clerk user ID
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

// Workouts Table
export const workouts = createTable("workouts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id")
    .references(() => users.clerkUserId)
    .notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  date: timestamp("date", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  exerciseName: varchar("exercise_name", { length: 255 }).notNull(),
  weight: integer("weight").notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
});

// Workouts History Table
export const workoutsHistory = createTable("workouts_history", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id")
    .references(() => workouts.id)
    .notNull(),
  userId: varchar("user_id")
    .references(() => users.clerkUserId) // References Clerk user ID
    .notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  weight: integer("weight").notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Images Table
export const images = createTable("image", {
  // Renamed from 'image' to 'images' for consistency
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  url: varchar("url", { length: 256 }).notNull(),
  userId: varchar("user_id")
    .references(() => users.clerkUserId) // References Clerk user ID
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});
