FROM node:16-alpine AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
RUN apk add --update --no-cache openssl1.1-compat
# Install app dependencies
RUN npm install

COPY . .


#RUN npm run prisma:generate

RUN npm run build

FROM node:16-alpine
RUN apk add --update --no-cache openssl1.1-compat

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3151
CMD [ "npm", "run", "start:prod" ]
