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

export default function HQHome() {
    let [refreshing, setRefreshing] = useState<boolean>(false)
    let [totalDonators, setTotalDonators] = useState<number | null>(null)
    let [totalDonations, setTotalDonations] = useState<number | null>(null)

    async function load(refresh = false) {
        if (refresh) setRefreshing(true)
        let token = await SecureStore.getItemAsync('token')
        fetch(`http://localhost:3000/hq/getStats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loginCode: token,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (refresh) setRefreshing(false)
                if (response.error) {
                    Alert.alert(
                        'Unauthorized Access',
                        response.error, //login again redirect
                        [
                            {
                                text: 'Go back',
                                onPress: () => {
                                    SecureStore.deleteItemAsync('token')
                                    router.navigate('/')
                                },
                            },
                        ]
                    )
                } else {
                    setTotalDonators(response.data.totalDonors)
                    setTotalDonations(response.data.totalDonated)
                }
            })
    }
    useEffect(() => {
        console.log('loading')
        load(false)
    }, [])
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
                    <Text style={{ color: '#7469B6' }}>Blood Center HQ</Text>
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
                    <Text
                        style={{
                            fontSize: 28,
                            textAlign: 'left',
                            color: '#7469B6',
                            fontWeight: 'bold',
                        }}
                    >
                        Stats
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
                            icon="code-of-conduct"
                            iconColor="#AD88C6"
                            title={totalDonators?.toString() || ''}
                            subtitle="total donators"
                        />
                        <Card
                            icon="heart-fill"
                            iconColor="#AD88C6"
                            title={totalDonations?.toString() || ''}
                            subtitle="total donated"
                        />
                        
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
