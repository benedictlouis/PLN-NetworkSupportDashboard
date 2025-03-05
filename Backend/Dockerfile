# Gunakan image Node.js versi LTS
FROM node

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file proyek
COPY . .

# Expose port 3000 (port default backend)
EXPOSE 5433

# Jalankan aplikasi
CMD ["npm", "start"]