import { Module } from "@nestjs/common";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { ConfigService } from "@nestjs/config";
import * as schema from "./schema";

@Module({
  providers: [
    {
      provide: "DB",
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>("DATABASE_ENDPOINT");
        const pool = new Pool({
          connectionString,
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ["DB"],
})
export class DrizzleModule {}
