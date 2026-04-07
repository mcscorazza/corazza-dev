FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

RUN npm install

COPY . .

EXPOSE 5173

# O host 0.0.0.0 é vital para o Vite responder fora do container
CMD ["npm", "run", "dev", "--workspace=web", "--", "--host"]