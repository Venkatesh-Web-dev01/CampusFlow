-- ========================================================
-- CampusFlow Supabase Database Schema & RLS Policies
-- Execute this script in your Supabase SQL Editor
-- ========================================================

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Trigger to automatically create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. OPPORTUNITIES TABLE (Shared Global Platform Opportunities)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT,
  deadline DATE NOT NULL,
  stipend_or_prize TEXT,
  description TEXT,
  eligibility TEXT,
  application_link TEXT NOT NULL,
  tags TEXT[],
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Everyone (authenticated and anon) can view published opportunities
CREATE POLICY "Opportunities are readable by everyone"
  ON public.opportunities FOR SELECT
  USING (true);

-- Only Admins can insert opportunities
CREATE POLICY "Only admins can insert opportunities"
  ON public.opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Only Admins can update opportunities
CREATE POLICY "Only admins can update opportunities"
  ON public.opportunities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- 3. APPLICATIONS TABLE (Per-Student Application Status Tracking)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Saved' CHECK (status IN ('Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (opportunity_id, student_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Students can read their own applications
CREATE POLICY "Students can read their own applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Admins can view application metrics across all students
CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Students can insert or upsert their own applications
CREATE POLICY "Students can insert their own applications"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own application status
CREATE POLICY "Students can update their own application status"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id);


-- 4. SAVED OPPORTUNITIES TABLE (Per-Student Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (opportunity_id, student_id)
);

ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage their own saved opportunities"
  ON public.saved_opportunities FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);


-- 5. INITIAL SEED DATA (Sample Opportunities)
INSERT INTO public.opportunities (
  title, organization, category, type, location, deadline, stipend_or_prize, description, eligibility, application_link, tags
) VALUES
(
  'Software Engineering Summer Internship 2026',
  'Google Tech',
  'Software Engineering',
  'Internship',
  'Mountain View, CA / Hybrid',
  '2026-10-15',
  '$8,500 / month',
  '12-week summer internship working on high-performance infrastructure, cloud APIs, and developer tooling. Collaborate with senior engineering mentors.',
  'Currently enrolled in BS, MS, or PhD in Computer Science or related STEM field. Expected graduation 2027.',
  'https://careers.google.com/students',
  ARRAY['Software', 'React', 'Cloud', 'Paid', 'Hybrid']
),
(
  'Global AI Agent Hackathon 2026',
  'Anthropic & DeepMind',
  'Artificial Intelligence',
  'Hackathon',
  'Online / Global',
  '2026-09-25',
  '$50,000 Cash Prizes',
  'Build autonomous AI agents for productivity, healthcare, or education over an intensive 48-hour global hackathon.',
  'Open to all undergraduate and graduate students globally. Teams up to 4 members.',
  'https://www.anthropic.com',
  ARRAY['AI/ML', 'Hackathon', 'Cash Prize', 'Global']
),
(
  'Women in Tech STEM Leadership Scholarship',
  'Grace Hopper Foundation',
  'Diversity & STEM',
  'Scholarship',
  'Global',
  '2026-11-01',
  '$10,000 Tuition Grant + Conference Ticket',
  'Providing financial assistance and career mentorship to high-achieving women pursuing degrees in computer science and engineering.',
  'Undergraduate women studying CS/IT/ECE with minimum 3.2 GPA.',
  'https://ghc.anitab.org',
  ARRAY['Scholarship', 'WomenInTech', 'Grant', 'Mentorship']
),
(
  'Full-Stack Web Architecture Intensive Workshop',
  'Vite & React Core Team',
  'Web Development',
  'Workshop',
  'Online Interactive',
  '2026-09-18',
  'Free Certification & Swag',
  'Hands-on masterclass covering Next.js 15, Server Components, Vite optimizations, and state synchronization.',
  'Basic knowledge of JS/React required. Free registration for student email domains.',
  'https://react.dev',
  ARRAY['Workshop', 'React', 'Vite', 'Free']
),
(
  'National Undergraduate Algorithm Challenge',
  'Competitive Coding Association',
  'Competitive Programming',
  'Competition',
  'Online',
  '2026-09-30',
  '$15,000 + FAANG Interview Opportunities',
  'Speed coding competition testing dynamic programming, graph algorithms, and system design concepts under time constraints.',
  'All enrolled college students. Individual participation.',
  'https://codeforces.com',
  ARRAY['Algorithms', 'DataStructures', 'Competition', 'Prizes']
)
ON CONFLICT DO NOTHING;
