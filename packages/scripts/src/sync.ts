import fs from 'fs-extra';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import axios from 'axios';

const POSTS_DIR = path.resolve('../../posts');
const API_URL = 'http://localhost:3000/api';

async function syncPosts() {
  console.log('🔄 Iniciando sincronização...');

  const files = await fs.readdir(POSTS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const { data, content } = matter(fileContent);
    const slug = file.replace('.md', '');

    const hash = crypto.createHash('md5').update(content).digest('hex');

    try {
      const { data: statusData } = await axios.get(`${API_URL}/posts/${slug}/status`, {
        params: { hash }
      });

      if (statusData.status === 'MATCH') {
        console.log(`✅ ${slug}: Já está atualizado.`);
        continue;
      }

      console.log(`🚀 ${slug}: Sincronizando (${statusData.status})...`);

      await axios.post(`${API_URL}/posts`, {
        slug,
        title: data.title || slug,
        trail: data.trail || 'Geral',
        content,
        hash
      });

    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Erro ao sincronizar ${slug}:`, error.message);
      } else {
        console.error(`❌ Erro desconhecido ao sincronizar ${slug}:`, error);
      }
    }
  }

  console.log('🏁 Sincronização finalizada!');
}

syncPosts().catch(console.error);