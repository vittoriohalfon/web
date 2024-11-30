# Base image
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Copy the Prisma schema and migrations directory
COPY prisma ./prisma/

# Install dependencies (including development dependencies)
RUN npm install --production=false

# Copy the rest of the project files
COPY . .

# Generate Prisma client and build the Next.js application
RUN npm run build

# Use a lightweight production image for deployment
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built application and dependencies from the builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
