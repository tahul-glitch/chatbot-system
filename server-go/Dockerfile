# pakai node resmi
FROM node:18

# buat folder kerja
WORKDIR /app

# copy file package
COPY package*.json ./

# install dependency
RUN npm install

# copy semua file
COPY . .

# buka port
EXPOSE 3000

# jalankan server
CMD ["node", "index.js"]