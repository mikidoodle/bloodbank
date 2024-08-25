import { View, Platform, Text, Alert } from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import Octicons from '@expo/vector-icons/Octicons'
import { Picker } from '@react-native-picker/picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '@/components/Button'
import TwoRowInput from '@/components/TwoRowInput'
export default function Modal() {
    const local = useLocalSearchParams()
    let uuid = local.uuid
    let [bloodtype, setBloodtype] = useState<string>('A+')
    const token = local.token
    let [unitsRequired, setUnitsRequired] = useState<string>('0')
    let [minimumMonths, setMinimumMonths] = useState<string>('0')
    let [loading, setLoading] = useState<boolean>(false)

    function requestBlood() {
        setLoading(true)
        fetch(`http://192.168.0.141:3000/hq/requestBlood`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                type: bloodtype,
                units: unitsRequired,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.error) {
                    setLoading(false)
                    Alert.alert('Error', response.message)
                } else {
                    Alert.alert(response.message)
                    router.dismiss()
                }
            })
            .catch((error) => {
                setLoading(false)
                Alert.alert('Error', error)
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
            <KeyboardAwareScrollView
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
                    Request Blood
                </Text>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    What blood type do you need?
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
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    How many units do you need?
                </Text>
                <TwoRowInput
                    placeholder="2"
                    value={unitsRequired}
                    setValue={setUnitsRequired}
                    keyboardType="numpad"
                >
                    units
                </TwoRowInput>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    What is the minimum month gap required from the last
                    donation?
                </Text>
                <TwoRowInput
                    placeholder="4"
                    value={minimumMonths}
                    setValue={setMinimumMonths}
                    keyboardType="numpad"
                >
                    months
                </TwoRowInput>
                <Button onPress={requestBlood} disabled={loading}>
                    {loading ? 'Processing request...' : 'Request Blood'}
                </Button>
            </KeyboardAwareScrollView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    )
}
