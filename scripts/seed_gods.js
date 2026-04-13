const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jypkofybplnhmalovbsd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtvZnlicGxuaG1hbG92YnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODg4NDAsImV4cCI6MjA4Nzg2NDg0MH0.6hSJnG28OfXmgfgnznGoORzOgW1aite4SkSsRlzoEik';

const supabase = createClient(supabaseUrl, supabaseKey);

const gods = [
  { id: 'krishna', name: 'Krishna', image: 'https://images.unsplash.com/photo-1641730259879-ad98e7db7bcb', emoji: '🦚' },
  { id: 'hanuman', name: 'Hanuman', image: 'https://images.unsplash.com/photo-1730191567375-e82ce67160df', emoji: '🐒' },
  { id: 'ganesha', name: 'Ganesha', image: 'https://images.unsplash.com/photo-1567591391293-f9a99c77e128', emoji: '🐘' },
  { id: 'rama', name: 'Rama', image: 'https://images.unsplash.com/photo-1609309783328-b2fcbf559d14', emoji: '🏹' },
  { id: 'shiva', name: 'Shiva', image: 'https://images.unsplash.com/photo-1566890910598-c5768889e83e', emoji: '🔱' },
  { id: 'durga', name: 'Durga', image: 'https://images.pexels.com/photos/2969469/pexels-photo-2969469.jpeg', emoji: '👑' },
  { id: 'lakshmi', name: 'Lakshmi', image: 'https://images.pexels.com/photos/12428566/pexels-photo-12428566.jpeg', emoji: '🪷' },
  { id: 'saraswati', name: 'Saraswati', image: 'https://images.pexels.com/photos/16354577/pexels-photo-16354577.jpeg', emoji: '🎼' },
];

async function seed() {
  console.log('Starting seed...');
  const { data, error } = await supabase.from('gods').upsert(gods);
  
  if (error) {
    console.error('Error seeding gods:', error);
  } else {
    console.log('Successfully seeded gods table.');
  }
}

seed();
