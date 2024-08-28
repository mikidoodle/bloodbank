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
import styles from '@/assets/styles/styles'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
export default function Index() {
    let [phoneNumber, setPhoneNumber] = useState<string>('')
    let [password, setPassword] = useState<string>('')
    let [loginProcess, setLoginProcess] = useState<boolean>(false)
    let [otp, setOtp] = useState<string>('')
    let [newUserOTP, setNewUserOTP] = useState<string>('')
    let [allowOTP, setAllowOTP] = useState<boolean>(false)
    let [newUser, setNewUser] = useState<boolean>(false)
    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            if (token) {
                if (token.startsWith('hq-')) {
                    router.push('/hq')
                } else {
                    console.log(token)
                    router.push('/user')
                }
            }
        })
    })
    async function login() {
        if (newUser) {
            console.log(otp)
            console.log(newUserOTP)
            if (parseInt(otp) === parseInt(newUserOTP)) {
                let storePhoneLocally = await SecureStore.setItemAsync('userSignupPhone', phoneNumber)
                router.push('/signup')
            } else {
                alert('Invalid OTP')
            }
            return
        }
        console.log(otp)
        setLoginProcess(true)
        fetch(`http://localhost:3000/sendOTP`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                /*phonenumber: phoneNumber,
                password: password,*/
                phone: phoneNumber,
                allowSignup: true,
                intentVerifyOTPlogin: allowOTP,
                userEnteredOTP: allowOTP ? otp : null,
            }),
        })
            .then((response) => response.json())
            .then(async (response) => {
                setLoginProcess(false)
                if (response.error) {
                    alert(response.message)
                } else {
                    //alert(response.message)
                    if (response.otpSent) {
                        setAllowOTP(true)
                    } else if (response.otp) {
                        setAllowOTP(true)
                        setNewUser(true)
                        setNewUserOTP(response.otp)
                        console.log(response.otp)
                        console.log('new user')
                    } else if (response.uuid) {
                        await SecureStore.setItemAsync('token', response.uuid)
                    }
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
                    JIPMER{' '}
                    <Text style={{ color: '#7469B6' }}>Blood Center</Text>
                </Text>
                <View style={{ marginTop: 20 }}>
                    <TextInput
                        placeholder="phone number"
                        autoComplete="tel"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={{
                            ...styles.input,
                            color: newUser || allowOTP ? 'grey' : 'black',
                        }}
                        editable={!loginProcess && (!newUser || !allowOTP)}
                    />
                    {allowOTP ? (
                        <>
                            <Pressable
                                onPress={() => {
                                    //let the user input a new phone number
                                    setAllowOTP(false)
                                    setNewUser(false)
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontSize: 16,
                                        color: '#7469B6',
                                        
                                    }}
                                >
                                    Try a different number
                                </Text>
                            </Pressable>
                            <TextInput
                                placeholder="enter OTP"
                                autoComplete="off"
                                secureTextEntry={false}
                                value={otp}
                                onChangeText={setOtp}
                                style={styles.input}
                            />
                        </>
                    ) : null}
                </View>
                <Button onPress={login} disabled={loginProcess}>
                    {loginProcess
                        ? newUser
                            ? 'Verifying...'
                            : 'Loading...'
                        : 'Continue'}
                </Button>
                {/*<Pressable
                    onPress={() => {
                        router.push('/signup')
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
                        Sign up
                    </Text>
                </Pressable>*/}
                <Pressable
                    onPress={() => {
                        router.push('/hqonboarding')
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
                        Blood Center login
                    </Text>
                </Pressable>
            </SafeAreaView>
            {/* </TouchableWithoutFeedback> */}
        </ScrollView>
    )
}
