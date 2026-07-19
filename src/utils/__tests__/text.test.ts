import { personalizeText, splitIntoSentences } from '../text';
import { Profile } from '../../types';

describe('personalizeText', () => {
  it('returns original text if profile is null', () => {
    const text = 'Aarna went with Ram and Lahari.';
    expect(personalizeText(text, null)).toBe(text);
  });

  it('personalizes names for a girl profile', () => {
    const profile: Profile = {
      kidName: 'Sita',
      fatherName: 'Janaka',
      motherName: 'Sunayana',
      gender: 'girl',
    };
    const text = 'Aarna went with Ram and Lahari. She loved her family.';
    // For a girl, pronouns should remain female, only names swap.
    expect(personalizeText(text, profile)).toBe('Sita went with Janaka and Sunayana. She loved her family.');
  });

  it('personalizes names and swaps English pronouns for a boy profile', () => {
    const profile: Profile = {
      kidName: 'Abhi',
      fatherName: 'Krishna',
      motherName: 'Radha',
      gender: 'boy',
    };
    const text = 'Aarna went to the forest. She saw a tiger. It was her favorite animal. The tiger looked at her. This book is hers.';
    // Aarna -> Abhi
    // She -> He (case-insensitive and keeping case)
    // she -> he
    // her -> his / him (we will map basic patterns: "her favorite" -> "his favorite", "looked at her" -> "looked at him")
    // hers -> his
    const result = personalizeText(text, profile);
    expect(result).toContain('Abhi went to the forest.');
    expect(result).toContain('He saw a tiger.');
    expect(result).toContain('It was his favorite animal.');
    expect(result).toContain('The tiger looked at him.');
    expect(result).toContain('This book is his.');
  });

  it('personalizes Telugu names and pronouns for a boy profile', () => {
    const profile: Profile = {
      kidName: 'అభి',
      fatherName: 'కృష్ణ',
      motherName: 'రాధ',
      gender: 'boy',
    };
    const text = 'ఆర్న అడవికి వెళ్ళింది. ఆమె ఒక సింహాన్ని చూసింది. అది ఆమెకు సహాయం చేసింది. అది ఆమెది.';
    // ఆర్న -> అభి
    // ఆమె -> అతడు
    // ఆమెకు -> అతడికి
    // ఆమెది -> అతడిది
    // ఆమెను -> అతడిని
    // వెళ్ళింది -> వెళ్ళాడు (verb agreement for boy)
    const result = personalizeText(text, profile);
    expect(result).toContain('అభి అడవికి వెళ్ళాడు.');
    expect(result).toContain('అతడు ఒక సింహాన్ని చూశాడు.');
    expect(result).toContain('అది అతడికి సహాయం చేశాడు.');
    expect(result).toContain('అది అతడిది.');
  });
});

describe('splitIntoSentences', () => {
  it('splits text correctly into sentences', () => {
    const text = 'This is the first sentence. Is this the second one? Yes, it is!';
    const result = splitIntoSentences(text, 'excited');
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ text: 'This is the first sentence.', mood: 'excited' });
    expect(result[1]).toEqual({ text: 'Is this the second one?', mood: 'excited' });
    expect(result[2]).toEqual({ text: 'Yes, it is!', mood: 'excited' });
  });

  it('handles empty text', () => {
    expect(splitIntoSentences('')).toEqual([]);
    expect(splitIntoSentences(null as any)).toEqual([]);
  });
});
