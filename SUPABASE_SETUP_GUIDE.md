# Step-by-Step Supabase Setup Guide

Follow these exact steps to set up your Supabase project and migrate your data.

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"** or "Sign up" if you don't have an account
3. **Sign up/Login** using GitHub, Google, or email
4. **Create a new project:**
   - Click "New Project"
   - Choose your organization (or create one)
   - Project name: `spiritual-journey` (or your preferred name)
   - Database password: Create a strong password (save this!)
   - Region: Choose closest to your users
   - Click "Create new project"

⏳ **Wait 2-3 minutes** for the project to be created.

## Step 2: Get Your Project Credentials

1. **Go to your project dashboard**
2. **Navigate to Settings → API** (in the left sidebar)
3. **Copy these values:**
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

## Step 3: Update Environment Variables

Update your `.env.development` file:

```env
# Development environment - disable GA by default
VITE_GA_TRACKING_ID=G-CVRLXZ6V3C
VITE_DISABLE_GA=true

# Supabase Configuration (Development)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key
```

**Replace the placeholder values with your actual Supabase URL and key!**

## Step 4: Run Database Migration

1. **In your Supabase dashboard, go to SQL Editor** (in left sidebar)
2. **Click "New query"**
3. **Copy the entire contents** of the `supabase-migrations.sql` file
4. **Paste it into the SQL editor**
5. **Click "Run"** (or press Ctrl/Cmd + Enter)

You should see:
- ✅ Tables created successfully
- ✅ Policies created
- ✅ Sample data inserted

## Step 5: Verify Setup

1. **Go to Table Editor** in your Supabase dashboard
2. **Check that you have these tables:**
   - `authors` (with 1 row of sample data)
   - `pages` (with 1+ rows of sample data)

## Step 6: Test Your App

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start your development server:**
   ```bash
   npm run dev
   ```

3. **Test the integration:**
   - Your app should load without errors
   - Content should load from Supabase instead of the JSON file

## Troubleshooting

### ❌ "Missing Supabase environment variables"
- Double-check your `.env.development` file
- Make sure the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after changing environment variables

### ❌ "Failed to load content"
- Check if the migration script ran successfully
- Verify your Supabase URL and key are correct
- Check the browser console for specific error messages

### ❌ SQL Migration Errors
- Make sure you copied the entire migration script
- Check for any syntax errors in the SQL editor
- Try running the script in smaller chunks if needed

## Next Steps After Setup

Once everything is working:

1. **Switch to Supabase components** (optional)
2. **Add more content** through the Supabase dashboard
3. **Set up production environment** variables
4. **Consider adding authentication** for admin features

---

**Need help?** Check the browser console for error messages and refer to the troubleshooting section above.