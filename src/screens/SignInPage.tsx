import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthGoogle from '../components/AuthGoogle';

const SignInPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <AuthGoogle />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 32,
        marginBottom: 24,
    },
});

export default SignInPage; 