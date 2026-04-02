import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

app.get("/api/posts/:slug", async (req, res) => {
  const { slug } = req.params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) return res.status(404).json({ error: "Post não encontrado" });
  res.json(post);
});

app.get("/api/posts/:slug/status", async (req, res) => {
  const { slug } = req.params;
  const { hash } = req.query;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { hash: true },
    });

    if (!post) {
      return res.json({ status: "MISSING" });
    }

    if (post.hash === hash) {
      return res.json({ status: "MATCH" });
    }

    return res.json({ status: "OUTDATED" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar o banco." });
  }
});

app.post("/api/posts", async (req, res) => {
  console.log("📥 Recebi do script:", req.body);
  const { slug, title, content, hash, trail } = req.body;

  try {
    const post = await prisma.post.upsert({
      where: { slug },
      update: { title, content, hash, trail },
      create: { slug, title, content, hash, trail },
    });

    console.log(`✅ Post sincronizado: ${slug}`);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar o post." });
  }
});

prisma
  .$connect()
  .then(() =>
    console.log("🐘 Conexão com o PostgreSQL estabelecida com sucesso!"),
  )
  .catch((err) => console.error("❌ Falha ao conectar no banco:", err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API do corazza.dev rodando em http://localhost:${PORT}`);
});
