import Link from "next/link";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {

  const posts = await db.query.posts.findMany();

  console.log(posts);

  return (
    <main className="flex flex-wrap">
      <h1>Gain Tacker</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>

            <a>{post.name}</a>

          </li>
        ))}
      </ul>
    </main>
  );
}
