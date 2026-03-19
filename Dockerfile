# STAGE 1: Build the React Vite App
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code and build the project
COPY . .
# Setting VITE_API_URL so the build has the correct proxy path
ENV VITE_API_URL=https://api.arroyoseco.online
RUN npm run build

# STAGE 2: Serve with NGINX (Internal Docker NGINX)
FROM nginx:alpine
# Copy the compiled 'dist' folder from STAGE 1 into NGINX's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 3000 to the host (Native NGINX will proxy to this port)
# We change the default NGINX port inside the container to avoid colliding with Native NGINX
RUN sed -i 's/listen  *80;/listen 3000;/g' /etc/nginx/conf.d/default.conf
EXPOSE 3000

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
