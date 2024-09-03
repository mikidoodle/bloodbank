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
import styles from '../../assets/styles/styles'
import { Picker } from '@react-native-picker/picker'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import TwoRowInput from '@/components/TwoRowInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Progress from 'react-native-progress'
import { Octicons } from '@expo/vector-icons'
export default function TwoBeta({ route, navigation }: { route: any, navigation: any }) {
    let [designation, setDesignation] = useState<string>(route.params?.designation || 'Faculty')
    let [yearOfJoining, setYearOfJoining] = useState<any>(route.params?.yearOfJoining || '')
    let [department, setDepartment] = useState<string>(route.params?.department || '')
    delete route.params?.designation
    delete route.params?.yearOfJoining
    delete route.params?.department
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
                            gap:20
                        }}
                    >
                        <Pressable onPress={() => router.push('/')}>
                            <Octicons name="arrow-left" size={24} color="black" />
                        </Pressable>
                        <Text style={{ fontSize: 24, textAlign: 'center' }}>
                            JIPMER{' '}
                            <Text style={{ color: '#7469B6' }}>
                                Blood Center
                            </Text>
                        </Text>
                    </View>
                    <Progress.Bar
                        progress={0.2}
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
                    }}
                >
                    Sign up | <Text style={{ color: '#7469B6' }}>Employee Details</Text>
                </Text>
                <Text
                    style={{
                        fontSize: 18,
                        marginBottom: 20,
                    }}
                >
                    Enter your designation at JIPMER
                </Text>
                <Picker
                    selectedValue={designation}
                    onValueChange={(itemValue, itemIndex) =>
                        setDesignation(itemValue)
                    }
                    >
                        <Picker.Item label="Faculty" value="Faculty" />
                        <Picker.Item label="Resident" value="Resident" />
                        <Picker.Item label="MBBS" value="MBBS" />
                        <Picker.Item label="B.Sc. Nursing" value="B Sc. Nursing" />
                        <Picker.Item label="B.Sc. Allied Medical Sciences" value="B.Sc. Allied Medical Sciences" />
                        <Picker.Item label="Nursing staff" value="Nursing staff" />
                        <Picker.Item label="Other" value="Other" />
                    </Picker>
                    <Text
                    style={{
                        fontSize: 18,
                        marginBottom: 20,
                    }}
                >
                    Enter year of joining
                </Text>
                <TextInput
                    placeholder="Enter year of joining"
                    value={yearOfJoining}
                    onChangeText={setYearOfJoining}
                    keyboardType="numeric"
                    style={styles.input}
                />
                     <Text
                    style={{
                        fontSize: 18,
                        marginBottom: 20,
                    }}
                >
                    Enter your department.{"\n"}(If you are an intern, enter 'Intern')
                </Text>
                <TextInput
                    placeholder="Enter department"
                    value={department}
                    onChangeText={setDepartment}
                    keyboardType="default"
                    style={styles.input}
                />
                <Button onPress={()=>{
                    navigation.navigate('one', {
                        ...route.params,
                        designation,
                        yearOfJoining,
                        department
                    })
                }}>
                    Back
                </Button>
                <Button
                    onPress={() => {
                        navigation.navigate('two', {
                            ...route.params,
                            designation,
                            yearOfJoining,
                            department
                        })
                    }}
                    disabled={department === ''}
                >
                    Next
                </Button>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}
