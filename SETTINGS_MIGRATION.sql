-- Create settings table for global configuration
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_title TEXT DEFAULT 'Backstagers - Jawa Barat',
  site_description TEXT DEFAULT 'Organisasi Profesional Event & Entertainment',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  maintenance_message TEXT DEFAULT 'Situs sedang dalam pemeliharaan. Silakan kembali lagi nanti.',
  seo_keywords TEXT DEFAULT 'event, entertainment, backstagers, jawa barat',
  social_media JSONB DEFAULT '{
    "instagram": "https://instagram.com/backstagers",
    "facebook": "https://facebook.com/backstagers",
    "twitter": "https://twitter.com/backstagers"
  }',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Enable read access for all users" ON settings
  FOR SELECT USING (true);

-- Admin write policy (requires admin role or token check in API)
CREATE POLICY "Enable update for authenticated users" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');

INSERT INTO settings (id) VALUES (1) ON CONFLICT DO NOTHING;
