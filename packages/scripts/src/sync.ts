import fs from "fs-extra";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import axios from "axios";
import glob from "fast-glob";

const POSTS_DIR = path.resolve("../../posts");
const API_URL = "http://localhost:3000/api";
const ASSETS_DESTINATION = path.resolve(
  import.meta.dirname,
  '../../../apps/web/public/assets/posts-images'
);

async function syncPosts() {
  console.log("🔄 Iniciando sincronização organizada...");

  const files = await glob("**/*.md", { cwd: POSTS_DIR });

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const postDir = path.dirname(filePath);
    const fileContent = await fs.readFile(filePath, "utf-8");

    const { data, content } = matter(fileContent);
    const slug = path.basename(file, ".md");

    const processedContent = await processImages(content, postDir, slug);

    const parts = file.split("/");
    const trail = parts.length > 1 ? parts[0] : data.trail || "Geral";
    const line = parts.length > 2 ? parts[1] : data.line || "Default";

    const hash = crypto.createHash("md5").update(processedContent).digest("hex");

    try {
      await axios.post(`${API_URL}/posts`, {
        slug,
        title: data.title || slug,
        summary: data.summary || "",
        content: processedContent,
        hash,
        trail,
        line,
      });
      console.log(`✅ ${slug} sincronizado.`);
    } catch (error: any) {
      console.error(`❌ Erro em ${slug}:`, error.response?.data || error.message);
    }
  }
  console.log("🏁 Sincronização finalizada!");
}

async function processImages(content: string, postDir: string, slug: string) {
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  let newContent = content;

  await fs.ensureDir(ASSETS_DESTINATION);
  imageRegex.lastIndex = 0; 

while ((match = imageRegex.exec(content)) !== null) {
  const [fullMatch, alt, localPath] = match;

  if (!localPath || localPath.startsWith('http')) continue;

  const [purePath, tag] = localPath.split('#');

  if(!purePath) continue;

  if (purePath.startsWith('/assets/')) continue;

  const sourcePath = path.resolve(postDir, purePath);
  const rawFileName = path.basename(purePath);
  
  const sanitizedName = sanitizeFilename(`${slug}-${rawFileName}`);
  const fileName = sanitizedName;
  const destPath = path.join(ASSETS_DESTINATION, fileName);

  console.log(`🔍 Tentando processar: ${rawFileName}`);

  if (await fs.pathExists(sourcePath)) {
    await fs.copy(sourcePath, destPath);
    
    const publicUrl = `/assets/posts-images/${fileName}${tag ? '#' + tag : ''}`;
    const newImageMarkdown = `![${alt}](${publicUrl})`;
    
    newContent = newContent.split(fullMatch).join(newImageMarkdown);
    
    console.log(`✅ SUCESSO: [${rawFileName}] -> [${fileName}${tag ? '#' + tag : ''}]`);
  } else {
    console.error(`❌ ERRO: Arquivo não encontrado em: ${sourcePath}`);
  }
}

  return newContent;
}

function sanitizeFilename(filename: string) {
  const clean = filename
    .normalize("NFD")              // Decompõe acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .replace(/\s+/g, "-")          // Espaço -> Hífen
    .replace(/[^a-zA-Z0-9.\-_]/g, "") // Remove lixo
    .toLowerCase();
  
  console.log(`   DEBUG Sanitização: ${filename} -> ${clean}`);
  return clean;
}

syncPosts().catch(console.error);
