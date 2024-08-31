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
import { Picker } from '@react-native-picker/picker'

export default function Query() {
    let [refreshing, setRefreshing] = useState<boolean>(false)
    let [totalDonators, setTotalDonators] = useState<number | null>(null)
    let [totalDonations, setTotalDonations] = useState<number | null>(null)
    let [activeHotswap, setActiveHotswap] = useState<boolean>(true)
    let [bloodtype, setBloodtype] = useState<string>('A+')
    let [minimumMonths, setMinimumMonths] = useState<string>('')
    let [openUnverified, setOpenUnverified] = useState<boolean>(false)
    let [requireUsersVerified, setRequireUsersVerified] =
        useState<boolean>(true)
    let [requireUsersAffiliated, setRequireUsersAffiliated] =
        useState<boolean>(false)
    let [radius, setRadius] = useState<string>('')
    let [token, setToken] = useState<string | null>('')
    let [resultData, setResultData] = useState<any>([])
    let [loading, setLoading] = useState<boolean>(false)

    function convertTimestampToShortString(timestamp: string) {
        if (
            timestamp?.toString().trim() === '' ||
            timestamp === undefined ||
            timestamp === null
        )
            return 'Never'
        let date = new Date(timestamp)
        let month = date.toLocaleString('default', { month: 'short' })
        let year = date.getFullYear().toString().substring(2)
        return `${month} '${year}`
    }

    useEffect(() => {
        async function getToken() {
            let t = await SecureStore.getItemAsync('token')
            console.log(t)
            setToken(t)
        }
        getToken()
    }, [])
    async function queryDonors(refresh = false, unverified = false) {
        if (refresh) setRefreshing(true)
        setLoading(true)
        let token = await SecureStore.getItemAsync('token')
        fetch(`http://localhost:3000/hq/queryDonors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                months: minimumMonths,
                verified: requireUsersVerified,
                affiliated: requireUsersAffiliated,
                distance: radius,
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
                    setLoading(false)
                    setActiveHotswap(false)
                    if (unverified) setOpenUnverified(true)
                    console.log(response.data)
                    setResultData(response.data)
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
                    marginBottom: 50,
                    marginTop: 20,
                }}
            >
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    JIPMER{' '}
                    <Text style={{ color: '#7469B6' }}>Blood Center HQ</Text>
                </Text>
                <Pressable
                    onPress={() => queryDonors(true)}
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
                            queryDonors(true)
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
                            setOpenUnverified(false)
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
                            setResultData([])
                            setActiveHotswap(false)
                            setOpenUnverified(true)
                            setMinimumMonths('')
                            setRadius('')
                            setBloodtype('')
                            setRequireUsersAffiliated(false)
                            setRequireUsersVerified(false)
                            queryDonors(false, true)
                        }}
                        style={{
                            borderWidth: openUnverified ? 0 : 3,
                            borderColor: '#D3D3D3',
                            backgroundColor: openUnverified
                                ? '#AD88C6'
                                : '#D3D3D3',
                        }}
                    >
                        <Text
                            style={{
                                color: openUnverified ? 'white' : 'black',
                            }}
                        >
                            Unverified
                        </Text>
                    </FreeButton>
                </View>

                {loading ? (
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                            marginTop: 20,
                        }}
                    >
                        Loading...
                    </Text>
                ) : activeHotswap ? (
                    <View
                        style={{
                            marginTop: 20,
                            marginBottom: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
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
                                value={radius}
                                onChangeText={setRadius}
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
                                width: '100%',
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>
                                have a blood type of
                            </Text>
                            <Picker
                                selectedValue={bloodtype}
                                onValueChange={setBloodtype}
                                style={{
                                    width: 300,
                                }}
                            >
                                <Picker.Item label="Not required" value="" />
                                <Picker.Item label="A+" value="A+" />
                                <Picker.Item label="A-" value="A-" />
                                <Picker.Item label="B+" value="B+" />
                                <Picker.Item label="B-" value="B-" />
                                <Picker.Item label="AB+" value="AB+" />
                                <Picker.Item label="AB-" value="AB-" />
                                <Picker.Item label="O+" value="O+" />
                                <Picker.Item label="O-" value="O-" />
                                <Picker.Item
                                    label="Bombay blood group"
                                    value="Bombay blood group"
                                />
                            </Picker>
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
                        <Button onPress={queryDonors} style={{ marginTop: 20 }}>
                            Query Donors
                        </Button>
                    </View>
                ) : (
                    resultData.map((donor: any) => {
                        return (
                            <View
                                style={{
                                    width: '90%',
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 20,
                                    gap: 10,
                                }}
                                key={donor.uuid}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {donor.name} ({donor.bloodtype})
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: donor.verified
                                                ? '#26CD41'
                                                : '#FF3B2F',
                                        }}
                                    >
                                        {donor.verified
                                            ? 'Verified'
                                            : 'Unverified'}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color:
                                                donor.distance < 5
                                                    ? '#35C759'
                                                    : donor.distance < 10
                                                    ? '#FF9503'
                                                    : '#FF3B31',
                                        }}
                                    >
                                        {parseFloat(
                                            donor.distance < 1
                                                ? donor.distance * 1000
                                                : donor.distance
                                        )
                                            .toPrecision(2)
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ','
                                            )}{' '}
                                        {donor.distance < 1 ? 'm' : 'km'} away
                                        from the blood bank
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 5,
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            gap: 5,
                                            backgroundColor: '#F3F3F3',
                                            padding: 10,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {convertTimestampToShortString(
                                                donor.lastdonated
                                            )}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                            }}
                                        >
                                            Last donated
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            gap: 5,
                                            backgroundColor: '#F3F3F3',
                                            padding: 10,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {donor.totaldonations || 0}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                            }}
                                        >
                                            Total donations
                                        </Text>
                                    </View>
                                </View>
                                <Pressable
                                    onPress={() => {
                                        router.push(`tel:${donor.phone}`)
                                    }}
                                    style={{
                                        alignSelf: 'flex-start',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: '#7469B6',
                                        }}
                                    >
                                        Call +91 {donor.phone}
                                    </Text>
                                </Pressable>
                                <Button style={{ marginTop: 10 }} onPress={()=>{}}>
                                    Verify
                                </Button>
                            </View>
                        )
                    })
                )}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
