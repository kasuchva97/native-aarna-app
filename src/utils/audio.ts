import Tts from 'react-native-tts';

export const speakText = async (text: string, lang = 'te-IN') => {
    try {
        // Stop any ongoing speech
        await Tts.stop();

        // Configure speed/pitch
        await Tts.setDefaultRate(0.5); // Slightly slower for kids
        await Tts.setDefaultPitch(1.2); // Cheerful pitch

        // Request specific language
        await Tts.setDefaultLanguage(lang);

        Tts.speak(text);
        return true;
    } catch (error) {
        console.error('[TTS Error]', error);
        return false;
    }
};

export const stopSpeech = () => {
    Tts.stop();
};
