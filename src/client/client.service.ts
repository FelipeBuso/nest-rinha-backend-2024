import { Inject, Injectable } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { PoolClient } from "pg";

@Injectable()
export class ClientService {
  constructor(@Inject("DB") private drizzle: NodePgDatabase<typeof schema>) {}

  create(createClientDto: CreateClientDto) {
    return "This action adds a new client";
  }

  findAll() {
    return this.drizzle.query.client.findMany();
  }

  async findOne(id: number) {
    return await this.drizzle.query.client.findFirst({
      where: eq(schema.client.id, id),
    });
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
