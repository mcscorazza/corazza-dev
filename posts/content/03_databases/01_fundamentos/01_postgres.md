---
title: PostgreSQL
trail: Databases
line: Fundamentos
summary: 'Comandos básicos para PostgrSQL.'
---

# Estação 01
## Geral

---

| RESUMO            |                               |
| :---------------- | ----------------------------: |
| Palavras:         |                        ~1.400 |
| Tempo de leitura: |                         7 min |
| Linha             |                01 Fundamentos |
| Progresso:        | `5.0% [■-------------------]` |

### Instalação PostgreSQL
Baixar o binário em: 

https://www.enterprisedb.com/download-postgresql-binaries

- Descompactar ZIP na pasta `C:\src\pgsql\`
- Incluir no PATH: `C:\src\pgsql\bin\`

Comandos do terminal para criar o `data`:
```bash
  initdb -U postgres -A trust -E UTF8 -D "C:\etc\db\data"
```

Comando para START/STOP do psql:
```bash
  // START
  pg_ctl -D "C:\etc\db\data" -l "C:\etc\db\arquivolog" start

  // STOP
  pg_ctl -D "C:\etc\db\data" -l "C:\etc\db\arquivolog" stop

  // RESTART
  pg_ctl -D "C:\etc\db\data" -l "C:\etc\db\arquivolog" restart
```

Conexão com o banco:
```bash
  psql -U postgres
```

Comandos para uso no psql:

- \l - Listar os bancos de dados
- \dt - Listar as tabelas de um banco
- \c - conectar a um banco de dados

Criar Banco de Dados:

```sql
CREATE DATABASE nome_do_banco;
```

Criar tabela:

```sql
CREATE TABLE users(
id SERIAL PRIMARY KEY,
nome VARCHAR(50),
idade INT
);
```

Comando para formatar jsonb no SELECT:
```bash
  jsonb_pretty(data)

  select id, jsonb_pretty(data) from displacement_locations where "displacementId" = '4c37bdf1-e264-47af-9a8e-eb1659b60416'
```

