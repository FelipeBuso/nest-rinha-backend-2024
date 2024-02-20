import { timeStamp } from "console";
import { relations } from "drizzle-orm";
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const client = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nome: text("nome"),
  limite: integer("limite"),
  saldo: integer("saldo").default(0),
});

export const clientsRelations = relations(client, ({ many }) => ({
  posts: many(transaction),
}));

export const transaction = pgTable("transacoes", {
  id: serial("id").primaryKey(),
  valor: integer("valor"),
  tipo: text("tipo"),
  descricao: text("descricao"),
  client_id: integer("client_id"),
  realizado_em: timestamp("realizado_em", { withTimezone: true, mode: "date" }),
});

export const transactionRelations = relations(transaction, ({ one }) => ({
  author: one(client, {
    fields: [transaction.client_id],
    references: [client.id],
  }),
}));

export type Client = (typeof client)["$inferSelect"];
export type ClientInsert = (typeof client)["$inferInsert"];
