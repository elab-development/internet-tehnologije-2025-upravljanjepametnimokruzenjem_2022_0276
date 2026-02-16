# Build faza
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production faza (Nginx)
FROM nginx:stable-alpine
# Vite build ide u dist folder, CRA ide u build
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Kopiramo nginx config da bi React Router radio (opisano ispod)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]