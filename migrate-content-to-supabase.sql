-- Complete migration script for all content from content.json to Supabase
-- Run this in your Supabase SQL Editor after the initial setup

-- First, let's add the "remember" page from your content.json
INSERT INTO pages (id, title_tamil, title_english, theme, content_tamil, content_english) 
VALUES 
(
  'remember',
  'நீங்கள் நினைவில் வைப்பீர்களா?',
  'WILL YOU REMEMBER?',
  'warm',
  '[
    {
      "type": "mainText",
      "value": "ஒவ்வொருவரும் தனித்துவமானவர்கள், திறமைகள், அறிவு, குணம், அனுபவம் மற்றும் அவர்களின் பழக்கவழக்கங்களின் அடிப்படையில் அவரவர் சொந்த அடையாளத்தை உருவாக்கியுள்ளனர். ஒரு இளம் தாயாக, என் மகனுக்கு நல்ல பழக்கங்களை வளர்ப்பதற்கு நான் பொறுப்பு. எனவே, நான் என்ன சிறந்தது, நான் என்ன செய்ய வேண்டும் என்பதை நான் கற்றுக்கொள்ள முயலுக்கிறேன்! பழக்கம் என்றால் என்ன? நீங்கள் தொடர்ந்து ஈடுபடும் எந்தவொரு நடத்தை அல்லது செயலும் ஒரு பழக்கமாகக் கருதப்படுகிறது, நீங்கள் எழுந்தவுடன் காபி குடிப்பது, பல் துலக்கு"
    },
    {
      "type": "scripture",
      "value": "நீதிமொழிகள் 3:6: உன் வழிகளிலெல்லாம் அவரை நினைத்துக்கொள்;"
    },
    {
      "type": "mainText",
      "value": "நீங்கள் செய்யும் எல்லாவற்றிலும், எல்லா இடங்களிலும், எல்லாவற்றிலும் கர்த்தரை உங்களுடன் அழைத்துச் செல்லுங்கள். நம் அனைவருக்கும் தேவன் தேவை, ஒரு நாளைக்கு ஒரு முறை அல்லது உங்கள் நாள் முழுவதும் உங்களுக்குத் தேவையான உதவியின் போது மட்டுமல்ல, நம் அனைவருக்கும் தேவன் தேவை. இந்த வசனம் நம் வாழ்க்கையின் ஒவ்வொரு அம்சத்திலும் கர்த்தரின் பிரசன்னத்தையும் வழிகாட்டுதலையும் ஒப்புக்கொள்ள நம்மை ஊக்குவிக்கிறது. கர்த்தரை நினைவுகூருவது தேவனுடனான நமது தொடர்பை ஆழப்படுத்துகிறது மற்றும் நம்பிக்கை, ஆறுத"
    },
    {
      "type": "reflection",
      "value": "உங்கள் வாழ்க்கையில் தேவனை அவருடைய பணியையும் நினைவில் கொள்ளுங்கள், ஏனெனில் அது இன்று உங்களுக்கு முக்கியமானது. \nஉங்களை நீங்களே ஆராய்ந்து பாராட்டிக் கொள்ளுங்கள்: இன்று நீங்கள் எத்தனை முறை இறைவனைப் பற்றி சிந்திக்கிறீர்கள்?"
    }
  ]'::jsonb,
  '[
    {
      "type": "mainText",
      "value": "Everyone is unique and has their own identity built based on skills, knowledge, character, experience, and their habits. As a new mom, I'\''m responsible for cultivating good habits for my son, so I'\''m just going through what is best and what I have to do So let'\''s all go through it together."
    },
    {
      "type": "mainText",
      "value": "What is a habit? Any behavior or action you engage in regularly counts as a habit, from having coffee as soon as you get up, brushing teeth, washing hands, keeping clean, not biting nails, etc. Some habits can promote physical and mental wellness, while others might have more of an unwanted impact on your everyday life. Among everything, Do you have a habit of praying for everything? I'\''m not good at that. Sometimes I do, sometimes I miss, or sometimes I just go in times of"
    },
    {
      "type": "scripture",
      "value": "Proverbs 3:6. In all your ways acknowledge him, and he will make straight your paths."
    },
    {
      "type": "mainText",
      "value": "In everything you do, everywhere you go, in everything, take the Lord with you. We all need God, not just once a day or only during the times when you need help throughout your day, but we all need God. This verse encourages us to acknowledge the Lord'\''s presence and guidance in every aspect of our lives. Remembering the Lord deepens our relationship with God and brings faith, comfort, and direction to our daily experiences. When we make it a habit to acknowledge God in all our ways, we invite His wisdom and blessing into every decision and action."
    },
    {
      "type": "reflection",
      "value": "Remember God and His work in your life because it matters to you today. \nExamine and appreciate yourself: How many times do you think about God today?"
    }
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title_tamil = EXCLUDED.title_tamil,
  title_english = EXCLUDED.title_english,
  theme = EXCLUDED.theme,
  content_tamil = EXCLUDED.content_tamil,
  content_english = EXCLUDED.content_english,
  updated_at = NOW();

-- Verify the data was inserted correctly
SELECT 
  id, 
  title_tamil, 
  title_english, 
  theme,
  jsonb_array_length(content_tamil) as tamil_content_items,
  jsonb_array_length(content_english) as english_content_items,
  published,
  created_at
FROM pages 
ORDER BY created_at DESC;