FROM node:18 as builder
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]
RUN npm ci --omit=dev
CMD npm start