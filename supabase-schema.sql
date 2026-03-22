-- SmoothSend Pilot Program — Supabase Database Schema
-- Run this in the Supabase SQL Editor at https://app.supabase.com

-- Create the applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Step 1: Project Identity
  project_name    TEXT NOT NULL CHECK (char_length(project_name) >= 2 AND char_length(project_name) <= 100),
  website_url     TEXT NOT NULL,
  twitter_url     TEXT NOT NULL,
  one_liner       TEXT NOT NULL CHECK (char_length(one_liner) >= 10 AND char_length(one_liner) <= 150),

  -- Step 2: Tech & Traction
  mainnet_status  TEXT NOT NULL CHECK (mainnet_status IN ('live', 'testnet', 'migrating')),
  daily_txs       TEXT NOT NULL CHECK (daily_txs IN ('<50', '50-250', '250-1000', '1000+')),
  gas_solution    TEXT NOT NULL CHECK (gas_solution IN ('users_pay', 'built_own', 'third_party')),

  -- Step 3: The Why
  why_gasless     TEXT NOT NULL CHECK (char_length(why_gasless) >= 50),

  -- Step 4: Contact & Commitment
  email           TEXT NOT NULL,
  telegram        TEXT NOT NULL,
  data_agreement  BOOLEAN NOT NULL DEFAULT TRUE,

  -- Admin fields (internal use only)
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'selected', 'rejected')),
  admin_notes     TEXT NOT NULL DEFAULT ''
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can INSERT (submit an application — public form)
CREATE POLICY "Anyone can submit applications"
  ON public.applications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users (our team) can SELECT (read all applications)
CREATE POLICY "Admins can read all applications"
  ON public.applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can UPDATE (change status / add notes)
CREATE POLICY "Admins can update applications"
  ON public.applications
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create an index to speed up status-filtered queries
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications (created_at DESC);
