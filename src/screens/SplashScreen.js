import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Tts from 'react-native-tts';

const { width } = Dimensions.get('window');

const TITLE_LETTERS = ['B', 'a', 'l', 'a', 'K', 'a', 't', 'h', 'a'];

const SplashScreen = ({ navigation, onComplete }) => {
  // 1. Logo Assembly & Formation animations
  const ringRotate1 = useRef(new Animated.Value(0)).current;
  const ringRotate2 = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(2.2)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // 2. Letter-by-letter title animation array
  const letterAnims = useRef(TITLE_LETTERS.map(() => new Animated.Value(0))).current;

  // 3. Tagline & Orbs animations
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineScale = useRef(new Animated.Value(0.8)).current;
  const orbScale = useRef(new Animated.Value(0.7)).current;

  // 4. Staggered loading dots wave loop
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    // --- Sound Effect via TTS ---
    const triggerAudioEffect = async () => {
      try {
        await Tts.getInitStatus();
        await Tts.setDefaultRate(0.52);
        await Tts.setDefaultPitch(1.25);
        if (isMounted) {
          Tts.speak('Welcome to BalaKatha');
        }
      } catch (e) {
        console.log('SplashScreen sound note:', e);
      }
    };

    // --- Step 1: Converging Rings & Logo Formation ---
    Animated.parallel([
      Animated.timing(ringRotate1, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ringRotate2, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ringScale, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
      Animated.timing(orbScale, {
        toValue: 1.25,
        duration: 3000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // --- Step 2: Snap Logo Into Place with Flash Flare ---
    setTimeout(() => {
      if (!isMounted) return;
      Animated.parallel([
        Animated.timing(flashOpacity, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Fade out flash flare quickly
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });

      // Play welcome audio chime/speech right as logo locks into place
      triggerAudioEffect();
    }, 600);

    // --- Step 3: Letter-by-Letter Title Reveal ---
    setTimeout(() => {
      if (!isMounted) return;
      Animated.stagger(
        65,
        letterAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            friction: 6,
            tension: 60,
            useNativeDriver: true,
          })
        )
      ).start();
    }, 1000);

    // --- Step 4: Tagline Entrance ---
    setTimeout(() => {
      if (!isMounted) return;
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(taglineScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1700);

    // --- Continuous Floating Animation for Logo Assembly ---
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    // --- Staggered Loading Dots Wave Loop ---
    const createDotAnim = (dotVal, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotVal, {
            toValue: -9,
            duration: 350,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dotVal, {
            toValue: 0,
            duration: 350,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(500),
        ])
      );
    };

    const d1 = createDotAnim(dot1, 0);
    const d2 = createDotAnim(dot2, 150);
    const d3 = createDotAnim(dot3, 300);

    d1.start();
    d2.start();
    d3.start();

    // --- Complete Timer ---
    const timer = setTimeout(() => {
      onComplete(navigation);
    }, 3400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      floatLoop.stop();
      d1.stop();
      d2.stop();
      d3.stop();
      try {
        Tts.stop();
      } catch (err) {}
    };
  }, [onComplete, navigation, ringRotate1, ringRotate2, ringScale, logoScale, logoOpacity, flashOpacity, orbScale, taglineOpacity, taglineScale, floatAnim, dot1, dot2, dot3, letterAnims]);

  // Interpolations for ring rotations
  const spin1 = ringRotate1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin2 = ringRotate2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <LinearGradient
      colors={['#1e1b4b', '#3b0764', '#581c87', '#7e22ce']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative Background Ambient Orbs */}
      <Animated.View
        style={[
          styles.orbBackground,
          styles.orb1,
          { transform: [{ scale: orbScale }] },
        ]}
      />
      <Animated.View
        style={[
          styles.orbBackground,
          styles.orb2,
          { transform: [{ scale: orbScale }] },
        ]}
      />

      {/* Main Content Area */}
      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateY: floatAnim }] },
        ]}
      >
        {/* LOGO ASSEMBLY CONTAINER */}
        <View style={styles.logoAssemblyWrapper}>
          {/* Rotating Outer Assembly Ring 1 */}
          <Animated.View
            style={[
              styles.assemblyRing,
              styles.ringOuter,
              {
                transform: [
                  { scale: ringScale },
                  { rotate: spin1 },
                ],
              },
            ]}
          />

          {/* Rotating Outer Assembly Ring 2 */}
          <Animated.View
            style={[
              styles.assemblyRing,
              styles.ringInner,
              {
                transform: [
                  { scale: ringScale },
                  { rotate: spin2 },
                ],
              },
            ]}
          />

          {/* Flash Flare Effect when formed */}
          <Animated.View
            style={[
              styles.flashFlare,
              { opacity: flashOpacity },
            ]}
          />

          {/* Actual Formed Logo */}
          <Animated.View
            style={[
              styles.logoFrame,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={require('../../assets/logo512.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </Animated.View>
        </View>

        {/* LETTER-BY-LETTER TITLE ANIMATION */}
        <View style={styles.titleContainer}>
          {TITLE_LETTERS.map((letter, index) => {
            const letterAnim = letterAnims[index];
            const translateY = letterAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            });
            const scale = letterAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 1],
            });

            const isCapital = letter === 'B' || letter === 'K';

            return (
              <Animated.Text
                key={index}
                style={[
                  styles.titleLetter,
                  isCapital && styles.capitalLetter,
                  {
                    opacity: letterAnim,
                    transform: [{ translateY }, { scale }],
                  },
                ]}
              >
                {letter}
              </Animated.Text>
            );
          })}
        </View>

        {/* TAGLINE BADGE */}
        <Animated.View
          style={[
            styles.badgeContainer,
            {
              opacity: taglineOpacity,
              transform: [{ scale: taglineScale }],
            },
          ]}
        >
          <Text style={styles.tagline}>Stories, Wisdom & Magic ✨</Text>
        </Animated.View>
      </Animated.View>

      {/* MODERN WAVE LOADING DOTS */}
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot1 }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot2 }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot3 }] }]}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  orbBackground: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  orb1: {
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: '#c084fc',
    top: -width * 0.2,
    right: -width * 0.2,
  },
  orb2: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#ec4899',
    bottom: -width * 0.2,
    left: -width * 0.2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoAssemblyWrapper: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  assemblyRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  ringOuter: {
    width: 165,
    height: 165,
    borderColor: '#c084fc',
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  ringInner: {
    width: 152,
    height: 152,
    borderColor: '#f472b6',
    borderWidth: 2.5,
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  flashFlare: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  logoFrame: {
    padding: 6,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 28,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleLetter: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
    textShadowColor: 'rgba(168, 85, 247, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  capitalLetter: {
    color: '#fef08a', // Gold highlight for B and K
    fontSize: 42,
  },
  badgeContainer: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  tagline: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f3e8ff',
    letterSpacing: 0.5,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#f472b6',
    borderRadius: 5,
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default SplashScreen;
