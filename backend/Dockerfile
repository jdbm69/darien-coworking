# Dockerfile
# Imagen del backend Node.js para el API de coworking

FROM node:22-alpine
WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm ci

# Copia el código
COPY . .

# Puerto del servicio
EXPOSE 3001

# Comando: corre migraciones y levanta el server
CMD sh -c "npx sequelize-cli db:migrate && node src/server.js"