FROM node:20-alpine

WORKDIR /app

# Ensure we're in development mode to install devDependencies
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies
# Using npm install to ensure all packages are installed
RUN npm install

# Verify ts-node-dev is installed
RUN test -f node_modules/.bin/ts-node-dev || (echo "ERROR: ts-node-dev not found!" && npm list ts-node-dev && exit 1)

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start the application
CMD ["sh", "-c", "npm run dev"]

