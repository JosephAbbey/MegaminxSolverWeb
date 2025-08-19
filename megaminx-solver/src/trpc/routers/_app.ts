import { type } from "arktype"
import { baseProcedure, createTRPCRouter } from "~/trpc/init"
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      type({
        text: "string",
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
})
// export type definition of API
export type AppRouter = typeof appRouter
