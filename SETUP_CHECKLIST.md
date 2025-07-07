# 🚀 Supabase Setup Checklist

Follow this checklist step by step to get your Supabase integration working.

## ✅ Step 1: Create Supabase Project

- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up/Login with GitHub, Google, or email
- [ ] Click "New Project"
- [ ] Choose organization
- [ ] Project name: `spiritual-journey` (or your choice)
- [ ] Create strong database password (save it!)
- [ ] Choose region closest to your users
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for project creation

## ✅ Step 2: Get Project Credentials

- [ ] Go to project dashboard
- [ ] Navigate to **Settings → API**
- [ ] Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)
- [ ] Copy **anon/public key** (long JWT token starting with `eyJ...`)

## ✅ Step 3: Update Environment Variables

- [ ] Open `.env.development` file
- [ ] Replace placeholder values:
  ```env
  VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key
  ```
- [ ] Save the file

## ✅ Step 4: Run Database Migration

- [ ] In Supabase dashboard, go to **SQL Editor**
- [ ] Click **"New query"**
- [ ] Copy entire contents of `supabase-migrations.sql`
- [ ] Paste into SQL editor
- [ ] Click **"Run"** (or Ctrl/Cmd + Enter)
- [ ] Verify success messages appear

## ✅ Step 5: Add Additional Content (Optional)

- [ ] Copy contents of `migrate-content-to-supabase.sql`
- [ ] Run in SQL Editor to add more sample content
- [ ] This adds the "remember" article from your JSON

## ✅ Step 6: Verify Database Setup

- [ ] Go to **Table Editor** in Supabase
- [ ] Check `authors` table has 1 row
- [ ] Check `pages` table has 1+ rows
- [ ] Verify data looks correct

## ✅ Step 7: Install Dependencies & Test

- [ ] Run: `npm install`
- [ ] Run: `npm run dev`
- [ ] App should start without errors
- [ ] You should see a "Supabase Test" button in top-right corner
- [ ] Click the test button
- [ ] All tests should pass ✅

## ✅ Step 8: Switch to Supabase Components (Optional)

If tests pass, you can switch to database-driven components:

- [ ] In `src/App.tsx`, replace the routes:
  ```tsx
  // Replace HomePage with SupabaseHomePage
  import SupabaseHomePage from './components/SupabaseHomePage';
  import SupabaseArticlePage from './components/SupabaseArticlePage';
  
  // Update routes:
  <Route path="/" element={<SupabaseHomePage language={language} setLanguage={handleLanguageChange} />} />
  <Route path="/article/:id" element={<SupabaseArticlePage language={language} setLanguage={handleLanguageChange} />} />
  ```

## ✅ Step 9: Clean Up (After Testing)

- [ ] Remove `TestSupabaseComponent` from App.tsx
- [ ] Remove test-related imports
- [ ] Delete test files if desired:
  - `src/components/TestSupabaseComponent.tsx`
  - `src/utils/testSupabaseConnection.ts`

## 🔧 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.development` file exists and has correct variable names
- Restart dev server: `npm run dev`
- Variable names must be exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### "Failed to load content" 
- Verify migration script ran successfully in SQL Editor
- Check Supabase URL and key are correct
- Look at browser console for specific errors

### SQL Migration Errors
- Copy the entire script, not just parts
- Check for syntax errors in SQL Editor
- Try running in smaller chunks if needed

### Test Button Shows Errors
- Check browser console for detailed error messages
- Verify environment variables are set correctly
- Make sure migration script completed successfully

## 🎉 Success Indicators

When everything is working:
- ✅ Test button shows all green checkmarks
- ✅ App loads without console errors
- ✅ Content loads from database instead of JSON file
- ✅ You can see data in Supabase Table Editor

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify each step in this checklist
3. Make sure your Supabase project is fully created (not still initializing)
4. Double-check your environment variables

---

**Once everything works, you'll have a fully functional Supabase-powered app! 🚀**