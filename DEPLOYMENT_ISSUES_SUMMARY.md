# FORBIDEN App Store - Deployment Issues Summary

## Status: ⚠️ DEPLOYMENT BLOCKED

**Date:** August 26, 2026  
**Critical Issues:** 3  
**High Priority Issues:** 2  
**Medium Priority Issues:** 3  
**Total Blocker Issues:** 3 (Must fix before Vercel deployment)

---

## Critical Issues (Must Fix)

### 1️⃣ **Data Persistence - LOCAL FILE STORAGE INCOMPATIBLE**

**Problem:** All app data stored in `store_data.json` on disk using `fs.writeFileSync()`.  
**Impact on Vercel:** Every serverless invocation gets isolated filesystem. All writes are lost after function completes.  
**Result:** Users cannot save apps, record downloads, or persist any changes.

**Files:** `server/db.ts` (lines 29-65)  
**Timeline to Fix:** 2-4 hours  
**Solution:** Migrate to Vercel KV (Redis) or PostgreSQL database

---

### 2️⃣ **Hash-Based Routing - BREAKS PAGE REFRESH**

**Problem:** All app routes use hash fragments (`#app/drone-portal`) with state management. App clears hash after handling it (line 125 in `src/App.tsx`).  
**Impact on Vercel:** Users cannot refresh page on detail pages. Browser back/forward navigation unreliable. Deep links don't persist. Cannot bookmark or share app URLs.  
**Result:** App unusable on Vercel - every refresh returns to home screen.

**Files:** `src/App.tsx` (lines 100-144)  
**Timeline to Fix:** 3-6 hours  
**Solution:** Replace with React Router and standard URL paths (`/apps/drone-portal`)

---

### 3️⃣ **Download Streaming - EXCEEDS 10-SECOND TIMEOUT**

**Problem:** File downloads streamed via `pipe()` with Google Drive fetch. 50MB file takes ~10+ seconds to download. Vercel timeout is 10 seconds max.  
**Impact on Vercel:** Files >10MB will fail to download. Function gets killed mid-stream.  
**Result:** Users cannot download any large installers.

**Files:** `server/api.ts` (lines 119-265), `vercel.json` (line 4)  
**Timeline to Fix:** 1-2 hours  
**Solution:** Return Google Drive redirect URL instead of streaming

---

## High Priority Issues (Security)

### 4️⃣ **Hardcoded Admin Credentials in Browser**

**Problem:** Admin password hardcoded in `AdminPanel.tsx` line 93-94:
```javascript
if (email === 'yanfortej@gmail.com' && password === 'ARIQrahman_17-11_2010')
```

**Impact:** Anyone can view password in DevTools or source code.  
**Result:** Complete admin access compromise.

**Files:** `src/components/admin/AdminPanel.tsx`  
**Timeline to Fix:** 2-3 hours  
**Solution:** Move to environment variables with bcrypt hashing

---

### 5️⃣ **No Server-Side Authentication on Admin API**

**Problem:** All `/admin/*` endpoints have NO authentication check. Frontend-only token validation.  
**Impact:** Attackers can directly call `/api/admin/apps/save` without login.  
**Result:** Anyone can create/edit/delete apps, change settings.

**Files:** `server/api.ts` (lines 305-383)  
**Timeline to Fix:** 3-4 hours  
**Solution:** Add auth middleware that validates tokens

---

## Medium Priority Issues

### 6️⃣ **Base64 File Storage in JSON**

**Problem:** Uploaded files converted to base64 and stored in `store_data.json`.  
**Impact:** Large files exceed response size limits. Data still lost on Vercel.  
**Timeline to Fix:** 2-3 hours  
**Solution:** Use Vercel Blob or cloud storage

---

### 7️⃣ **10-Second Function Timeout**

**Problem:** `vercel.json` sets `maxDuration: 10`.  
**Impact:** Any operation >10s fails.  
**Timeline to Fix:** 5 minutes  
**Solution:** Increase to 60s (impacts cost)

---

### 8️⃣ **Unused Dependencies**

**Problem:** `@google/genai` package declared but never used.  
**Impact:** Bloats build size.  
**Timeline to Fix:** 10 minutes  
**Solution:** Remove unused package

---

## Impact on Users

### Current State (Localhost)
✅ All features work  
✅ Data persists  
✅ Apps save/edit/delete  
✅ Downloads work  
✅ Navigation works  

### Deployed to Vercel (Current Code)
❌ Cannot save apps (data lost)  
❌ Cannot refresh page on detail screens  
❌ Cannot download files (timeout)  
❌ Admin anyone can access  
❌ Broken app experience  

---

## Fix Priority & Timeline

| Priority | Issues | Effort | Hours | Total |
|----------|--------|--------|-------|-------|
| Phase 1 | Data, Routing, Downloads | CRITICAL | 6-12 | Day 1 |
| Phase 2 | Auth, Credentials | HIGH | 5-7 | Day 2 |
| Phase 3 | Storage, Config | MEDIUM | 2-3 | Day 2-3 |
| Phase 4 | Testing & Verification | - | 4-8 | Day 3-4 |

**Estimated Total:** 18-30 hours (3-5 days of development)

---

## Recommended Action Plan

### Before Vercel Deployment ❌

Currently **NOT ready**. All three critical issues must be resolved first.

### What Would Happen If Deployed Now

1. **Day 1:** Users create apps
2. **Day 2:** All apps disappear (ephemeral filesystem)
3. **Day 3:** Users cannot access saved apps or refresh pages
4. **Day 4:** No downloads work
5. **Day 5:** Security incident (anyone can access admin)

---

## Next Steps

1. **Review this summary** with your team
2. **Choose data persistence solution:**
   - MVP: Vercel KV (Redis) → 2-3 hours
   - Production: PostgreSQL (Neon) → 4-6 hours
   - Easiest: Firebase Firestore → 3-4 hours
3. **Start Phase 1 implementation** (Data, Routing, Downloads)
4. **Set up security infrastructure** (Auth, environment variables)
5. **Test thoroughly** before deploying
6. **Deploy to Vercel preview** first
7. **Run acceptance tests**
8. **Go live** when all issues resolved

---

## Questions?

See detailed explanations in:
- **VERCEL_COMPATIBILITY_REPORT.md** - Full technical analysis of each issue
- **VERCEL_DEPLOYMENT_GUIDE.md** - Step-by-step fix instructions

---

## Decision Required

**Will you:**
- [ ] **A) Fix all issues before Vercel deployment** (Recommended)
- [ ] **B) Deploy to Vercel now and fix issues later** (Not recommended - will break in production)
- [ ] **C) Stay on localhost until fixes complete** (Safe, but delays launch)

**Recommendation:** Choose **Option A** - Fix first, deploy when ready. The application is currently not Vercel-compatible.

---

**Report Generated:** August 26, 2026 04:52 UTC  
**Requires Decision By:** ASAP  
**Contact:** Development Team Lead
