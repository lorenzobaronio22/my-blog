import { getCollection } from "astro:content";

type PostWithDate = {
  id: string;
  data: {
    pubDate: Date;
  };
};

export function sortPosts<T extends PostWithDate>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    const byDate = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    if (byDate !== 0) {
      return byDate;
    }
    return a.id.localeCompare(b.id);
  });
}

export function mapPostsToStaticPaths<T extends { id: string }>(posts: T[]) {
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

type PostWithTags = PostWithDate & {
  data: {
    pubDate: Date;
    tags?: string[];
  };
};

export function getRelatedPostsByTags<T extends PostWithTags>(
  currentPost: T,
  posts: T[],
  limit = 3,
): T[] {
  if (limit <= 0) {
    return [];
  }

  const currentTags = currentPost.data.tags ?? [];
  if (currentTags.length === 0) {
    return [];
  }

  return sortPosts(posts)
    .filter((post) => post.id !== currentPost.id)
    .filter((post) => {
      const postTags = post.data.tags ?? [];
      return postTags.some((tag) => currentTags.includes(tag));
    })
    .slice(0, limit);
}

export async function getAllPosts() {
  return sortPosts(await getCollection("posts"));
}
