FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Start the compiled app
CMD ["node", "dist/index.js"]