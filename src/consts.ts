import avatarImage from './assets/avatar.png';

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
  avatarImage,
};

export const links = [
  { title: 'Home', url: '/' },
  { title: 'Posts', url: '/posts' },
  { title: 'Search', url: '/search' },
  { title: 'Tags', url: '/tags' },
];

export function getPostLink(post: { id: string }): string {
  return `/posts/${post.id}/`;
}