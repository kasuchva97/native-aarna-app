export interface Profile {
  kidName?: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  language?: string;
  purpose?: string;
}

export const personalizeText = (text: string, profile: Profile | null): string => {
  if (!text || !profile) return text;
  let newText = text;

  // 1. Basic name substitutions
  if (profile.kidName) {
    newText = newText.replace(/Aarna/gi, profile.kidName);
    newText = newText.replace(/ఆర్న/g, profile.kidName);
  }
  if (profile.fatherName) {
    newText = newText.replace(/\bRam\b/gi, profile.fatherName);
    newText = newText.replace(/రామ్/g, profile.fatherName);
  }
  if (profile.motherName) {
    newText = newText.replace(/Lahari/gi, profile.motherName);
    newText = newText.replace(/లహరి/g, profile.motherName);
  }

  // 2. Gender-based pronoun corrections for boys
  if (profile.gender === 'boy') {
    // English pronouns
    newText = newText.replace(/\bShe\b/g, 'He');
    newText = newText.replace(/\bshe\b/g, 'he');
    newText = newText.replace(/\bHers\b/g, 'His');
    newText = newText.replace(/\bhers\b/g, 'his');

    // Handle "her" as object (him) vs possessive (his) using preceding contexts
    const objPrepositions = '(?:looked at|to|with|saw|met|helped|called|loved|made|hugged|gave|told|for|beside|near|around|from|behind|under)';
    const objRegex = new RegExp(`\\b(${objPrepositions})\\s+her\\b`, 'gi');
    newText = newText.replace(objRegex, '$1 him');

    // Remaining "her" tokens are possessive (his)
    newText = newText.replace(/\bHer\b/g, 'His');
    newText = newText.replace(/\bher\b/g, 'his');

    // Telugu pronouns & verbs
    newText = newText.replace(/ఆమెకు/g, 'అతడికి');
    newText = newText.replace(/ఆమెది/g, 'అతడిది');
    newText = newText.replace(/ఆమెను/g, 'అతడిని');
    newText = newText.replace(/ఆమెతో/g, 'అతడితో');
    newText = newText.replace(/ఆమె/g, 'అతడు');

    // Verb endings for past actions (she did -> he did)
    newText = newText.replace(/వెళ్ళింది/g, 'వెళ్ళాడు');
    newText = newText.replace(/చూసింది/g, 'చూశాడు');
    newText = newText.replace(/చేసింది/g, 'చేశాడు');
    newText = newText.replace(/తింది/g, 'తిన్నాడు');
  }

  return newText;
};

export interface Sentence {
  text: string;
  mood: string;
}

export const splitIntoSentences = (text: string, defaultMood: string = 'calm'): Sentence[] => {
  if (!text) return [];
  // Split by sentence terminators (. ! ?) followed by whitespace
  const rawSentences = text.split(/(?<=[.!?])\s+/);
  return rawSentences
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => ({
      text: s,
      mood: defaultMood
    }));
};

