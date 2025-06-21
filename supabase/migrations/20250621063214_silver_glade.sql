/*
  # User Profiles Schema Setup

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text, required)
      - `phone` (text, optional)
      - `role` (enum: user, agent, admin, superadmin)
      - `status` (enum: active, inactive, suspended)
      - `avatar_url` (text, optional)
      - `company` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for user access control
    - Add policies for admin access

  3. Functions & Triggers
    - Auto-create profile on user registration
    - Auto-update timestamp on profile changes

  4. Default Data
    - Create default admin users for development
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin', 'superadmin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text NOT NULL,
  phone text,
  role user_role DEFAULT 'user' NOT NULL,
  status user_status DEFAULT 'active' NOT NULL,
  avatar_url text,
  company text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Superadmins can insert profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'superadmin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create default admin users (for development)
-- First, create the auth users
DO $$
DECLARE
  admin_user_id uuid;
  superadmin_user_id uuid;
BEGIN
  -- Generate UUIDs for the admin users
  admin_user_id := gen_random_uuid();
  superadmin_user_id := gen_random_uuid();
  
  -- Insert admin user if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@propertipro.id') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      aud,
      role
    ) VALUES (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@propertipro.id',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"full_name": "Admin User", "role": "admin"}'::jsonb,
      'authenticated',
      'authenticated'
    );
  END IF;
  
  -- Insert superadmin user if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'superadmin@propertipro.id') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      aud,
      role
    ) VALUES (
      superadmin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'superadmin@propertipro.id',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"full_name": "Super Admin", "role": "superadmin"}'::jsonb,
      'authenticated',
      'authenticated'
    );
  END IF;
END $$;