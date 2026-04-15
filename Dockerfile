FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=https://arroyoseco.online/api
ENV VITE_GOOGLE_MAPS_API_KEY=AIzaSyDvDwiipSq2-QQTzrzYK9RWmT44CEjFuxA
ARG VITE_APP_VERSION=stable
ENV VITE_APP_VERSION=$VITE_APP_VERSION
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx-proxy.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]