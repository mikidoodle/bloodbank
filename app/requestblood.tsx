import {
    View,
    Platform,
    Text,
    Alert,
    TextInput,
    useColorScheme,
    Pressable,
} from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import Octicons from '@expo/vector-icons/Octicons'
import { Picker } from '@react-native-picker/picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '@/components/Button'
import TwoRowInput from '@/components/TwoRowInput'
import styles from '@/assets/styles/styles'
export default function Modal() {
    const local = useLocalSearchParams()
    let uuid = local.uuid
    let [bloodtype, setBloodtype] = useState<string>('A+')
    let [phoneNumber, setPhoneNumber] = useState<string>('')
    const token = local.token
    let [unitsRequired, setUnitsRequired] = useState<string>('0')
    let [minimumMonths, setMinimumMonths] = useState<string>('0')
    let [loading, setLoading] = useState<boolean>(false)
    let isDarkMode = useColorScheme() === 'dark'
    let responsiveColor = isDarkMode ? 'white' : 'black'
    function requestBlood() {
        setLoading(true)
        //check if units and months are numbers
        if (isNaN(Number(unitsRequired)) || isNaN(Number(minimumMonths))) {
            setLoading(false)
            Alert.alert('Error', 'Please enter valid numbers')
            return
        }
        console.log(unitsRequired, minimumMonths)
        fetch(`https://bloodbank.pidgon.com/hq/requestBlood`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                type: bloodtype,
                units: parseInt(unitsRequired),
                months: parseInt(minimumMonths),
                contact: phoneNumber,
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
                Alert.alert('Error')
            })
    }

    return (
        <KeyboardAwareScrollView
            style={{
                backgroundColor: isDarkMode ? '#121212' : '#fff',
            }}
        >
            <View
                style={{
                    justifyContent: 'center',
                    width: '80%',
                    margin: 'auto',
                    gap: 20,
                }}
            >
                <Pressable
                    onPress={() => router.dismiss()}
                    style={{
                        width: '90%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 36,
                            fontWeight: 'bold',
                            textAlign: 'left',
                            color: responsiveColor,
                        }}
                    >
                        Request Blood
                    </Text>
                    <Octicons name="x" size={36} color={responsiveColor} />
                </Pressable>

                <Text
                    style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: responsiveColor,
                    }}
                >
                    What blood type do you need?
                </Text>
                <Picker
                    selectedValue={bloodtype}
                    onValueChange={(itemValue) => setBloodtype(itemValue)}
                >
                    <Picker.Item
                        label="A+"
                        value="A+"
                        color={responsiveColor}
                    />
                    <Picker.Item
                        label="A-"
                        value="A-"
                        color={responsiveColor}
                    />
                    <Picker.Item
                        label="B+"
                        value="B+"
                        color={responsiveColor}
                    />
                    <Picker.Item
                        label="B-"
                        value="B-"
                        color={responsiveColor}
                    />
                    <Picker.Item
                        label="AB+"
                        value="AB+"
                        color={responsiveColor}
                    />
                    <Picker.Item
                        label="AB-"
                        value="AB-"
                        color={responsiveColor}
                    />
                    <Picker.Item
                        label="O+"
                        value="O+"
                        color={responsiveColor}
                    />
                    <Picker.Item
                        label="O-"
                        value="O-"
                        color={responsiveColor}
                    />
                    <Picker.Item
                        label="Bombay blood group"
                        value="Bombay blood group"
                        color={responsiveColor}
                    />
                </Picker>
                <Text
                    style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: responsiveColor,
                    }}
                >
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
                <Text
                    style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: responsiveColor,
                    }}
                >
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
                <Text
                    style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: responsiveColor,
                    }}
                >
                    What phone number should the donors contact?
                </Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={'grey'}
                    placeholder="9123456789"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <Button onPress={requestBlood} disabled={loading}>
                    {loading ? 'Processing request...' : 'Request Blood'}
                </Button>
                <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            </View>
        </KeyboardAwareScrollView>
    )
}
