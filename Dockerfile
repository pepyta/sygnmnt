FROM node:16
ARG DATABASE_URL

WORKDIR /app
COPY . .
RUN npm ci
RUN apt-get upgrade
RUN apt-get update
RUN apt-get install docker.io -y
RUN apt-get install bash -y

ENV NEXT_TELEMETRY_DISABLED 1
ENV DATABASE_URL ${DATABASE_URL}
RUN echo "DATABASE_URL=$DATABASE_URL" >> .env.local
ENV NODE_ENV production

RUN npx prisma generate

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
