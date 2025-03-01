import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users_table", {
  id: serial("id").primaryKey(),
  name: text("name"),
  age: integer("age"),
});
