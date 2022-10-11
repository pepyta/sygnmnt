# SYGNMNT

The SYGNMNT project is an assignment management website, where the teachers can create coding tasks for students with automated tests.

The project is part of the Tools of Software Projects (IP-18KVPRJG) assignment.

## Prerequisites
- [NodeJS LTS](https://nodejs.org/en/)
- MySQL Server (e.g: XAMPP)

## Getting Started
### Install dependencies
You can install the required dependencies by running the following command:
```
npm install
```

### Set up environmental file
You will need to create a `.env` file to use this project.

First, you will need to set up the databse connection url like this:
```dotenv
DATABASE_URL="mysql://username:password@host:port/database"
```

If you've installed XAMPP, then you can use the root username like this: `mysql://root:@localhost:3306/sygnmnt`

Generate a random string as your JWT secret key. This will be used to handle 
```dotenv
JWT_SECRET_KEY="supersecret123"
```

### Generate database
After you've set up the `.env` file, you can generate the databse by running the following command:
```
npx prisma db push
```

## Usage
### Running in development mode
Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Building
You can build your project by running the following command:
```
npm run build
```

This will create a `.next` in the project folder. This will contain every asset that you will need to run the application.

## Hosting
After you've built the project, you can start the server in production mode via this command:
```
npm run start
```

This will start the server on the `3000` port, which you can edit by starting the project like this:

```
npx next start -p 3001
```