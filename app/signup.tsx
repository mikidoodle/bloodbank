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
import { Picker } from '@react-native-picker/picker'
import Button from '@/components/Button'
import { Link } from 'expo-router'
export default function Signup() {
    let [phoneNumber, setPhoneNumber] = useState<string>('')
    let [password, setPassword] = useState<string>('')
    let [bloodtype, setBloodtype] = useState<
        'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
    >('A+')
    let [signupProcess, setSignupProcess] = useState<boolean>(false)
    function signup() {
        setSignupProcess(true)
        fetch(`http://localhost:3000/api/login`, {
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
                setSignupProcess(false)
                if (response.error) {
                    alert(response.error)
                } else {
                    SecureStore.setItemAsync('token', response.token)
                }
            })
            .catch((error) => {
                setSignupProcess(false)
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
                    <Text style={{ color: '#7469B6' }}>Sign up</Text>
                    {'\n'}
                    <Text style={{ fontSize: 18, color: 'gray' }}>
                        preliminary
                    </Text>
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
                    <Picker
                        selectedValue={bloodtype}
                        onValueChange={(itemValue, itemIndex) =>
                            setBloodtype(itemValue)
                        }
                    >
                        <Picker.Item label="A+" value="A+" />
                        <Picker.Item label="A-" value="A-" />
                        <Picker.Item label="B+" value="B+" />
                        <Picker.Item label="B-" value="B-" />
                        <Picker.Item label="AB+" value="AB+" />
                        <Picker.Item label="AB-" value="AB-" />
                        <Picker.Item label="O+" value="O+" />
                        <Picker.Item label="O-" value="O-" />
                    </Picker>
                </View>
                <Button onPress={signup} disabled={signupProcess}>
                    {signupProcess ? 'Creating account...' : 'Create Account'}
                </Button>
                <Link href="/">
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: '#7469B6',
                        }}
                    >
                        Log in
                    </Text>
                </Link>
            </SafeAreaView>
            {/* </TouchableWithoutFeedback> */}
        </ScrollView>
    )
}
