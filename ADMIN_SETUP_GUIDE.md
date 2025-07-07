# 🔐 Admin Panel Setup Guide

This guide will help you set up the admin panel for content management.

## 📋 Prerequisites

- ✅ Supabase project created and configured
- ✅ Basic migration completed (`supabase-migrations.sql`)
- ✅ App running with Supabase integration

## 🚀 Setup Steps

### Step 1: Run Admin Database Setup

1. **Go to your Supabase SQL Editor**
2. **Copy and paste** the contents of `admin-database-setup.sql`
3. **Run the script** - this will:
   - Create admin policies for authenticated users
   - Set up user profiles table
   - Create triggers for new user registration

### Step 2: Create Admin User

1. **Go to Supabase Dashboard → Authentication → Users**
2. **Click "Add user"**
3. **Enter admin credentials:**
   - Email: `admin@yourdomain.com` (use your actual email)
   - Password: Create a strong password
   - Email confirm: ✅ (check this)
4. **Click "Create user"**

### Step 3: Test Admin Access

1. **Navigate to** `http://localhost:5173/admin` (or your dev URL)
2. **Login with** the admin credentials you just created
3. **You should see** the admin dashboard

## 🎯 Admin Panel Features

### 📊 Dashboard
- **Content overview** - Total pages, published count
- **Pages list** - View all pages with actions
- **Quick actions** - Create, edit, delete pages

### ✏️ Page Editor
- **Bilingual editing** - Tamil and English content side-by-side
- **Content types** - Support for various content types:
  - Main Text
  - Scripture
  - Scripture Reflection
  - Promise
  - Reflection
  - Habit Definition
  - Encouragement
  - And more...
- **Theme selection** - Gray, Warm, Cool, Nature themes
- **Content management** - Add, remove, reorder content items

### 🔒 Security Features
- **Authentication required** - Only logged-in users can access admin
- **Row Level Security** - Database-level protection
- **Input validation** - Form validation and error handling

## 🛠️ Usage Instructions

### Creating a New Page

1. **Click "Create New Page"** in the dashboard
2. **Fill in the details:**
   - Page ID (unique identifier, e.g., "hope", "faith")
   - Tamil Title
   - English Title
   - Theme (affects page styling)
3. **Add content items** for both languages
4. **Choose content types** (mainText, scripture, reflection, etc.)
5. **Click "Save Page"**

### Editing an Existing Page

1. **Click the edit icon** (pencil) next to any page
2. **Modify the content** as needed
3. **Use the arrow buttons** to reorder content items
4. **Click "Save Page"** to update

### Deleting a Page

1. **Click the delete icon** (trash) next to any page
2. **Confirm deletion** in the popup
3. **Page will be permanently removed**

## 🔧 Advanced Configuration

### Custom User Roles (Optional)

To restrict admin access to specific users:

1. **Modify the admin policies** in `admin-database-setup.sql`
2. **Add email domain checking:**
   ```sql
   -- Example: Only allow users with @yourdomain.com emails
   CREATE POLICY "Allow domain admins to insert pages" ON pages
     FOR INSERT 
     WITH CHECK (auth.email() LIKE '%@yourdomain.com');
   ```

### Email Notifications (Optional)

Set up email notifications for content changes:

1. **Go to Supabase Dashboard → Database → Webhooks**
2. **Create webhook** for table changes
3. **Configure your notification service**

## 🚨 Security Best Practices

### 1. Strong Passwords
- Use strong, unique passwords for admin accounts
- Consider using a password manager

### 2. Limited Access
- Only create admin accounts for trusted users
- Regularly review user access

### 3. Backup Strategy
- Regular database backups through Supabase
- Export content periodically

### 4. Environment Security
- Keep environment variables secure
- Use different credentials for production

## 🔍 Troubleshooting

### "Access Denied" Error
- ✅ Check if admin user is created in Supabase Auth
- ✅ Verify admin database setup script ran successfully
- ✅ Ensure user is logged in

### "Failed to Save" Error
- ✅ Check browser console for specific errors
- ✅ Verify database policies are set correctly
- ✅ Ensure all required fields are filled

### Page Not Loading
- ✅ Check if page ID is unique
- ✅ Verify content structure is valid
- ✅ Check for special characters in page ID

## 📱 Mobile Responsiveness

The admin panel is responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones (limited functionality)

## 🔄 Content Workflow

### Recommended Process:
1. **Draft content** in your preferred editor
2. **Create page** in admin panel
3. **Add content items** one by one
4. **Preview page** using the view button
5. **Publish** when ready

### Content Types Guide:
- **Main Text**: Regular paragraphs and content
- **Scripture**: Bible verses and religious quotes
- **Reflection**: Personal thoughts and insights
- **Promise**: Divine promises and assurances
- **Encouragement**: Motivational content

## 🎉 You're Ready!

Your admin panel is now set up and ready to use. You can:
- ✅ Create and edit content through the web interface
- ✅ Manage multiple pages and articles
- ✅ Support bilingual content (Tamil & English)
- ✅ Use various content types for rich formatting

**Access your admin panel at:** `/admin`