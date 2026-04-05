// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://lorenzobaronio22.github.io',
	base: '/my-blog',
	integrations: [mdx(), sitemap()],
});
