# State 1: build the image
# Use an official Node runtime as a parent image
FROM node:14.18.1-alpine as build_stage
# Set the working directory to /app
WORKDIR '/app'
# Copy package.json to the working directory
COPY package*.json ./
# Install any needed packages specified in package.json
RUN npm install
# Copying the rest of the code to the working directory
COPY ./src ./src
# Build
COPY tsconfig.json ./
RUN npm run build

# Stage 2: running the service
FROM node:14.18.1-alpine as run_stage
# add curl for the health check
RUN apk --no-cache add curl
# Set the working directory to /app
WORKDIR '/app'
COPY --from=build_stage /app/node_modules ./node_modules
COPY --from=build_stage /app/dist ./

# Make port 8080 available to the world outside this container
ENV PORT=8080
EXPOSE ${PORT}

# Run index.js when the container launches
CMD ["node", "index.js"]
