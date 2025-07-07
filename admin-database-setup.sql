-- Additional database setup for admin functionality
-- Run this in your Supabase SQL Editor after the initial migration

-- Create admin policies for authenticated users
-- These policies allow authenticated users to perform admin operations

-- Policy for inserting new pages (admin only)
CREATE POLICY "Allow authenticated users to insert pages" ON pages
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating pages (admin only)
CREATE POLICY "Allow authenticated users to update pages" ON pages
  FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for deleting pages (admin only)
CREATE POLICY "Allow authenticated users to delete pages" ON pages
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Policy for updating authors (admin only)
CREATE POLICY "Allow authenticated users to update authors" ON authors
  FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for inserting authors (admin only)
CREATE POLICY "Allow authenticated users to insert authors" ON authors
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create a function to check if user is admin (optional - for future use)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, any authenticated user is considered admin
  -- You can modify this logic later to check specific roles or email domains
  RETURN user_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin user (replace with your actual email)
-- This creates a user account that can access the admin panel
-- You'll need to set a password for this user through Supabase Auth

-- Note: You'll need to create the admin user through Supabase Auth UI or API
-- This is just a comment showing the process:

/*
To create an admin user:
1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user"
3. Enter email and password
4. The user will be able to access /admin route after login
*/

-- Optional: Create a profiles table for user management (future enhancement)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for profiles (users can read their own profile)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy for profiles (authenticated users can update their own profile)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'admin'); -- Default to admin for now
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Verify the setup
SELECT 'Admin database setup completed successfully!' as status;