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

# Build aplikasi React
RUN npm run build

# Expose port 5173 (port default Vite)
EXPOSE 5173

# Jalankan aplikasi
CMD ["npm", "run", "dev", "--", "--host"]