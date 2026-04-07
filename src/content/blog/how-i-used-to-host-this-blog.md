---
title: How I Used to Host This Blog
description: A record of my previous blog setup with Docmost, Cloudflare Tunnel, and Nginx before migrating to Astro.
pubDate: 2025-05-27
updatedDate: 2026-04-06
tags: [homelab, blog, astro]
---

## Intro

In April 2026, I migrated this blog to Astro and moved hosting to GitHub Pages. This post is a record of the setup I used before that migration, based on Docmost, Cloudflare, Tailscale and Nginx.

## Content Workflow

My blog content lived in a Docmost workspace. I published a main page as the public blog entry point, and each article lived as a subpage under that parent.

I kept a separate Draft page for writing and editing. When a post was ready, I moved that subpage from Draft into the public blog tree.

This gave me a simple publishing workflow while keeping drafts isolated from public content.

## Domain and Redirect Setup

Docmost share links can be long and hard to remember, so I used a permanent redirect from blog.lorenzobaronio.com to my public Docmost page.

Traffic flow was straightforward: Cloudflare DNS and Tunnel -> Nginx -> 301 redirect -> public Docmost URL.

Here is the Nginx configuration:

```plaintext
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;

        server_name localhost blog.lorenzobaronio.com;

        return 301 https://notes.lorenzobaronio.com/share/okbhnxx4yb/p/code-and-cables-by-lorenzo-fKJS3Pu725;
    }
}
```

This setup listens for requests to blog.lorenzobaronio.com (or localhost) and returns an HTTP 301 redirect to the Docmost share URL.

## Security Notes

Tailscale was part of the full setup around this stack. In practice, it helped me keep private services off the public internet and limit direct exposure while still allowing controlled access through Cloudflare.

## Conclusion

This architecture was practical and easy to operate: Docmost for authoring, Cloudflare for public ingress, and Nginx for clean redirects. It served well before the move to Astro and GitHub Pages.

## Further Reading and Resources

- **Docmost:** [https://docmost.com/](https://docmost.com/)
- **Cloudflare:** [https://www.cloudflare.com/](https://www.cloudflare.com/)
- **Tailscale:** [https://tailscale.com/](https://tailscale.com/)
