import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const client = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nome: text("nome"),
  limite: integer("limite"),
  saldo: integer("saldo").default(0),
});

export type Client = (typeof client)["$inferSelect"];
export type ClientInsert = (typeof client)["$inferInsert"];
