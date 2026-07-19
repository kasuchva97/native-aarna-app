const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Zero-dependency loader for root .env variables
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const firstEqual = trimmed.indexOf('=');
          if (firstEqual !== -1) {
            const key = trimmed.substring(0, firstEqual).trim();
            const value = trimmed.substring(firstEqual + 1).trim().replace(/^['"]|['"]$/g, '');
            process.env[key] = value;
          }
        }
      });
    }
  } catch (err) {
    console.warn('Warning: Could not read .env file', err.message);
  }
}
loadEnv();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: SUPABASE_URL or SUPABASE_ANON_KEY is missing from .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read Gemini API Key from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Definition of 48 stories to generate
const storiesToGenerate = [
  // --- Mythology Categories ---
  { category: 'krishna', theme: 'Krishna and Butter Theft', prompt: 'A story about little Krishna stealing butter from gopikas in Vrindavan and his mother Yashoda catching him.' },
  { category: 'krishna', theme: 'Krishna Lifting Govardhan Hill', prompt: 'Krishna lifting the Govardhan hill on his little finger to protect villagers from torrential rain sent by Indra.' },
  { category: 'krishna', theme: 'Krishna and Kaliya Snake', prompt: 'Krishna subduing the multi-headed venomous serpent Kaliya in the Yamuna River.' },
  { category: 'krishna', theme: 'Krishna and Sudama', prompt: 'The beautiful friendship between poor Sudama and King Krishna, showing true devotion.' },
  
  { category: 'hanuman', theme: 'Hanuman Swallowing the Sun', prompt: 'Baby Hanuman mistaking the sun for a ripe mango and flying to swallow it.' },
  { category: 'hanuman', theme: 'Hanuman and Sanjeevani Hill', prompt: 'Hanuman carrying the entire Sanjeevani mountain when he could not identify the life-saving herb.' },
  { category: 'hanuman', theme: 'Hanuman Crossing the Ocean', prompt: 'Hanuman leaping across the massive ocean to reach Lanka in search of Sita.' },
  { category: 'hanuman', theme: 'Hanuman Devotion to Rama', prompt: 'Hanuman tearing his chest open to reveal Rama and Sita residing in his heart.' },

  { category: 'ganesha', theme: 'Ganesha and the Mango Challenge', prompt: 'Ganesha winning the divine mango from Shiva and Parvati by circling his parents instead of the universe.' },
  { category: 'ganesha', theme: 'Ganesha and the Moon Laughter', prompt: 'Ganesha cursing the moon for laughing at him when he tripped after eating modaks.' },
  { category: 'ganesha', theme: 'Ganesha Writing Mahabharata', prompt: 'Ganesha breaking his tusk to write the epic Mahabharata dictated by Sage Vyasa.' },
  
  { category: 'rama', theme: 'Rama and Squirrel Contribution', prompt: 'Lord Rama thanking and petting a little squirrel that helped build the Rama Setu bridge by rolling in sand.' },
  { category: 'rama', theme: 'Rama Breaking the Bow', prompt: 'Rama breaking the heavy bow of Shiva at Sita\'s Swayamvara in Mithila.' },
  { category: 'rama', theme: 'Rama Helping Vishwamitra', prompt: 'Young Rama and Lakshmana protecting sage Vishwamitra\'s yagna from demons.' },

  { category: 'shiva', theme: 'Shiva and the Poison (Neelakantha)', prompt: 'Lord Shiva drinking the Halahala poison during Samudra Manthan to save the universe.' },
  { category: 'shiva', theme: 'Shiva Ganga Descent', prompt: 'Shiva catching the wild river Ganga in his matted locks to break her fall to Earth.' },
  { category: 'shiva', theme: 'Shiva and Markandeya', prompt: 'Shiva saving his young devotee Markandeya from Yama, the god of death.' },

  { category: 'durga', theme: 'Durga Defeating Mahishasura', prompt: 'Goddess Durga battles and defeats the shapeshifting buffalo demon Mahishasura.' },
  { category: 'lakshmi', theme: 'Lakshmi Birth from Ocean', prompt: 'Goddess Lakshmi rising from the ocean of milk during Samudra Manthan.' },
  { category: 'saraswati', theme: 'Saraswati and the Veena', prompt: 'Goddess Saraswati creating music and wisdom using her Veena.' },

  // --- Moral Categories ---
  { category: 'panchatantra', theme: 'The Monkey and the Crocodile', prompt: 'A story of a clever monkey who saves himself from a crocodile wanting to eat his heart.' },
  { category: 'panchatantra', theme: 'The Blue Jackal', prompt: 'A jackal falls into a vat of blue dye and pretends to be the king of the forest until he howls.' },
  { category: 'panchatantra', theme: 'The Tortoise and the Geese', prompt: 'A talkative tortoise falls to his death because he opened his mouth while flying with geese.' },
  { category: 'panchatantra', theme: 'The Lion and the Clever Rabbit', prompt: 'A small rabbit tricks a cruel lion into jumping into a deep well by showing his reflection.' },

  { category: 'animal-fables', theme: 'The Ant and the Grasshopper', prompt: 'A hardworking ant stores food for winter while a lazy grasshopper sings all summer.' },
  { category: 'animal-fables', theme: 'The Crow and the Pitcher', prompt: 'A thirsty crow drops pebbles into a pitcher to raise the water level and drink.' },
  { category: 'animal-fables', theme: 'The Hare and the Tortoise', prompt: 'A slow and steady tortoise wins a race against a fast but overconfident hare.' },
  { category: 'animal-fables', theme: 'The Lion and the Mouse', prompt: 'A tiny mouse saves a mighty lion caught in a hunter\'s net by chewing the ropes.' },

  { category: 'classic-moral', theme: 'The Boy Who Cried Wolf', prompt: 'A shepherd boy repeatedly tricks villagers about a wolf until a real wolf comes and no one believes him.' },
  { category: 'classic-moral', theme: 'The Honest Woodcutter', prompt: 'A woodcutter loses his iron axe in a river, and a river goddess tests his honesty with gold and silver axes.' },
  { category: 'classic-moral', theme: 'The Golden Touch of Midas', prompt: 'King Midas wishes that everything he touches turns to gold, which becomes a curse when he touches his daughter.' },

  { category: 'friendship-stories', theme: 'The Four Friends', prompt: 'A deer, a crow, a mole, and a tortoise team up to rescue each other from a hunter.' },
  { category: 'friendship-stories', theme: 'Two Friends and the Bear', prompt: 'Two friends encounter a bear; one climbs a tree and the other plays dead, learning who a true friend is.' },

  { category: 'kindness-stories', theme: 'King Shibi and the Pigeon', prompt: 'King Shibi offers his own flesh to save a chased pigeon from a hawk, showing absolute kindness.' },
  { category: 'kindness-stories', theme: 'The Generous Tree', prompt: 'A loving tree gives everything it has to a boy throughout his life until it is just a stump.' },

  // --- History Categories ---
  { category: 'ramayana', theme: 'Lakshmana Rekha', prompt: 'Lakshmana draws a protective line around the hut for Sita\'s safety, which she crosses to give alms.' },
  { category: 'ramayana', theme: 'The Golden Deer', prompt: 'Sita gets fascinated by a golden deer, sending Rama to capture it, leading to Ravana\'s trap.' },
  { category: 'ramayana', theme: 'Sita Swayamvara', prompt: 'Rama breaks Shiva\'s bow to win Sita\'s hand in marriage.' },

  { category: 'mahabharata', theme: 'Eklavya Devotion', prompt: 'Eklavya practices archery in front of Drona\'s statue and willingly gives his thumb as Guru Dakshina.' },
  { category: 'mahabharata', theme: 'Arjuna Eye Target', prompt: 'Guru Drona asks the Pandavas and Kauravas to aim at a wooden bird\'s eye; only Arjuna sees only the eye.' },
  { category: 'mahabharata', theme: 'Krishna Peace Mission', prompt: 'Krishna visits Hastinapur to offer peace to Duryodhana, who tries to capture him, revealing his cosmic form.' },

  // --- Aarna\'s Adventures (Kid name personalization templates) ---
  { category: 'aarna-adventures', theme: 'Aarna Magical Forest Walk', prompt: 'Aarna, Ram, and Lahari find a magical forest where flowers sing and butterflies guide them to a treasure.' },
  { category: 'aarna-adventures', theme: 'Aarna and Speaking Parrot', prompt: 'Aarna meets a colorful speaking parrot who teaches her the magic words of politeness.' },
  { category: 'aarna-adventures', theme: 'Aarna Space Balloon', prompt: 'Aarna goes on a hot-air balloon ride with Ram and Lahari and flies high up into the starry space.' },
  { category: 'aarna-adventures', theme: 'Aarna Secret Garden', prompt: 'Aarna finds a key under a bush and unlocks a secret garden filled with sweet fruits and magic trees.' },
  { category: 'aarna-adventures', theme: 'Aarna Friendly Cloud', prompt: 'Aarna meets a little fluffy cloud that carries her and her parents over rivers and mountains.' },
];

