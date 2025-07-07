-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_tamil TEXT NOT NULL,
  name_english TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  title_tamil TEXT NOT NULL,
  title_english TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'gray',
  content_tamil JSONB NOT NULL,
  content_english JSONB NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for pages table
CREATE TRIGGER update_pages_updated_at 
  BEFORE UPDATE ON pages 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on authors" ON authors
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on published pages" ON pages
  FOR SELECT USING (published = true);

-- Insert sample author data
INSERT INTO authors (name_tamil, name_english) 
VALUES ('ஆசிரியர்', 'Author')
ON CONFLICT DO NOTHING;

-- Insert sample page data (migrating from your existing content.json)
INSERT INTO pages (id, title_tamil, title_english, theme, content_tamil, content_english) 
VALUES 
(
  'weakness',
  'பலவீனமா?',
  'WEAKNESS?',
  'gray',
  '[
    {
      "type": "mainText",
      "value": "அழுகை என்பது சோகம், மகிழ்ச்சி, துக்கம் மற்றும் உடல் வலி உள்ளிட்ட பல்வேறு உணர்ச்சிகளால் தூண்டப்படும் ஒரு இயற்கையான மனித நடத்தை. இது உணர்ச்சின் பதற்றத்தை விடுவிப்பதற்கும், துயரத்தைக் குறைப்பதற்கும் அல்லது வலி நிவாரணத்தை அனுபவிப்பதற்கும் ஒரு வழியாக இருக்கலாம். ஆனால் நாம் அழுவதை விரும்புவதில்லை, இல்லையா? ஆனால் என்ன செய்வது தேவன் மனிதர்களை அழும் திறனுடன் படைத்திருக்கிறார், அவருடைய சொந்த இரக்கமுள்ள இயல்பின் பிரதிபலிப்பாகவும், மனிதர்கள் தங்கள் உணர்ச்சிகளை வெளிப்படுத்தவும் அவருடன்"
    },
    {
      "type": "scripture",
      "value": "என் அலைச்சல்களை தேவரீர் எண்ணியிருக்கிறீர்; என் கண்ணீரை உம்முடைய துருத்தியில் வையும்; அவைகள் உம்முடைய கணக்கில் அல்லவோ இருக்கிறது - சங்கீதம் 56:8."
    },
    {
      "type": "mainText",
      "value": "நீங்கள் வலியில் கண்ணீர் சிந்தும்போது, யாருக்கும் தெரியாது அல்லது யாரும் உங்களை கவனிக்கமாட்டார்கள் அல்லது யாரும் உங்களுக்கு உதவ முடியாது என்று நினைக்காதீர்கள். இந்த வசனம் தேவன் நம் துக்கங்களைக் கண்காணிக்கிறார், நம் கண்ணீரைக் கவனிக்காமல் இல்லை என்பதைக் குறிக்கிறது. நாம் சிந்தும் ஒவ்வொரு கண்ணீரையும் தேவன் அறிந்திருக்கிறார், நாம் அனுபவிக்கும் ஒவ்வொரு துக்கத்தையும் நினைவில் கொள்கிறார். எனவே அவரை நம்புங்கள்; அவர் செய்யும் அனைத்தும் நம் நன்மைக்காகவே. தேவன் உங்களை அழ வைத்தால், உங்க"
    },
    {
      "type": "scripture",
      "value": "அவர் அவர்களின் கண்களிலிருந்து எல்லா கண்ணீரையும் துடைப்பார். (வெளிப்படுத்துதல் 21:4). "
    },
    {
      "type": "reflection",
      "value": "புதிய விஷயங்களும் ஆசீர்வாதங்களும் வரப்போகின்றன...கடவுள் நீங்கள் சிந்தும் ஒவ்வொரு கண்ணீரையும் அறிந்திருக்கிறார் என்பது உங்களுக்கு என்ன அர்த்தம்? கடினமான காலங்களில் கடவுளின் வாக்குறுதிகளில் உங்கள் நம்பிக்கையை எவ்வாறு வளர்த்துக் கொள்ளலாம் என்பதைப் பற்றி சிந்தியுங்கள்."
    }
  ]'::jsonb,
  '[
    {
      "type": "mainText",
      "value": "Crying is a natural human behaviour triggered by various emotions, including sadness, joy, grief, and even physical pain. It can be a way to release emotional tension, signal distress, or even experience pain relief. But we don'\''t like to cry, right? but what to do God created humans with the capacity to cry as a reflection of His own compassionate nature and as a way for humans to express their emotions & connect with Him. Crying is often wrongly perceived as a sign of weak"
    },
    {
      "type": "scripture",
      "value": "Psalms 56:8. You keep track of all my sorrows. You have collected all my tears in your bottle. You have recorded each one in your book."
    },
    {
      "type": "mainText",
      "value": "Don'\''t think that when you shed your tears in pain, no one knows or no one values you or no one can help you out. This verse signifies that God keeps track of our sorrows and doesn'\''t overlook our tears. God is aware of every tear we shed and remembers every sorrow we experience. So trust him; everything he works for is for our good. If God makes you cry, there is a purpose for your tears. Emotions are the language of our heart; faith is the language of God. Don'\''t let your em"
    },
    {
      "type": "scripture",
      "value": "He will wipe every tear from their eyes. (Revelation 21:4)."
    },
    {
      "type": "mainText",
      "value": "New things and blessings are coming ahead ... So embrace tears as part of your life journey."
    },
    {
      "type": "reflection",
      "value": "Think What does it mean to you that God is aware of every tear you cry? & Think about the ways how you can build your faith in God'\''s mainTexts during your hard times."
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;