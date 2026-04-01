import "dotenv/config";
import { defineConfig } from '@prisma/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("❌ Erro: A variável DATABASE_URL não foi encontrada no ambiente.");
}

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
});
