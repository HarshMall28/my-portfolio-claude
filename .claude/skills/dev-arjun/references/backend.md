# Backend reference for portfolio

## Tech choices
- Email: Resend (resend.com) — free tier, simple API, no SMTP config
- Rate limiting: upstash/ratelimit — free Redis, edge-compatible
- GitHub data: fetch from api.github.com — cache with next: { revalidate: 3600 }
- No database needed for portfolio

## Contact form route
File: src/app/api/contact/route.ts
- Validate: name (required), email (valid format), message (min 10 chars)
- Rate limit: 3 requests per hour per IP using upstash
- Send email: Resend API to your email address
- Return: 200 on success, 429 on rate limit, 400 on validation error
- Never expose Resend API key — use RESEND_API_KEY env var

## GitHub stats route
File: src/app/api/github/route.ts
- Fetch: https://api.github.com/users/{your-username}
- Also fetch: https://api.github.com/users/{your-username}/repos
- Cache: next: { revalidate: 3600 } — refresh every hour
- Return: { repos, stars, followers, topLanguages }
- Handle: 404 if username wrong, 403 if rate limited

## Environment variables needed
RESEND_API_KEY=re_xxxx
GITHUB_USERNAME=your-username
NEXT_PUBLIC_SITE_URL=https://your-portfolio.vercel.app

## Always add to .env.example when adding a new var
