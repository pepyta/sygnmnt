FROM node:16

WORKDIR /app
COPY . .
RUN npm ci
RUN apt-get upgrade
RUN apt-get update
RUN apt-get install docker.io -y
RUN apt-get install bash -y

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
