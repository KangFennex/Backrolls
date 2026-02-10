# Vercel Deployment Checklist

## ⚠️ Critical Configuration for Production

Your authentication is now fixed for production! Before deploying, verify these Vercel settings:

### 1. Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Set these for **Production**, **Preview**, and **Development** environments:

#### Authentication (CRITICAL)
```bash
AUTH_SECRET=5efddffb20e33708b38d41d2b2f6a852
NEXTAUTH_URL=https://your-actual-production-domain.vercel.app
```

**⚠️ Important:** 
- `NEXTAUTH_URL` must be your actual Vercel production URL
- Don't include `/api/auth` - just the base URL
- Example: `https://backrolls.vercel.app`

#### Database
```bash
POSTGRES_URL=<copy-from-local-.env.local>
POSTGRES_URL_NON_POOLING=<copy-from-local-.env.local>
```

#### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://htsnvmrjwfbpjoqicyrk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy-from-local-.env.local>
SUPABASE_SERVICE_ROLE_KEY=<copy-from-local-.env.local>
```

#### Google OAuth (if using)
```bash
GOOGLE_CLIENT_ID=<copy-from-local-.env.local>
GOOGLE_CLIENT_SECRET=<copy-from-local-.env.local>
```

### 2. Deploy to Vercel

```bash
git add .
git commit -m "Fix: Production authentication with proper session handling"
git push origin main
```

Vercel will auto-deploy if connected, or manually trigger deployment.

### 3. After Deployment - Testing

**Test these in order:**

1. **Clear browser cookies** for your production domain
2. **Log in** - should work without errors
3. **Check Lounge** - stats should show real numbers (not zeros)
4. **Vote on a quote** - should persist after refresh
5. **Favorite a quote** - should appear in your favorites tab
6. **Post a comment** - should save and appear immediately
7. **Refresh the page** - should stay logged in

### 4. Troubleshooting

If authentication still doesn't work:

#### Check Vercel Logs
```
Vercel Dashboard → Your Project → Deployments → Latest → Logs
```

Look for these messages:
- `[Context] No session found` ❌ (means session not detected)
- `[Context] Session found for user: <user-id>` ✅ (means it's working)

#### Common Issues

**Stats still showing zero?**
- Check Vercel logs for `[Context]` messages
- Verify `NEXTAUTH_URL` is set correctly
- Make sure `AUTH_SECRET` matches your local value exactly

**Can't log in?**
- Check `NEXTAUTH_URL` is your production domain, not localhost
- Verify all Supabase environment variables are set
- Check for any error messages in browser console

**Session doesn't persist?**
- Clear all cookies and try again
- Check that cookies are being set (Browser DevTools → Application → Cookies)
- Look for `__Secure-next-auth.session-token` cookie

### 5. Key Changes Made

✅ Consolidated authentication configuration  
✅ Added production-ready cookie settings  
✅ Fixed session detection in tRPC context  
✅ Extended session duration to 30 days  
✅ Changed `AUTH_URL` to `NEXTAUTH_URL`

### 6. Files You Can Delete

After verifying everything works:
- `auth.config.ts` (no longer used)

---

## Quick Reference

**What was the problem?**
- Authentication worked locally but session wasn't detected in tRPC calls on production
- Stats, votes, favorites, and comments failed silently (only optimistic updates showed)

**What was the fix?**
- Consolidated auth configuration
- Added proper production cookie settings
- Fixed tRPC context to use `getServerSession()` properly
- Set correct environment variables

**What do you need to do?**
1. Set environment variables in Vercel (especially `NEXTAUTH_URL`)
2. Push changes to trigger deployment
3. Test using the checklist above

---

Need help? Check `PRODUCTION_AUTH_FIX.md` for detailed technical explanation.
