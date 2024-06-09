# Use the official Node.js image as the base image
FROM node:21-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate
# Copy the rest of the application files
COPY . .
# Build TypeScript files
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "run", "start:prod"]