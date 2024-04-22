declare global {
  namespace PrismaJson {
    type CommonNames = {
      [key: string]: string[] | null | undefined
    }
    type GroupName = {
      [key: string]: string | null | undefined
    }
    type Any = any
  }
}
export {}
