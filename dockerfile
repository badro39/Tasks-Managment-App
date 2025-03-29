# Use an official Node.js runtime as base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first (for caching dependencies)
COPY package.json yarn.lock ./

# Enable corepack and install dependencies
RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn install --frozen-lockfile

# Copy the rest of your project files
COPY . .

# Expose the port (change 3000 to your backend port)
EXPOSE 5000

# Start the backend server
CMD ["yarn", "start"]
