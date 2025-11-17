FROM node:20-alpine

WORKDIR /app

# Ensure we're in development mode to install devDependencies
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies
# Using npm install to ensure all packages are installed
RUN npm install

# Verify next is installed
RUN test -f node_modules/.bin/next || (echo "ERROR: next not found!" && npm list next && exit 1)

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npm run dev"]

