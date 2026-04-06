import fs from "fs-extra";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import axios from "axios";
import glob from "fast-glob";

const POSTS_DIR = path.resolve("../../posts");
const API_URL = "http://localhost:3000/api";

async function syncPosts() {
  console.log("🔄 Iniciando sincronização organizada...");

  const files = await glob("**/*.md", { cwd: POSTS_DIR });

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = await fs.readFile(filePath, "utf-8");

    const { data, content } = matter(fileContent);
    const slug = path.basename(file, ".md");

    const parts = file.split("/");
    const trail = parts.length > 1 ? parts[0] : data.trail || "Geral";
    const line = parts.length > 2 ? parts[1] : data.line || "Default";

    const hash = crypto.createHash("md5").update(content).digest("hex");

    try {
      await axios.post(`${API_URL}/posts`, {
        slug,
        title: data.title || slug,
        content,
        hash,
        trail,
        line,
      });
      console.log(
        `✅ ${slug} sincronizado na trilha [${trail}] e linha [${line}]`,
      );
    } catch (error: any) {
      console.error(
        `❌ Erro em ${slug}:`,
        error.response?.data || error.message,
      );
    }
  }
  console.log("🏁 Sincronização finalizada!");
}

syncPosts().catch(console.error);
