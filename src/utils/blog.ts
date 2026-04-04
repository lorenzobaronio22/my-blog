type PostWithDate = {
  id: string;
  data: {
    pubDate: Date;
  };
};

export function sortBlogPosts<T extends PostWithDate>(posts: T[]): T[] {
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
