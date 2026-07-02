# Domain Setup

Use these placeholders until Saul has the final domain:

```bash
CUSTOM_DOMAIN=yourdomain.com
WWW_DOMAIN=www.yourdomain.com
```

## General steps

1. Deploy the site first.
2. Add the custom domain inside the hosting provider dashboard.
3. Set one canonical domain, preferably either `www.yourdomain.com` or `yourdomain.com`.
4. Redirect the other domain to the canonical domain.
5. Add DNS records exactly as shown by the host dashboard because providers sometimes generate project-specific values.
6. Remove conflicting old A or CNAME records.
7. Wait for DNS propagation.
8. Enable HTTPS/SSL after DNS verifies.

Saul can ask for help once the exact domain registrar and hosting provider are known.

## Vercel

1. Open the Vercel project.
2. Go to Project Settings -> Domains.
3. Add `yourdomain.com`.
4. Add `www.yourdomain.com`.
5. Vercel will show the required A, CNAME, or nameserver records.
6. Add those records at the domain registrar or DNS provider.
7. Vercel often recommends adding and redirecting the `www` subdomain for better domain control.
8. Choose the primary domain and redirect the other.
9. Wait for verification and HTTPS.

## Netlify

Netlify supports two common options.

Option 1: Use Netlify DNS.

1. Add the domain in Netlify.
2. Change nameservers at the registrar to the nameservers Netlify provides.
3. Netlify manages DNS records.

Option 2: Keep external DNS.

1. Add the domain in Netlify.
2. Keep the current DNS provider.
3. Add the A, CNAME, or other records Netlify provides.
4. Add both apex and `www` domains.
5. Select one as primary.
6. Netlify can redirect the non-primary domain to the primary domain.

Always use the exact DNS records shown in the hosting dashboard.
