FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Serve the built app with Vite preview
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]