import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import { UserProvider } from './contexts/UserContext'

const RootLayout = () => {
  return (
    <UserProvider>
        <View style={{ flex: 1 }}>
            <Stack />
            <Text>Footer</Text>
        </View>
    </UserProvider>

  )
}

export default RootLayout

const styles = StyleSheet.create({})