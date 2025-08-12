import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contributors = pgTable("contributors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: varchar("wallet_address").notNull().unique(),
  username: text("username").notNull(),
  totalHours: real("total_hours").default(0),
  totalVnsEarned: real("total_vns_earned").default(0),
  currentGpuPower: real("current_gpu_power").default(0),
  isOnline: boolean("is_online").default(false),
  rank: text("rank").default("Explorer"),
  badges: text("badges").array().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
});

export const gpuSessions = pgTable("gpu_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contributorId: varchar("contributor_id").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  gpuPowerPercent: real("gpu_power_percent").notNull(),
  flopsContributed: real("flops_contributed").default(0),
  vnsEarned: real("vns_earned").default(0),
  isActive: boolean("is_active").default(true),
});

export const networkStats = pgTable("network_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalNodesOnline: integer("total_nodes_online").default(0),
  totalTflops: real("total_tflops").default(0),
  simulationSpeedBoost: real("simulation_speed_boost").default(0),
  activeContributors: integer("active_contributors").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContributorSchema = createInsertSchema(contributors).pick({
  walletAddress: true,
  username: true,
});

export const insertGpuSessionSchema = createInsertSchema(gpuSessions).pick({
  contributorId: true,
  gpuPowerPercent: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Contributor = typeof contributors.$inferSelect;
export type InsertContributor = z.infer<typeof insertContributorSchema>;
export type GpuSession = typeof gpuSessions.$inferSelect;
export type InsertGpuSession = z.infer<typeof insertGpuSessionSchema>;
export type NetworkStats = typeof networkStats.$inferSelect;
