FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

# Production environment
ENV PORT=10000
ENV MONGO_URI=mongodb+srv://tyagirohit698_db_user:8QWBivdLMvO0lR4o@cluster0.wvyrwex.mongodb.net/future-fs?retryWrites=true&w=majority&appName=Cluster0

EXPOSE 10000

CMD ["node", "app.js"]