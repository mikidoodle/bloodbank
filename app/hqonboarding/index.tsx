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
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../../assets/styles/styles'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
export default function Onboarding() {
    let [loginCode, setLoginCode] = useState<string>('')
    let [loginProcess, setLoginProcess] = useState<boolean>(false)
    useEffect(()=>{
        SecureStore.getItemAsync('token').then((token) => {
            if (token) {
                console.log(token)
                router.push('/hq')
            }
        })
    })
    function login() {
        setLoginProcess(true)
        fetch(`http://192.168.1.24:3000/hq/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loginCode: loginCode,
            }),
        })
            .then((response) => response.json())
            .then(async (response) => {
                setLoginProcess(false)
                if (response.error) {
                    alert(response.message)
                } else {
                    alert(response.message)
                    await SecureStore.setItemAsync('token', 'hq-'+response.token)
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
                    JIPMER <Text style={{ color: '#7469B6' }}>Blood Center</Text>
                </Text>
                <View style={{ marginTop: 20 }}>
                    <Text style={{
                        fontSize: 16,
                        color: '#7469B6',
                        textAlign: 'center',
                    }}>Login Code</Text>
                    <TextInput
                        placeholder="login code"
                        autoComplete="off"
                        secureTextEntry={true}
                        value={loginCode}
                        onChangeText={setLoginCode}
                        style={styles.input}
                    />
                </View>
                <Button onPress={login} disabled={loginProcess}>
                    {loginProcess ? 'Logging in...' : 'Login'}
                </Button>
                <Pressable
                    onPress={() => {
                        router.push('/')
                    }}
                    style={{ marginTop: 20 }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: '#7469B6',
                        }}
                    >
                        Donor Log In
                    </Text>
                </Pressable>
            </SafeAreaView>
            {/* </TouchableWithoutFeedback> */}
        </ScrollView>
    )
}
