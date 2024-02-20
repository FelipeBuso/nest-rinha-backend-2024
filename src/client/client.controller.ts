import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Controller("clientes")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post(":id/transacoes")
  async createTransaction(
    @Param("id") id: string,
    @Body() createTransactionDto: CreateTransactionDto
  ) {
    return await this.clientService.createTransaction(
      +id,
      createTransactionDto
    );
  }

  @Get(":id/extrato")
  async findOne(@Param("id") id: string) {
    console.log({ id });
    return await this.clientService.getTransactions(+id);
  }
}
