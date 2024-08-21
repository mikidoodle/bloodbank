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
import styles from '../assets/styles/styles'
import Octicons from '@expo/vector-icons/Octicons'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import Card from '@/components/Card'
export default function Home() {
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
                phonenumber: phoneNumber,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then(async (response) => {
                setLoginProcess(false)
                if (response.error) {
                    alert(response.message)
                } else {
                    alert(response.message)
                    await SecureStore.setItemAsync('token', response.token)
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
            <View>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    JIPMER <Text style={{ color: '#7469B6' }}>Blood Bank</Text>
                </Text>
            </View>
            <View
                style={{
                    marginTop: 20,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <View
                    style={{
                        width: '100%',
                        gap: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}
                >
                    <Card
                        icon="heart-fill"
                        iconColor="#AD88C6"
                        title="100"
                        subtitle="units donated"
                    />
                    <Card
                        icon="calendar"
                        iconColor="#AD88C6"
                        title="April '24"
                        subtitle="last donation"
                    />
                </View>
                <View
                    style={{
                        width: '100%',
                        gap: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}
                >
                    <Card
                        icon="heart"
                        iconColor="#AD88C6"
                        title="256"
                        subtitle="total donators"
                    />
                    <Card
                        icon="heart-fill"
                        iconColor="#AD88C6"
                        title="100"
                        subtitle="units donated"
                    />
                </View>
                <Button onPress={() => {}}>
                    <Text style={{ color: 'white' }}>Donate</Text>
                </Button>
            </View>
        </ScrollView>
    )
}
