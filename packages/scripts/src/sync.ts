import fs from "fs-extra";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import axios from "axios";
import glob from "fast-glob";

const currentDir = import.meta.dirname;
const CONTENT_DIR = path.resolve(currentDir, "../../../posts/content");
const API_URL = "http://api.corazza.dev/api";
const ASSETS_DESTINATION = path.resolve(currentDir, '../../../apps/web/public/assets/posts-images');

function sanitizeFilename(filename: string) {
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.\-_]/g, "")
    .toLowerCase();
}

async function processImages(content: string, postDir: string, slug: string) {
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  let newContent = content;

  await fs.ensureDir(ASSETS_DESTINATION);
  imageRegex.lastIndex = 0;

  while ((match = imageRegex.exec(content)) !== null) {
    const [fullMatch, alt, localPath] = match;
    if (!localPath || localPath.startsWith('http') || localPath.startsWith('/assets/')) continue;

    const [purePath, tag] = localPath.split('#');
    const sourcePath = path.resolve(postDir, purePath);
    const fileName = sanitizeFilename(`${slug}-${path.basename(purePath)}`);
    const destPath = path.join(ASSETS_DESTINATION, fileName);

    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, destPath);
      const publicUrl = `/assets/posts-images/${fileName}${tag ? '#' + tag : ''}`;
      newContent = newContent.split(fullMatch).join(`![${alt}](${publicUrl})`);
    }
  }
  return newContent;
}

function parseFolder(name: string) {
  const cleanName = name.replace(".md", "");
  const match = cleanName.match(/^(\d+)_(.*)$/);
  if (!match) return { order: 0, slug: cleanName };
  return {
    order: parseInt(match[1], 10),
    slug: match[2],
  };
}

async function sync() {
  console.log("🚀 Iniciando sincronização estruturada...");

  const files = await glob("*/*/*.md", { cwd: CONTENT_DIR });

  for (const file of files) {
    const parts = file.split("/");
    if (parts.length < 3) continue;

    const trailInfo = parseFolder(parts[0]);
    const lineInfo = parseFolder(parts[1]);
    const postInfo = parseFolder(parts[2]);

    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const postDir = path.dirname(filePath);
    const processedContent = await processImages(content, postDir, postInfo.slug);
    const hash = crypto.createHash("md5").update(processedContent).digest("hex");

    try {
      await axios.post(`${API_URL}/posts`, {
        slug: postInfo.slug,
        order: postInfo.order,
        title: data.title || postInfo.slug,
        summary: data.summary || "",
        content: processedContent,
        hash,
        line: {
          slug: lineInfo.slug,
          order: lineInfo.order,
          title: lineInfo.slug.toUpperCase(),
        },
        trail: {
          slug: trailInfo.slug,
          order: trailInfo.order,
          title: trailInfo.slug.toUpperCase(),
        }
      });
      console.log(`✅ [${trailInfo.slug} > ${lineInfo.slug}] ${postInfo.slug} sincronizado.`);
    } catch (error: any) {
      console.error(`❌ Erro em ${postInfo.slug}:`, error.response?.data || error.message);
    }
  }
}

sync().catch(console.error);