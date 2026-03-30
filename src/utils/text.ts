export interface Profile {
    kidName?: string;
    fatherName?: string;
    motherName?: string;
}

export const personalizeText = (text: string, profile: Profile | null): string => {
    if (!text || !profile) return text;
    let newText = text;
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
    return newText;
};
