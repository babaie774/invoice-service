# Step 1: Use Node.js base image
FROM node:16

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application
RUN npm run build

# Step 7: Expose the application port
EXPOSE 3000

# Step 8: Define the command to run the app
CMD ["npm", "run", "start:prod"]
