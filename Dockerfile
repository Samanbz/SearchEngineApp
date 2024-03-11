FROM node:18-alpine

# Add Environment variable of api url: NEXT_PUBLIC_API_URL=...


WORKDIR /app

COPY package*.json ./

RUN  npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]


