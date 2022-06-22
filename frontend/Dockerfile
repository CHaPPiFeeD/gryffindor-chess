FROM node as builder
WORKDIR /app
COPY package*.json .
RUN npm install --only=prod
COPY . /app
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]