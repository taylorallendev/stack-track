import { pgTable, serial, text, integer, timestamp, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const sessionStatusEnum = pgEnum("session_status", ["active", "completed"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["deposit", "withdrawal", "winnings", "loss"]);
export const timeOfDayEnum = pgEnum("time_of_day", ["morning", "afternoon", "evening", "night"]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bankroll table
export const bankroll = pgTable("bankroll", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currentAmount: decimal("current_amount").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Bankroll transactions
export const bankrollTransactions = pgTable("bankroll_transactions", {
  id: serial("id").primaryKey(),
  bankrollId: integer("bankroll_id").references(() => bankroll.id).notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  notes: text("notes"),
});

// Poker sites
export const pokerSites = pgTable("poker_sites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url"),
  active: boolean("active").default(true).notNull(),
});

// Game types
export const gameTypes = pgTable("game_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
});

// Sessions
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  gameTypeId: integer("game_type_id").references(() => gameTypes.id),
  siteId: integer("site_id").references(() => pokerSites.id),
  stakes: text("stakes").notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  buyIn: decimal("buy_in").notNull(),
  cashOut: decimal("cash_out"),
  notes: text("notes"),
  status: sessionStatusEnum("status").default("active").notNull(),
});

// Session rebuys
export const sessionRebuys = pgTable("session_rebuys", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  amount: decimal("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Session notes
export const sessionNotes = pgTable("session_notes", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Bankroll history
export const bankrollHistory = pgTable("bankroll_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  amount: decimal("amount").notNull(),
  hasDeposit: boolean("has_deposit").default(false).notNull(),
  hasWithdrawal: boolean("has_withdrawal").default(false).notNull(),
  depositAmount: decimal("deposit_amount"),
  withdrawalAmount: decimal("withdrawal_amount"),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  bankroll: one(bankroll),
  sessions: many(sessions),
  bankrollHistory: many(bankrollHistory),
}));

export const bankrollRelations = relations(bankroll, ({ one, many }) => ({
  user: one(users, {
    fields: [bankroll.userId],
    references: [users.id],
  }),
  transactions: many(bankrollTransactions),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  site: one(pokerSites, {
    fields: [sessions.siteId],
    references: [pokerSites.id],
  }),
  gameType: one(gameTypes, {
    fields: [sessions.gameTypeId],
    references: [gameTypes.id],
  }),
  rebuys: many(sessionRebuys),
  notes: many(sessionNotes),
}));
