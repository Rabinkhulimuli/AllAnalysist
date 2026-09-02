FROM node:24.18.0-alpine

WORKDIR /app

RUN corepack enable

# Install dependencies first (better caching)
COPY package.json pnpm-lock.yaml ./


ENV HUSKY=0

# RUN npm install

RUN pnpm install --frozen-lockfile

# Copy rest of the app
COPY . .

# Build Next.js app
RUN pnpm run build

# Expose port
EXPOSE 3000


CMD ["pnpm", "start"]