import {
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import Card from '@/components/Card'
import Octicons from '@expo/vector-icons/Octicons'

export default function Home() {
    let [refreshing, setRefreshing] = useState<boolean>(false)
    let [name, setName] = useState<string>('')
    let [donated, setDonated] = useState<number | null>(null)
    let [lastDonation, setLastDonation] = useState<string>('')
    let [totalDonators, setTotalDonators] = useState<number | null>(null)
    let [donatingSince, setDonatingSince] = useState<string>('')
    async function load(refresh = false) {
        if (refresh) setRefreshing(true)
        let token = await SecureStore.getItemAsync('token')
        fetch(`http://192.168.0.141:3000/getUserData`, {
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
                if (refresh) setRefreshing(false)
                if (response.error) {
                    Alert.alert(
                        'Error',
                        response.error, //login again redirect
                        [
                            {
                                text: 'Sign in',
                                onPress: () => {
                                    SecureStore.deleteItemAsync('token')
                                    router.navigate('/')
                                },
                            },
                        ]
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
                if (refresh) setRefreshing(true)
                console.log(error)
            })
    }
    useEffect(() => {
        console.log('loading')
        load(false)
    }, [])
    function sendnotif() {
        fetch(`https://exp.host/--/api/v2/push/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                to: 'ExponentPushToken[aKG1HLIsJaNoiWtIa1L3ZV]',
                title: 'Hello',
                body: 'World',
                
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '80%',
                    marginBottom: 40,
                    marginTop: 20,
                }}
            >
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    JIPMER{' '}
                    <Text style={{ color: '#7469B6' }}>Blood Center</Text>
                </Text>
                <Pressable
                    onPress={() => load(true)}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Octicons name="sync" size={24} color="#7469B6" />
                </Pressable>
            </View>
            <ScrollView
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                //refresh control
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            load(true)
                        }}
                    />
                }
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
                        <Text style={{ color: '#7469B6', fontWeight: 'bold' }}>
                            {name}
                        </Text>
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
                    <Button onPress={sendnotif}>
                        Notifications
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
