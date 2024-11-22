declare module '@prisma/client' {
    import { PrismaClient as ImportedPrismaClient } from '.prisma/client'
    export const PrismaClient: typeof ImportedPrismaClient
    export * from '.prisma/client'
  }
  
  declare module '.prisma/client' {
    import { PrismaClient as ImportedPrismaClient } from '../node_modules/.prisma/client'
    export const PrismaClient: typeof ImportedPrismaClient
    export * from '../node_modules/.prisma/client'
  }