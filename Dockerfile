FROM node as builder
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM alpine as final

RUN apk add --update nodejs

WORKDIR /build

COPY --from=builder /app .

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["node", "build/index.js"]