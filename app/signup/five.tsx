import {
    Alert,
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
import { Picker } from '@react-native-picker/picker'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import TwoRowInput from '@/components/TwoRowInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Progress from 'react-native-progress'
import { Octicons } from '@expo/vector-icons'
import FreeButton from '@/components/FreeButton'
export default function Five({
    navigation,
    route,
}: {
    navigation: any
    route: any
}) {
    console.log(route.params)
    let [birthdayHero, setBirthdayHero] = useState<boolean>(
        route.params?.birthdayHero || false
    )
    let [loadingProcess, setLoadingProcess] = useState<boolean>(false)
    delete route.params?.birthdayHero
    console.log(route.params)

    function signup() {
        setLoadingProcess(true)
        /**
         * @params {phoneNumber} string [EXISTS]
         * @params {affiliated} string (convert to boolean)
         * @params {affiliatedata} object {designation: string, yearOfJoining: number, department: string}
         * @params {name} string [EXISTS]
         * @params {sex} string
         * @params {dob} timestampz
         * @params {weight} number [EXISTS]
         * @params {height} number [EXISTS]
         * @params {bloodgroup} string [EXISTS]
         * @params {conditions} string
         * @params {medications} string
         * @params {distance} number
         * @params {birthdayHero} boolean
         */
        var payload = {
            phonenumber: route.params.phoneNumber,
            affiliated: route.params.affiliated === 'yes',
            affiliatedata:
                route.params.affiliated === 'yes'
                    ? {
                          designation: route.params.designation,
                          yearOfJoining: route.params.yearOfJoining,
                          department: route.params.department,
                      }
                    : null,
            name: route.params.name,
            sex: route.params.sex,
            dob: route.params.dob,
            weight: route.params.weight,
            height: route.params.height,
            bloodtype: route.params.bloodtype,
            conditions: route.params.conditions,
            medications: route.params.medications,
            distance: route.params.distance,
            birthdayhero: birthdayHero,
        }
        fetch(`http://192.168.0.214:3000/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then(async (response) => {
                if (response.error) {
                    setLoadingProcess(false)
                    alert(response.message)
                } else {
                    await SecureStore.setItemAsync('token', response.data.uuid)
                    router.push({
                        pathname: '/signupcomplete',
                        params: response.data,
                    })
                }
            })
            .catch((error) => {
                setLoadingProcess(false)
                alert(error)
            })
    }
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <SafeAreaView>
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginBottom: 40,
                        marginTop: 20,
                        gap: 20,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 20,
                        }}
                    >
                        <Pressable onPress={() => router.push('/')}>
                            <Octicons
                                name="arrow-left"
                                size={24}
                                color="black"
                            />
                        </Pressable>
                        <Text style={{ fontSize: 24, textAlign: 'center' }}>
                            JIPMER{' '}
                            <Text style={{ color: '#7469B6' }}>
                                Blood Center
                            </Text>
                        </Text>
                    </View>
                    <Progress.Bar
                        progress={1}
                        width={300}
                        height={10}
                        color="#7469B6"
                        borderRadius={10}
                    />
                </View>
                <Text
                    style={{
                        fontSize: 28,
                        textAlign: 'center',
                        margin: 'auto',
                        marginBottom: 20,
                    }}
                >
                    Sign up | <Text style={{ color: '#7469B6' }}>Extras</Text>
                </Text>
                <View
                    style={{
                        width: '80%',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            marginBottom: 20,
                        }}
                    >
                        As you celebrate yet another year of life, give someone
                        else the chance too. Be a real hero in your life by
                        participating in "Birthday Heroes" initiative.
                    </Text>
                    <Text style={{ fontSize: 18, marginBottom: 20 }}>
                        Kindly give your consent for the Birthday Heroes project
                        and be a hero!
                    </Text>
                    <View>
                        <Picker
                            selectedValue={birthdayHero}
                            onValueChange={(itemValue) => {
                                setBirthdayHero(itemValue)
                            }}
                        >
                            <Picker.Item label="Yes" value={true} />
                            <Picker.Item label="No" value={false} />
                        </Picker>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexGrow: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '80%',
                        gap: 20,
                    }}
                >
                    <FreeButton
                        onPress={() => {
                            navigation.navigate(`four`, {
                                ...route.params,
                                birthdayHero,
                            })
                        }}
                        style={{
                            width: '25%',
                        }}
                    >
                        Back
                    </FreeButton>
                    <FreeButton
                        onPress={signup}
                        style={{
                            width: '50%',
                        }}
                        disabled={loadingProcess}
                    >
                        {loadingProcess ? 'Loading...' : 'Sign Up!'}
                    </FreeButton>
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}
