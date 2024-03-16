FROM node:18 as builder
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./prisma", "./"]
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g prisma
RUN prisma generate

FROM node:18-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next ./.next
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./prisma", "./"]
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
RUN apt-get update -y && apt-get install -y openssl
RUN npm ci --omit=dev
EXPOSE 3000
CMD npm start