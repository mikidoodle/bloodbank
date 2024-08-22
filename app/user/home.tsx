import {
    Alert,
    Keyboard,
    Pressable,
    RootTagContext,
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
import Octicons from '@expo/vector-icons/Octicons'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import Card from '@/components/Card'

export default function Home() {
    let [phoneNumber, setPhoneNumber] = useState<string>('')
    let [password, setPassword] = useState<string>('')
    let [loginProcess, setLoginProcess] = useState<boolean>(false)
    let [name, setName] = useState<string>('')
    let [donated, setDonated] = useState<number | null>(null)
    let [lastDonation, setLastDonation] = useState<string>('')
    let [totalDonators, setTotalDonators] = useState<number | null>(null)
    let [donatingSince, setDonatingSince] = useState<string>('')
    async function load() {
        let token = await SecureStore.getItemAsync('token')
        fetch(`http://localhost:3000/getUserData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.error) {
                    Alert.alert('Error', response.error, //login again redirect
                        [{
                            text: 'Sign in',
                            onPress: () => {
                                SecureStore.deleteItemAsync('token')
                                router.navigate('/')
                            }
                        }]

                    )
                } else {
                    setName(response.data.name)
                    setDonated(response.data.donated)
                    setLastDonation(response.data.lastDonated)
                    setTotalDonators(response.data.totalDonators)
                    setDonatingSince(response.data.donatingSince)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    useEffect(() => {
        console.log('loading')
        load()
    }, [])
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View>
                <Text style={{ fontSize: 24, textAlign: 'center', margin: 20 }}>
                    JIPMER <Text style={{ color: '#7469B6' }}>Blood Bank</Text>
                </Text>
            </View>
            <ScrollView
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        alignContent: 'flex-start',
                        width: '80%',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 28, textAlign: 'left' }}>
                        Hello{name.trim() === '' ? '!' : ', '}
                        <Text style={{ color: '#7469B6', fontWeight: 'bold' }}>{name}</Text>
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
                            title={donated?.toString() || ''}
                            subtitle="units donated"
                        />
                        <Card
                            icon="calendar"
                            iconColor="#AD88C6"
                            title={lastDonation}
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
                            icon="code-of-conduct"
                            iconColor="#AD88C6"
                            title={totalDonators?.toString() || ''}
                            subtitle="total donators"
                        />
                        <Card
                            icon="graph"
                            iconColor="#AD88C6"
                            title={donatingSince}
                            subtitle="donating since"
                        />
                    </View>
                    <Button
                        onPress={() => {
                            router.navigate(
                                'https://www.google.com/maps/place/Jipmer+Blood+Bank/@11.9538541,79.7951234,17z/data=!3m1!4b1!4m6!3m5!1s0x3a536117fc8720c5:0xbeeabdbd4d20decf!8m2!3d11.9538489!4d79.7976983!16s%2Fg%2F11cmrqtn4l?entry=ttu'
                            )
                        }}
                    >
                        <Text style={{ color: 'white' }}>Donate</Text>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
