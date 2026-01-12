# Use Bun's official image
FROM oven/bun:1 AS base

# Pass build args for environment
ARG NUXT_UMAMI_HOST
ARG NUXT_UMAMI_ID
ARG NUXT_SESSION_PASSWORD
ARG DATABASE_URL
ARG NUXT_OPENROUTER_API_KEY
ARG NUXT_OPENROUTER_MODEL_ID
ARG BLOB_READ_WRITE_TOKEN
ARG NUXT_OAUTH_GITHUB_CLIENT_ID
ARG NUXT_OAUTH_GITHUB_CLIENT_SECRET

# Set environment variables
ENV NUXT_UMAMI_HOST=$NUXT_UMAMI_HOST
ENV NUXT_UMAMI_ID=$NUXT_UMAMI_ID
ENV NUXT_SESSION_PASSWORD=$NUXT_SESSION_PASSWORD
ENV DATABASE_URL=$DATABASE_URL
ENV NUXT_OPENROUTER_API_KEY=$NUXT_OPENROUTER_API_KEY
ENV NUXT_OPENROUTER_MODEL_ID=$NUXT_OPENROUTER_MODEL_ID
ENV BLOB_READ_WRITE_TOKEN=$BLOB_READ_WRITE_TOKEN
ENV NUXT_OAUTH_GITHUB_CLIENT_ID=$NUXT_OAUTH_GITHUB_CLIENT_ID
ENV NUXT_OAUTH_GITHUB_CLIENT_SECRET=$NUXT_OAUTH_GITHUB_CLIENT_SECRET
ENV HOST=0.0.0.0

WORKDIR /app

# Copy dependency manifests
COPY package.json ./

# Install dependencies with Bun
RUN bun i

# Copy source code
COPY . .

# Build the Nuxt app
# Note: Nuxt 3 uses `.output` by default in production builds
RUN bun run build

# Copy only the necessary artifacts
COPY --from=base /app/.output ./.output
COPY --from=base /app/node_modules ./node_modules

EXPOSE 3000

# Start the server
CMD ["bun", ".output/server/index.mjs"]