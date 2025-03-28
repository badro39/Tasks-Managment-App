# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the port your app runs on (change if needed)
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