async function generateStoryWithGemini(storyInfo) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  const prompt = `Write a children's story based on this theme: "${storyInfo.theme}". 
Details: ${storyInfo.prompt}.
Generate exactly 8 to 10 slides.
Ensure the story features "Aarna" as the child character, "Ram" as the father, and "Lahari" as the mother (these will be replaced dynamically later by the app).
For each slide, provide:
1. "telugu": A clear, engaging children's narration in Telugu.
2. "english": A matching children's narration in English.
3. "imagePrompt": A highly detailed prompt describing a cute, Pixar-style 3D illustration representing the scene on this slide. The prompt must describe the actions of Aarna (a cute 5-year-old Indian girl) and the scenery consistently.
4. "teluguSentences": Break down the "telugu" narration of this slide into separate sentences. Tag each sentence with its mood.
5. "englishSentences": Break down the "english" narration of this slide into separate sentences. Tag each sentence with its mood.

Valid moods: calm, excited, sad, suspense, curious, happy.

At the end of the story, provide a "quiz" of 3 multiple-choice questions testing reading comprehension. Each question must be bilingual:
- "question": "Question in English / ప్రశ్నా తెలుగులో"
- "options": ["Option A Eng / ఆప్షన్ ఎ తెలుగు", "Option B Eng / ఆప్షన్ బి తెలుగు", "Option C Eng / ఆప్షన్ సి తెలుగు"]
- "correctAnswerIndex": Integer from 0 to 2

Format the response as a single valid JSON object following this schema:
{
  "title": "Story Title",
  "description": "Short 1-2 sentence summary of the story",
  "category": "${storyInfo.category}",
  "slides": [
    {
      "telugu": "...",
      "english": "...",
      "imagePrompt": "...",
      "teluguSentences": [
        { "text": "Sentence text in Telugu", "mood": "mood_name" }
      ],
      "englishSentences": [
        { "text": "Sentence text in English", "mood": "mood_name" }
      ]
    }
  ],
  "quiz": [
    {
      "question": "...",
      "options": ["...", "...", "..."],
      "correctAnswerIndex": 0
    }
  ]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          category: { type: 'STRING' },
          slides: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                telugu: { type: 'STRING' },
                english: { type: 'STRING' },
                imagePrompt: { type: 'STRING' },
                teluguSentences: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      text: { type: 'STRING' },
                      mood: { type: 'STRING', enum: ['calm', 'excited', 'sad', 'suspense', 'curious', 'happy'] }
                    },
                    required: ['text', 'mood']
                  }
                },
                englishSentences: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      text: { type: 'STRING' },
                      mood: { type: 'STRING', enum: ['calm', 'excited', 'sad', 'suspense', 'curious', 'happy'] }
                    },
                    required: ['text', 'mood']
                  }
                }
              },
              required: ['telugu', 'english', 'imagePrompt', 'teluguSentences', 'englishSentences']
            }
          },
          quiz: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                question: { type: 'STRING' },
                options: {
                  type: 'ARRAY',
                  items: { type: 'STRING' }
                },
                correctAnswerIndex: { type: 'INTEGER' }
              },
              required: ['question', 'options', 'correctAnswerIndex']
            }
          }
        },
        required: ['title', 'description', 'category', 'slides', 'quiz']
      }
    }
  });

  const contentText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!contentText) {
    throw new Error('Empty response from Gemini API.');
  }

  return JSON.parse(contentText);
}

const themeToExistingIds = {
  'Krishna and Butter Theft': ['8daad6d8-6abc-4b3e-ad53-a8750d86e0a1', 'krishna-butter-adventure'],
  'Krishna Lifting Govardhan Hill': ['9478ea9a-4fab-4a75-9a5c-ca962e3736b0', 'krishna-govardhan-lift'],
  'Krishna and Kaliya Snake': ['265841c0-c307-4575-b52c-970f7ec977f7'],
  'Krishna and Sudama': ['70b0e257-d9eb-4524-996d-e77a2495cf46'],
  'Hanuman Swallowing the Sun': ['1ec62985-8114-4132-8801-e804693a2e50'],
  'Hanuman and Sanjeevani Hill': ['b87516d3-8f57-4c5a-bdbe-c2c94c13daad'],
  'Hanuman Crossing the Ocean': ['ee7c49cb-c43e-4af7-bda1-5d497ed3ed85'],
  'Hanuman Devotion to Rama': ['280b856a-2cf8-49b1-b521-767160ba45d7'],
  'Ganesha and the Mango Challenge': ['28f5e8c9-51b2-49ba-8962-a1c5d43f2725'],
  'Ganesha and the Moon Laughter': ['9c344aff-af7e-420d-8a41-e076124474c6'],
  'Ganesha Writing Mahabharata': ['59e26d26-56a7-4f48-8295-4caec6c3b9ce'],
  'Rama and Squirrel Contribution': ['665ec6e1-1da3-4d77-abab-941dfd811234'],
  'Rama Breaking the Bow': ['220fdfb2-495c-40c1-90d4-56c42b8861a1'],
  'Rama Helping Vishwamitra': ['2cc060e2-b1c7-4d2c-a4e8-9477653f39e7'],
  'Shiva and the Poison (Neelakantha)': ['d31f2031-ba20-477e-a603-bafb789e3740'],
  'Shiva Ganga Descent': ['a224abe4-6f2e-4616-b519-761646bfa492'],
  'Shiva and Markandeya': ['ded58cb6-c455-45ea-9035-7bfab7ef9a75'],
  'Durga Defeating Mahishasura': ['55c3d943-8f4e-463c-956d-e968aa6329e5'],
  'The Monkey and the Crocodile': ['monkey-crocodile-trust'],
  'The Lion and the Mouse': ['lion-mouse-friendship'],
  'The Hare and the Tortoise': ['77ee1495-5e52-4219-8d64-e9cdcf0c5ac2', 'tortoise-hare-race'],
  'The Ant and the Grasshopper': ['05df887b-4711-4983-b383-d7f6f5d1bf81'],
  'Aarna Magical Forest Walk': ['aarna-magic-forest'],
  'Eklavya Devotion': ['arjuna-ekalavya'],
  'Aarna Friendly Cloud': ['aarna-flying-adventure']
};

async function start() {
  if (!GEMINI_API_KEY) {
    console.error('CRITICAL: Please set GEMINI_API_KEY in your environment before running this script.');
    process.exit(1);
  }

  console.log(`Starting generation script for ${storiesToGenerate.length} stories...`);

  for (let i = 0; i < storiesToGenerate.length; i++) {
    const storyInfo = storiesToGenerate[i];
    console.log(`[${i + 1}/${storiesToGenerate.length}] Seeding check: ${storyInfo.theme} (${storyInfo.category})...`);
    
    try {
      // 1. Check if a story for this theme has a mapped ID and if that ID exists in DB
      let alreadyExists = false;
      let existingId = null;
      const ids = themeToExistingIds[storyInfo.theme];
      if (ids && ids.length > 0) {
        const { data: existing, error: checkError } = await supabase
          .from('stories')
          .select('id')
          .in('id', ids)
          .limit(1);

        if (!checkError && existing && existing.length > 0) {
          alreadyExists = true;
          existingId = existing[0].id;
        }
      }

      // 2. Fallback to title search if not explicitly mapped
      if (!alreadyExists) {
        const { data: existing, error: checkError } = await supabase
          .from('stories')
          .select('id, title')
          .eq('category', storyInfo.category)
          .ilike('title', `%${storyInfo.theme.replace(/Aarna|Ram|Lahari/g, '').trim()}%`)
          .limit(1);

        if (!checkError && existing && existing.length > 0) {
          alreadyExists = true;
          existingId = existing[0].id;
        }
      }

      if (alreadyExists) {
        console.log(`- Story matching "${storyInfo.theme}" already exists (ID: ${existingId}). Skipping.`);
        continue;
      }

      // 3. Generate
      console.log(`  -> Generating content via Gemini...`);
      const generatedData = await generateStoryWithGemini(storyInfo);
      
      // 4. Insert into Supabase
      const crypto = require('crypto');
      const { data, error } = await supabase
        .from('stories')
        .insert([{
          id: crypto.randomUUID(),
          title: generatedData.title,
          description: generatedData.description,
          category: generatedData.category,
          slides: generatedData.slides,
          quiz: generatedData.quiz,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error(`  - Error inserting to Supabase:`, error.message);
      } else {
        console.log(`  - Successfully generated and saved: "${generatedData.title}"`);
      }
    } catch (e) {
      console.error(`  - Failed to process story "${storyInfo.theme}":`, e.message);
      
      const isRateLimit = e.message.includes('429') || e.message.includes('503') || 
                          (e.response && (e.response.status === 429 || e.response.status === 503));
                          
      if (isRateLimit) {
        console.log(`  -> Cooling down for 60 seconds due to API limits, then retrying...`);
        await new Promise(resolve => setTimeout(resolve, 60000));
        i--; // Decrement index to retry the same story
      }
    }
    
    // Pause for 4.5 seconds to comply with Gemini free tier rate limit
    await new Promise(resolve => setTimeout(resolve, 4500));
  }

  console.log('Story generation and seeding completed!');
}

start();

