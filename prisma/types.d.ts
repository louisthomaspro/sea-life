declare global {
  namespace PrismaJson {
    type CommonNames = {
      [key: string]: string[] | null
    }
    type Any = any
  }
}
export {}
