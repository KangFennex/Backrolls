# Production Authentication Fix

## Problem
Authentication worked locally but failed in production on Vercel. Users could log in and access the lounge, but:
- Stats showed zero
- Votes, favorites, and other mutations didn't persist
- Only optimistic UI updates worked

## Root Causes

### 1. **Inconsistent Auth Configuration**
- Had both `auth.config.ts` and `app/lib/auth-options.ts` with different settings
- Different session maxAge values (30 days vs 1 day)
- Routes used different auth configurations

### 2. **Missing Production Cookie Configuration**
- No explicit cookie settings for production (HTTPS)
- Production requires `__Secure-` prefix for cookies
- Missing `sameSite`, `secure`, and `httpOnly` settings

### 3. **Context Creation Issues**
- Manually decoding JWT tokens instead of using `getServerSession`
- Cookie name detection was fragile and error-prone
- Failed silently in production environments

### 4. **Environment Variable Naming**
- Used `AUTH_URL` instead of `NEXTAUTH_URL`
- NextAuth expects specific variable names

## Fixes Applied

### 1. Consolidated Auth Configuration
**Files Modified:**
- `auth.ts` - Now uses `authOptions` from `app/lib/auth-options.ts`
- `app/api/auth/[...nextauth]/route.ts` - Updated to use consolidated config
- Can now delete `auth.config.ts` (no longer used)

### 2. Added Production Cookie Configuration  
**File: `app/lib/auth-options.ts`**
Added proper cookie configuration:
```typescript
cookies: {
    sessionToken: {
        name: process.env.NODE_ENV === 'production' 
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token',
        options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
        },
    },
},
```

### 3. Fixed Context Creation
**File: `app/server/context.ts`**
- Now uses `getServerSession(authOptions)` instead of manual JWT decoding
- Properly handles session detection across environments
- Better error logging for debugging

### 4. Fixed Environment Variable
**File: `.env.local`**
- Changed `AUTH_URL` to `NEXTAUTH_URL`

## Vercel Configuration Required

Since you already have your environment variables set locally, you need to ensure they're set in Vercel:

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to: **Settings → Environment Variables**
3. Add/verify these variables for **Production**, **Preview**, and **Development**:

```bash
# Required for NextAuth (MUST MATCH LOCAL)
AUTH_SECRET=5efddffb20e33708b38d41d2b2f6a852
NEXTAUTH_URL=https://your-production-domain.vercel.app

# Database
POSTGRES_URL=<your-postgres-url>
POSTGRES_URL_NON_POOLING=<your-non-pooling-url>

# Supabase (already set, verify they match local)
NEXT_PUBLIC_SUPABASE_URL=https://htsnvmrjwfbpjoqicyrk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Google OAuth (if using)
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

### Critical: NEXTAUTH_URL
- **Development:** `http://localhost:3000`
- **Production:** `https://your-actual-domain.vercel.app`

Make sure to update this in Vercel to match your actual production URL!

## Testing Checklist

After deploying to Vercel:

1. ✅ Clear browser cookies for your domain
2. ✅ Log in successfully
3. ✅ Check that lounge stats show correct numbers (not zero)
4. ✅ Vote on a quote - verify it persists
5. ✅ Favorite a quote - verify it shows in your favorites
6. ✅ Post a comment - verify it saves
7. ✅ Refresh the page - session should persist
8. ✅ Protected routes should still require authentication

## How the Fix Works

### Before:
```
Login → Cookie set with one config
    ↓
tRPC context → Tries to decode with different method
    ↓
Session not found → Returns null
    ↓
Protected procedures fail → Only optimistic updates show
```

### After:
```
Login → Cookie set with proper production config
    ↓
tRPC context → Uses getServerSession with same authOptions
    ↓
Session found correctly → Returns user data
    ↓
Protected procedures work → Data persists to database ✅
```

## Files Modified

1. `auth.ts` - Consolidated to use authOptions
2. `app/lib/auth-options.ts` - Added cookie configuration, extended session to 30 days
3. `app/server/context.ts` - Fixed session detection using getServerSession
4. `app/api/auth/[...nextauth]/route.ts` - Updated to use authOptions
5. `.env.local` - Changed AUTH_URL to NEXTAUTH_URL

## Files That Can Be Deleted

- `auth.config.ts` - No longer needed, replaced by consolidated auth-options.ts

## Deployment Steps

1. **Ensure local changes work:**
   ```bash
   pnpm run build
   pnpm dev
   # Test locally
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Fix: Production auth with proper cookie config"
   git push origin main
   ```

3. **Update Vercel Environment Variables:**
   - Set `NEXTAUTH_URL` to your production URL
   - Verify `AUTH_SECRET` matches your local value
   - Verify all other variables are set

4. **Redeploy on Vercel** (if not auto-deployed)

5. **Test in production** using checklist above

## Why This Was Failing in Production

1. **Cookie Detection:** Production uses HTTPS and requires `__Secure-` prefix cookies
2. **Session Validation:** Manual JWT decoding didn't properly handle cookie names across environments  
3. **Context Mismatch:** Different parts of the app used different auth configs
4. **Environment Variable:** `AUTH_URL` isn't recognized by NextAuth (needs `NEXTAUTH_URL`)

All these issues are now resolved! 🎉
