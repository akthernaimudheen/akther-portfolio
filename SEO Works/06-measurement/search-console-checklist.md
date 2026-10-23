# Google Search Console Verification & Audit Checklist

**Status:** [Recommendation] & [Unknown / requires access]  
**Target Domain:** `akthernaimudheen.in`  
**Owner Action Required:** Manual verification in Google Search Console  

---

## 1. Domain Property Verification Protocol

To verify full ownership across all protocols (`http`, `https`, `www`, and non-`www`):

### Step 1: Add Domain Property in Google Search Console
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property**.
3. Select **Domain** (not URL prefix) and enter: `akthernaimudheen.in`.
4. Copy the unique `google-site-verification` TXT token provided by Google.

### Step 2: Add DNS Record in Cloudflare
1. Log in to the Cloudflare Dashboard for `akthernaimudheen.in`.
2. Go to **DNS** -> **Records** -> **Add Record**.
3. Configure the TXT record:
   - **Type:** `TXT`
   - **Name:** `@` (or `akthernaimudheen.in`)
   - **Content:** `google-site-verification=...`
   - **TTL:** Auto
4. Save the record and return to Google Search Console. Click **Verify**.

---

## 2. URL Inspection & Canonical Verification Protocol

Once property ownership is active, inspect the following representative URLs using the **URL Inspection** bar:

1. `https://www.akthernaimudheen.in/` (Homepage)
2. `https://www.akthernaimudheen.in/work/iscribe` (Clinical AI Case Study)
3. `https://www.akthernaimudheen.in/work/rshorts` (Python Media Pipeline)
4. `https://www.akthernaimudheen.in/services` (Services Offering)
5. `https://www.akthernaimudheen.in/blog/building-clinical-ai-beyond-transcription` (Technical Essay)

### What to Verify in URL Inspection:
- [ ] **User-declared canonical:** Confirmed as `https://www.akthernaimudheen.in{route}`.
- [ ] **Google-selected canonical:** Matches user-declared canonical (Confirms Google has not collapsed the page into the homepage).
- [ ] **Page fetch:** Status `Successful`.
- [ ] **Crawled as:** `Googlebot smartphone`.
- [ ] **Indexing allowed?:** `Yes`.

---

## 3. Sitemap Submission & Processing Audit

1. In GSC, navigate to **Sitemaps** in the left sidebar.
2. Enter the sitemap path: `sitemap.xml` (Full URL: `https://www.akthernaimudheen.in/sitemap.xml`).
3. Click **Submit**.
4. Confirm the response:
   - Status: `Success`
   - Discovered pages: Exactly `15`
5. If status shows "Couldn't fetch", verify that `robots.txt` is accessible and permits Googlebot.

---

## 4. Crawl Health & Index Coverage Monitoring

Over the next 14–30 days, track the following GSC reports weekly:

1. **Pages / Coverage Report:**
   - **Indexed Pages:** Should increase to 15 valid pages.
   - **Duplicate without user-selected canonical:** Must remain `0`.
   - **Duplicate, Google chose different canonical than user:** Must remain `0`.
2. **Performance Report (Search Results):**
   - Track initial impressions for: `AI application engineer portfolio`, `software developer portfolio Kochi`, `AI application testing`.
3. **Core Web Vitals:**
   - Confirm Good status for LCP (Largest Contentful Paint < 2.5s), INP (Interaction to Next Paint < 200ms), and CLS (Cumulative Layout Shift < 0.1).

---

## 5. Strict Change-Control Restrictions

- **Do NOT submit URL Removal Requests** in GSC without explicit confirmation.
- **Do NOT request manual re-indexing** repeatedly; let Googlebot discover pages naturally through the sitemap and internal links.
