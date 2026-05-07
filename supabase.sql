-- Create analyses table
CREATE TABLE public.analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    raw_input TEXT NOT NULL,
    summary TEXT NOT NULL,
    missing_pieces TEXT[] NOT NULL,
    next_tasks TEXT[] NOT NULL,
    risks TEXT[] NOT NULL,
    roadmap JSONB NOT NULL
);

-- Enable RLS
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Allow public read access (No authentication required)
CREATE POLICY "Allow public read access"
ON public.analyses FOR SELECT
TO public
USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access"
ON public.analyses FOR INSERT
TO public
WITH CHECK (true);
