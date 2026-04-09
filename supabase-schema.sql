-- SUPABASE TABLES SCHEMA FOR MAISON ÉLITE
-- Copy and paste this into the Supabase SQL Editor

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  original_price numeric,
  description text NOT NULL,
  images text[] DEFAULT '{}',
  stock integer DEFAULT 50,
  category text NOT NULL,
  featured boolean DEFAULT false,
  rating numeric DEFAULT 4.8,
  review_count integer DEFAULT 0,
  benefits text[] DEFAULT '{}',
  specs jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Create Users Table (Custom Auth Table)
CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'user',
  name text,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  wilaya text NOT NULL,
  items jsonb NOT NULL, -- Array of items with details
  total numeric NOT NULL,
  shipping numeric DEFAULT 0,
  grand_total numeric NOT NULL,
  status text DEFAULT 'pending',
  payment_method text DEFAULT 'cod',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security) - Optional: for local dev, you can disable it or add basic policies
-- For now, let's keep it simple. If you want production security, you should add policies.
