FROM node:18-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o código fonte
COPY . .

# Expõe a porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "server.js"]
