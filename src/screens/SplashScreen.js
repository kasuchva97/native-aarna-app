import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

const SplashScreen = ({ navigation, onComplete }) => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            onComplete(navigation);
        }, 2100);

        return () => clearTimeout(timer);
    }, [onComplete, navigation]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Image
                    source={require('../../assets/logo512.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Storybook</Text>
            </Animated.View>
            <View style={styles.loaderContainer}>
                <View style={styles.dot} />
                <View style={[styles.dot, { marginHorizontal: 10 }]} />
                <View style={styles.dot} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9333ea', // Purple-600 equivalent
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 20,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
    },
    loaderContainer: {
        position: 'absolute',
        bottom: 60,
        flexDirection: 'row',
    },
    dot: {
        width: 10,
        height: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
});

export default SplashScreen;
