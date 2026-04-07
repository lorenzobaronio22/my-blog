export const SITE_TITLE = 'Code & Cables By Lorenzo';
export const SITE_DESCRIPTION =
  'Notes, tutorials, and insights on software development and home lab projects.';

export const BASE_URL = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const config = {
  latestPostsCount: 4,
  author: 'Lorenzo Baronio',
  siteName: SITE_TITLE,
  language: 'en-US',
};

export const links = [
  { title: 'Home', url: '/' },
  { title: 'Blog', url: '/blog' },
  { title: 'Tags', url: '/tags' },
  { title: 'Search', url: '/search' },
];

export function getPostLink(post: { id: string }): string {
  return `/blog/${post.id}/`;
}