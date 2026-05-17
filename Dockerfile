# Pasul 1: Compilarea codului Node.js (Am trecut la Node 20)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Pasul 2: Pornirea serverului web Nginx pentru a servi codul de mai sus
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]