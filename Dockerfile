FROM node:16
ARG DATABASE_URL
ARG JWT_SECRET_KEY

WORKDIR /app
COPY . .
RUN npm ci
RUN apt-get upgrade
RUN apt-get update
RUN apt-get install docker.io -y
RUN apt-get install bash -y

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

ENV DATABASE_URL ${DATABASE_URL}
ENV JWT_SECRET_KEY ${JWT_SECRET_KEY}

RUN echo "JWT_SECRET_KEY=$JWT_SECRET_KEY" >> .env.local
RUN echo "DATABASE_URL=$DATABASE_URL" >> .env.local

RUN npx prisma generate

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
