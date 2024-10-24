# Use an official Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /src/app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Build the application
COPY . .
RUN npm run build

# Set the environment to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
