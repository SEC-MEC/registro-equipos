FROM node:18

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 9090

CMD ["npm", "start"]
