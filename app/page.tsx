import { getUserSession } from '@/lib/session'

export default async function Home() {
  const user = await getUserSession()
  return (
      <div>
        <h1>This is a root page . </h1>
        <main className="">{JSON.stringify(user)}</main>
      </div>
  )
}
