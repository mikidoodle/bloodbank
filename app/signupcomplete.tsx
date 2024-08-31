import { View, Platform, Text, Alert } from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import Octicons from '@expo/vector-icons/Octicons'
import { Picker } from '@react-native-picker/picker'
import Button from '@/components/Button'
import * as SecureStore from 'expo-secure-store'
export default function Modal() {
    let {
        name,
        phone,
        uuid,
    }: {
        name: string
        phone: string
        uuid: string
    } = useLocalSearchParams()
    useEffect(() => {
        async function setToken() {
            let e = await SecureStore.setItemAsync('token', uuid)
        }
        setToken()
    })
    return (
        <View
            style={{
                justifyContent: 'center',
                margin: 30,
                width: '80%',
                gap: 20,
            }}
        >
            <Text
                style={{
                    fontSize: 28,
                }}
            >
                Thanks for signing up,{'\n'}{' '}
                <Text
                    style={{
                        color: '#7469B6',
                    }}
                >
                    {name}
                </Text>
                !
            </Text>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 40,
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        alignSelf: 'center',
                        fontWeight: 'bold',
                        color: '#7469B6',
                        marginBottom: 25,
                    }}
                >
                    Next Steps
                </Text>
                <View
                    style={{
                        flexDirection: 'column',
                        gap: 30,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 10,
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            width: '85%',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 28,
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            ✅
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                            }}
                        >
                            A reviewer from the Blood Center will review your
                            data and determine if you're eligible to donate. You
                            will receive an SMS on your number once your data
                            has been reviewed.
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 10,
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            width: '85%',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 28,
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            ☎️
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                            }}
                        >
                            You might receive a call on your number,{' '}
                            <Text style={{ color: 'grey' }}>{phone}</Text>{' '}
                            within the next few days for more information to
                            determine your eligibility.
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 10,
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            width: '85%',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 28,
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            🩸
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                            }}
                        >
                            Even if you haven't been verified, you can donate at
                            the{' '}
                            <Text style={{ color: '#7469B6' }}>
                                JIPMER Blood Center
                            </Text>
                            . Make sure to show an employee your QR code before
                            you donate so they can verify your data.
                        </Text>
                    </View>
                </View>
            </View>
            <Button
                onPress={() => {
                    router.dismissAll()
                    router.replace('/user')
                }}
            >
                Continue
            </Button>
        </View>
    )
}
