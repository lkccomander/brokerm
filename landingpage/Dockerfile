FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_UMAMI_SRC
ARG VITE_UMAMI_WEBSITE_ID

ENV VITE_UMAMI_SRC=$VITE_UMAMI_SRC
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID

COPY package.json package-lock.json ./

# Use npm install instead of npm ci so Railway can rebuild the lock resolution
# after dependency version alignment changes in package.json.
RUN npm install

COPY . .

RUN npm run build

FROM caddy:2.8-alpine

WORKDIR /app

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist ./dist

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
