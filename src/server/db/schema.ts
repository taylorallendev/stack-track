import {
  pgTable,
  text,
  timestamp,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const sessionStatusEnum = pgEnum("session_status", [
  "active",
  "completed",
]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "deposit",
  "withdrawal",
  "winnings",
  "loss",
]);
export const timeOfDayEnum = pgEnum("time_of_day", [
  "morning",
  "afternoon",
  "evening",
  "night",
]);

// Users table
export const users = pgTable("users", {
  clerkId: text("id").primaryKey(),
  username: text("username"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bankroll table
export const bankroll = pgTable("bankroll", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.clerkId)
    .notNull(),
  currentAmount: decimal("current_amount").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Bankroll transactions
export const bankrollTransactions = pgTable("bankroll_transactions", {
  id: text("id").primaryKey(),
  bankrollId: text("bankroll_id")
    .references(() => bankroll.id)
    .notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  notes: text("notes"),
});

// Poker sites
export const pokerSites = pgTable("poker_sites", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url"),
  active: boolean("active").default(true).notNull(),
});

// Game types
export const gameTypes = pgTable("game_types", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
});

// Sessions
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.clerkId)
    .notNull(),
  gameTypeId: text("game_type_id").references(() => gameTypes.id),
  siteId: text("site_id").references(() => pokerSites.id),
  stakes: text("stakes").notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  buyIn: decimal("buy_in").notNull(),
  cashOut: decimal("cash_out"),
  notes: text("notes"),
  status: sessionStatusEnum("status").default("active"),
});

// Session rebuys
export const sessionRebuys = pgTable("session_rebuys", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .references(() => sessions.id)
    .notNull(),
  amount: decimal("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Session notes
export const sessionNotes = pgTable("session_notes", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .references(() => sessions.id)
    .notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Bankroll history
export const bankrollHistory = pgTable("bankroll_history", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.clerkId)
    .notNull(),
  date: timestamp("date").notNull(),
  amount: decimal("amount").notNull(),
  hasDeposit: boolean("has_deposit").default(false).notNull(),
  hasWithdrawal: boolean("has_withdrawal").default(false).notNull(),
  depositAmount: decimal("deposit_amount"),
  withdrawalAmount: decimal("withdrawal_amount"),
});

export type BankrollHistory = typeof bankrollHistory.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  bankroll: one(bankroll),
  sessions: many(sessions),
  bankrollHistory: many(bankrollHistory),
}));

export const bankrollRelations = relations(bankroll, ({ one, many }) => ({
  user: one(users, {
    fields: [bankroll.userId],
    references: [users.clerkId],
  }),
  transactions: many(bankrollTransactions),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.clerkId],
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

export const bankrollTransactionsRelations = relations(
  bankrollTransactions,
  ({ one }) => ({
    bankroll: one(bankroll, {
      fields: [bankrollTransactions.bankrollId],
      references: [bankroll.id],
    }),
  }),
);
