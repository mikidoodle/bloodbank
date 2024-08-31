import {
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    Switch,
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
import FreeButton from '@/components/FreeButton'
import { TextInput } from 'react-native'
import styles from '@/assets/styles/styles'
import TwoRowInput from '@/components/TwoRowInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Query() {
    let [refreshing, setRefreshing] = useState<boolean>(false)
    let [totalDonators, setTotalDonators] = useState<number | null>(null)
    let [totalDonations, setTotalDonations] = useState<number | null>(null)
    let [activeHotswap, setActiveHotswap] = useState<boolean>(true)
    let [minimumMonths, setMinimumMonths] = useState<string>('')
    let [requireUsersVerified, setRequireUsersVerified] =
        useState<boolean>(true)
    let [requireUsersAffiliated, setRequireUsersAffiliated] =
        useState<boolean>(false)
    let [radius, setRadius] = useState<string>('')
    let [token, setToken] = useState<string | null>('')
    let [resultData, setResultData] = useState<any>([])
    let [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        async function getToken() {
            let t = await SecureStore.getItemAsync('token')
            console.log(t)
            setToken(t)
        }
        getToken()
    }, [])
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
                    Alert.alert('Error', 'Unauthorized Access', [
                        {
                            text: 'Go back',
                            onPress: () => {
                                SecureStore.deleteItemAsync('token')
                                router.navigate('/')
                            },
                        },
                    ])
                } else {
                    setTotalDonators(response.data.totalDonors)
                    setTotalDonations(response.data.totalDonated)
                }
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
            <KeyboardAwareScrollView
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
                        Donors
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 0 }}>
                    <FreeButton
                        onPress={() => {
                            setActiveHotswap(true)
                        }}
                        style={{
                            borderWidth: activeHotswap ? 0 : 3,
                            borderColor: '#D3D3D3',
                            backgroundColor: activeHotswap
                                ? '#AD88C6'
                                : '#D3D3D3',
                        }}
                    >
                        <Text
                            style={{ color: activeHotswap ? 'white' : 'black' }}
                        >
                            Conduct a query
                        </Text>
                    </FreeButton>
                    <FreeButton
                        onPress={() => {
                            setActiveHotswap(false)
                        }}
                        style={{
                            borderWidth: activeHotswap ? 3 : 0,
                            borderColor: '#D3D3D3',
                            backgroundColor: activeHotswap
                                ? '#D3D3D3'
                                : '#AD88C6',
                        }}
                    >
                        <Text
                            style={{ color: activeHotswap ? 'black' : 'white' }}
                        >
                            Unverified
                        </Text>
                    </FreeButton>
                </View>

                {loading ? (
                    <Text style={{
                        fontSize: 20,
                        textAlign: 'center',
                        marginTop: 20,
                    }}>Loading...</Text>
                ) : activeHotswap ? (
                    <View style={{
                        marginTop: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text
                            style={{
                                fontSize: 20,
                                textAlign: 'left',
                            }}
                        >
                            Look for users with...
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <TextInput
                                placeholder="number"
                                keyboardType="default"
                                value={minimumMonths}
                                onChangeText={setMinimumMonths}
                                style={{
                                    ...styles.input,
                                    backgroundColor: '#FFF',
                                    width: 70,
                                }}
                            />
                            <Text style={{ fontSize: 16, width: '70%' }}>
                                minimum months before the last donation
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <TextInput
                                placeholder="number"
                                keyboardType="default"
                                value={minimumMonths}
                                onChangeText={setMinimumMonths}
                                style={{
                                    ...styles.input,
                                    backgroundColor: '#FFF',
                                    width: 70,
                                }}
                            />
                            <Text style={{ fontSize: 16, width: '70%' }}>
                                km radius of the blood bank
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <Text style={{ fontSize: 16, width: '70%' }}>
                                Require result donors to be affiliated with
                                JIPMER?
                            </Text>

                            <Switch
                                trackColor={{
                                    true: '#AD88C6',
                                }}
                                onValueChange={setRequireUsersAffiliated}
                                value={requireUsersAffiliated}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 10,
                                marginTop: 20,
                            }}
                        >
                            <Text style={{ fontSize: 16, width: '70%' }}>
                                Require result donors to be verified?
                            </Text>

                            <Switch
                                trackColor={{
                                    true: '#AD88C6',
                                }}
                                onValueChange={setRequireUsersVerified}
                                value={requireUsersVerified}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 18,
                                textAlign: 'center',
                                marginTop: 20,
                            }}
                        >
                            Leave unrequired fields empty.
                        </Text>
                        <Button onPress={() => {}} style={{ marginTop: 20 }}>
                            Query Donors
                        </Button>
                    </View>
                ) : null}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
