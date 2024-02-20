import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";

import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../drizzle/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { PoolClient } from "pg";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class ClientService {
  constructor(@Inject("DB") private drizzle: NodePgDatabase<typeof schema>) {}

  async createTransaction(id: number, transactionDto: CreateTransactionDto) {
    return await this.drizzle.transaction(async (tx) => {
      const valor =
        transactionDto.tipo === "d"
          ? transactionDto.valor * -1
          : transactionDto.valor;
      const [client] = await tx
        .select({ saldo: schema.client.saldo, limite: schema.client.limite })
        .from(schema.client)
        .where(eq(schema.client.id, id));
      if (!client) {
        throw new NotFoundException("Cliente não localizado", {
          cause: new Error(),
        });
      }
      if (
        transactionDto.tipo === "d" &&
        client.saldo + valor > client.limite * -1
      ) {
        await tx.rollback();
        throw new UnprocessableEntityException("limite insuficiente", {
          cause: new Error(),
        });
      }
      const updatedClient = await tx
        .update(schema.client)
        .set({ saldo: sql`${schema.client.saldo} + ${valor}` })
        .where(eq(schema.client.id, id))
        .returning({
          saldo: schema.client.saldo,
          limite: schema.client.limite,
        });
      await tx
        .insert(schema.transaction)
        .values({ ...transactionDto, client_id: id });

      return updatedClient;
    });
  }

  async getTransactions(id: number) {
    const client = await this.drizzle.query.client.findFirst({
      where: eq(schema.client.id, id),
      columns: {
        saldo: true,
        limite: true,
      },
    });

    if (!client) {
      throw new NotFoundException("Cliente não localizado", {
        cause: new Error(),
      });
    }
    const returnedTransactions = await this.drizzle.query.transaction.findMany({
      where: eq(schema.transaction.client_id, id),
      columns: {
        valor: true,
        tipo: true,
        descricao: true,
        realizado_em: true,
      },
      limit: 10,
      orderBy: [asc(schema.transaction.realizado_em)],
    });
    return {
      saldo: {
        total: client.saldo,
        data_extrato: new Date(),
        limite: client.limite,
      },
      ultimas_transacoes: returnedTransactions,
    };
  }
}
