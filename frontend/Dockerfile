FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
