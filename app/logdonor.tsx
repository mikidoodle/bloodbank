import { View, Platform, Text } from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import Octicons from '@expo/vector-icons/Octicons'
import { Picker } from '@react-native-picker/picker'
import Button from '@/components/Button'
export default function Modal() {
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
    function checkIfTimestampUnsafeToDonate(timestamp: string) {
        if (timestamp === 'Never') return false
        let date = new Date(timestamp)
        let now = new Date()
        let diff = now.getTime() - date.getTime()
        let diffMonths = diff / (1000 * 60 * 60 * 24 * 30)
        return diffMonths < 3
    }
    const local = useLocalSearchParams()
    let uuid = local.uuid
    let [bloodtype, setBloodtype] = useState<string>('A+')
    const token = local.token
    let [donorData, setDonorData] = useState<any>({})
    let [verifying, setVerifying] = useState<boolean>(false)
    let [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        fetch(`http://192.168.0.214:3000/hq/getDonor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                uuid: uuid,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.error) {
                    alert(response.message)
                    router.dismiss()
                } else {
                    setLoading(false)
                    setDonorData(response.data)
                    setBloodtype(response.data.bloodtype)
                }
            })
    }, [])

    function verifyDonor() {
        setVerifying(true)
        fetch(`http://192.168.0.214:3000/hq/verifyDonor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                uuid: uuid,
                bloodtype: bloodtype,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.error) {
                    setVerifying(false)
                    alert(response.message)
                } else {
                    alert(response.message)
                    //update the donor data
                    let newDonorData = { ...donorData }
                    newDonorData.verified = true
                    newDonorData.bloodtype = bloodtype
                    setDonorData(newDonorData)
                }
            })
    }
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                margin: 20,
            }}
        >
            {loading ? (
                <Text
                    style={{
                        fontSize: 36,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    Loading donor...
                </Text>
            ) : (
                <View
                    style={{
                        flexDirection: 'column',
                        gap: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 36,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}
                    >
                        {donorData.name}
                    </Text>

                    <Text style={{ fontSize: 24, color: 'grey' }}>
                        +91 {donorData.phone}
                    </Text>
                    <Text style={{ fontSize: 24 }}>
                        Blood group: {donorData.bloodtype}{' '}
                        {donorData.verified ? (
                            <Octicons
                                name="verified"
                                size={24}
                                color="#26CD41"
                            />
                        ) : (
                            <Octicons
                                name="unverified"
                                size={24}
                                color="#FF3B2F"
                            />
                        )}
                    </Text>
                    <Text style={{ fontSize: 24 }}>
                        {donorData.age} years old
                    </Text>
                    <Text style={{ fontSize: 24 }}>
                        Last donated:{' '}
                        <Text
                            style={{
                                color: checkIfTimestampUnsafeToDonate(
                                    donorData.lastdonated
                                )
                                    ? '#FF3B2F'
                                    : '#26CD41',
                            }}
                        >
                            {convertTimestampToShortString(
                                donorData.lastdonated
                            )}
                        </Text>
                    </Text>
                    {!donorData.verified ? (
                        <View
                            style={{
                                borderColor: '#FF3B2F',
                                borderWidth: 2,
                                backgroundColor: '#FAF9F6',
                                padding: 10,
                                borderRadius: 5,
                                width: '100%',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 24,
                                    color: '#FF3B2F',
                                    fontWeight: 'bold',
                                }}
                            >
                                This donor is not verified.
                            </Text>
                            <Text style={{ fontSize: 18, color: 'black' }}>
                                Please verify their blood group before allowing
                                them to donate.
                            </Text>
                            <Picker
                                selectedValue={bloodtype}
                                onValueChange={(itemValue, itemIndex) =>
                                    setBloodtype(itemValue)
                                }
                                style={{
                                    margin: 10,
                                    borderRadius: 9,
                                    backgroundColor: '#F3F3F3',
                                }}
                            >
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
                            <Button onPress={verifyDonor} disabled={verifying}>
                                <Text>Verify</Text>
                            </Button>
                        </View>
                    ) : null}
                </View>
            )}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    )
}
