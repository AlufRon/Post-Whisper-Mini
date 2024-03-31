FROM node:21 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=development

RUN npm run build


FROM nginx:latest

COPY --from=builder /app/build /usr/share/nginx/html