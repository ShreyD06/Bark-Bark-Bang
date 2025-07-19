import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
  } from 'react-native';

import React, { useState } from 'react';

import { useUser } from './hooks/useUser'

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { user, register } = useUser()

    console.log("USERID")
    console.log(user["$id"])


    const handleSubmit = async () => {
        try {
            await register(email, password)
        } catch (error) {

        }
    }

    return (
            // <UserProvider>
                <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.formContainer}>
                    <Text style={styles.title}>Register</Text>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        />
                    </View>
            
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        />
                    </View>
            
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Register</Text>
                    </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                </SafeAreaView>
            // </UserProvider>
        );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    formContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 40,
      color: '#333',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: '#333',
    },
    input: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: '#333',
    },
    submitButton: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 14,
      marginTop: 20,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
  });

  export default Register