FROM node:18 as builder
WORKDIR /usr/src/app
COPY package.json package-lock.json tsconfig.json next.config.mjs .env ./
COPY prisma ./prisma
COPY public ./public
RUN npm ci
COPY . .
RUN npm run build
RUN npx prisma generate

FROM node:18-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/public ./public
COPY package.json package-lock.json tsconfig.json next.config.mjs .env ./
COPY prisma ./prisma
COPY public ./public
RUN apt-get update -y && apt-get install -y openssl
RUN npm ci --omit=dev
EXPOSE 3000
CMD npm run start:migrate