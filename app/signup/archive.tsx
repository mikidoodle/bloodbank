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
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '@/assets/styles/styles'
import { Picker } from '@react-native-picker/picker'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import TwoRowInput from '@/components/TwoRowInput'
export default function Signup() {
    let [phoneNumber, setPhoneNumber] = useState<string>('')
    let [name, setName] = useState<string>('')
    let [password, setPassword] = useState<string>('')
    let [weight, setWeight] = useState<string>('')
    let [height, setHeight] = useState<string>('')
    let [age, setAge] = useState<string>('')
    let [bloodtype, setBloodtype] = useState<
        'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Bombay blood group'
    >('A+')
    let [signupProcess, setSignupProcess] = useState<boolean>(false)
    function signup() {
        setSignupProcess(true)
        console.log({
            phoneNumber,
            password,
            name,
            weight,
            height,
            age,
            bloodtype,
        })
        fetch(`http://localhost:3000/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phonenumber: phoneNumber,
                password: password,
                name: name,
                weight: weight,
                height: height,
                age: age,
                bloodtype: bloodtype,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                setSignupProcess(false)
                if (response.error) {
                    alert(response.error)
                } else {
                    SecureStore.setItemAsync('token', response.token)
                    router.push('/user')
                }
            })
            .catch((error) => {
                setSignupProcess(false)
                alert(error)
            })
    }
    return (
        <ScrollView
            contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss()
                }}
            > */}
            <SafeAreaView>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    <Text style={{ color: '#7469B6' }}>Sign up</Text>
                    {'\n'}
                    <Text style={{ fontSize: 18, color: 'gray' }}>
                        preliminary
                    </Text>
                </Text>
                <View style={{ marginTop: 20 }}>
                    <Text
                        style={{
                            textAlign: 'left',
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Info
                    </Text>
                    <TextInput
                        placeholder="phone number"
                        autoComplete="tel"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Name"
                        autoComplete="name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="password"
                        autoComplete="off"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />

                    <Text
                        style={{
                            textAlign: 'left',
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Biodata
                    </Text>
                    <TwoRowInput
                        placeholder="age"
                        value={age}
                        setValue={setAge}
                        keyboardType="numeric"
                    >
                        years
                    </TwoRowInput>
                    <TwoRowInput
                        placeholder="height"
                        value={height}
                        setValue={setHeight}
                        keyboardType="numeric"
                    >
                        cm
                    </TwoRowInput>
                    <TwoRowInput
                        placeholder="weight"
                        value={weight}
                        setValue={setWeight}
                        keyboardType="numeric"
                    >
                        kg
                    </TwoRowInput>
                    <Text
                        style={{
                            textAlign: 'left',
                            fontSize: 16,
                            marginLeft: 10,
                            color: 'gray',
                        }}
                    >
                        Blood Type
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
                        <Picker.Item label="Bombay blood group" value="Bombay blood group" />
                    </Picker>
                </View>
                <Button onPress={signup} disabled={signupProcess}>
                    {signupProcess ? 'Creating account...' : 'Create Account'}
                </Button>
                <Link href="/">
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: '#7469B6',
                        }}
                    >
                        Log in
                    </Text>
                </Link>
            </SafeAreaView>
            {/* </TouchableWithoutFeedback> */}
        </ScrollView>
    )
}