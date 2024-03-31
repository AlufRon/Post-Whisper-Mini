# Use an official Node.js runtime as the base image
FROM node:16.14.0

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build

# Make port 3001 available outside the Docker container
EXPOSE 3001

# List the contents of the routes directory
RUN ls -la ./routes

# Run the application when the Docker container starts
CMD [ "node", "dist/server.js" ]
