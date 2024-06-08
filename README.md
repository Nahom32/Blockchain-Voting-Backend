# Blockchain-Voting-Backend
Blockchain Voting Backend

Note on the express-backend development

## Flow

```bash
cd express-backend
npm install
```

## Prisma Notes

1 Define your models to the schema.prisma file

2 Run a migration to create database tables with Prisma Migrate
```bash
npx prisma migrate dev --name init
```
## Blockchain Integration Notes
1. create a folder called environment.ts
2. add your smart contract address and abi inside the environment ts
Here is an instance of a snippet of what your environment.ts looks like
```typescript
export const environment = {
    contractAddress: "your contract address",
    contractAbi: [
        {
            "example": "data"
        }
    ]
}
```






