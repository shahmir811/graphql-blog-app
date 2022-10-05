# Graphql Apollo Server

Building the backend APIs in GraphQL using Apollo Server

## Usage

Create a file named `keys.ts` inside src folder and define:

```sh
export const JSON_SIGNATURE = 'YOUR_SECRET_VALUE';
```

Create a file named `.env` at the root and define database credentials:

```sh
DATABASE_URL = 'DB_CREDENTIALS';
```

Install dependencies

```bash
npm install
```

After that run the following and you will get a GraphQL playground at http://localhost:4000

```bash
npm run start:dev
```

### NPM Packages

- [Apollo Server] - Apollo Server is a community-maintained open-source GraphQL server.
- [Bcrypt] - Used for password increption.
- [DataLoader] - It is a utility used for data fetching to provide a simplified and consistent API over various remote data sources.
- [GraphQL] - The JavaScript reference implementation for GraphQL, a query language for APIs created by Facebook.
- [Nodemon] - Automatically restarting the node application when file changes.
- [Prisma] - Prisma is a database ORM that can be used in any Node.js or TypeScript backend application.
- [TS Node Dev] - It restarts target node process when any of required typescript file changes.
- [TypeScript] - It is a language for application-scale JavaScript
- [Validator] - It validates and sanitizes strings only.

[apollo server]: https://www.npmjs.com/package/apollo-server
[bcrypt]: https://www.npmjs.com/package/bcryptjs
[dataloader]: https://www.npmjs.com/package/dataloader
[graphql]: https://www.npmjs.com/package/graphql
[nodemon]: https://www.npmjs.com/package/nodemon
[prisma]: https://www.npmjs.com/package/prisma
[ts node dev]: https://www.npmjs.com/package/ts-node-dev
[typescript]: https://www.npmjs.com/package/typescript
[validator]: https://www.npmjs.com/package/validator
