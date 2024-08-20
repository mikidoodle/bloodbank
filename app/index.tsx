import {
    Keyboard,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../assets/styles/styles'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
export default function Index() {
    let [phoneNumber, setPhoneNumber] = useState<string>('')
    let [password, setPassword] = useState<string>('')
    let [loginProcess, setLoginProcess] = useState<boolean>(false)
    function login() {
        setLoginProcess(true)
        fetch(`http://localhost:3000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber,
                password,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                setLoginProcess(false)
                alert(JSON.stringify(response))
                if (response.error) {
                    alert(response.error)
                } else {
                    SecureStore.setItemAsync('token', response.token)
                }
            })
            .catch((error) => {
                setLoginProcess(false)
                alert(error)
            })
    }
    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss()
                }}
            > */}
            <SafeAreaView>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    JIPMER <Text style={{ color: '#7469B6' }}>Blood Bank</Text>
                </Text>
                <View style={{ marginTop: 20 }}>
                    <TextInput
                        placeholder="phone number"
                        autoComplete="tel"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="password"
                        autoComplete="off"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />
                </View>
                <Button onPress={login} disabled={loginProcess}>
                    {loginProcess ? 'Logging in...' : 'Login'}
                </Button>
                <Pressable onPress={()=>{
                    router.push('/signup')
                }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: '#7469B6',
                        }}
                    >
                        Don't have an account? Sign up.
                    </Text>
                </Pressable>
            </SafeAreaView>
            {/* </TouchableWithoutFeedback> */}
        </ScrollView>
    )
}
