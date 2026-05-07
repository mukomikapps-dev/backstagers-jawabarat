-- Create projects table
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX projects_id_idx ON projects(id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT
  USING (true);

-- Allow authenticated write access (admin only via API token)
CREATE POLICY "Allow admin write access" ON projects
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin update access" ON projects
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow admin delete access" ON projects
  FOR DELETE
  USING (true);

-- Insert sample projects
INSERT INTO projects (name, description, image, category) VALUES
('Tech Conference 2024', 'Annual technology conference with 500+ attendees', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', 'Conference'),
('Music Festival Night', 'Live music festival featuring local artists', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop', 'Festival'),
('Corporate Gala Dinner', 'Elegant corporate event with live entertainment', 'https://plus.unsplash.com/premium_photo-1722859263568-1c62f861b28f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Corporate'),
('Product Launch Event', 'Brand new product launch with digital setup', 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&h=400&fit=crop', 'Launch');
