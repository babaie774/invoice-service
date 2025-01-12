# Use the official Node.js 16 image as the base
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy only the root package.json and package-lock.json to the working directory
COPY ../../package*.json ./

# Install dependencies
RUN npm install

# Copy only the specific service's code
COPY . ./

# Build the service
RUN npm run build

# Start the service
CMD ["npm", "run", "start:prod"]
