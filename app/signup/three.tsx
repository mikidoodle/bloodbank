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
import DateTimePicker from '@react-native-community/datetimepicker'
import FreeButton from '@/components/FreeButton'
export default function Three({
    navigation,
    route,
}: {
    navigation: any
    route: any
}) {
    let [conditions, setConditions] = useState<string>(
        route.params?.conditions || ''
    )
    let [medications, setMedications] = useState<string>(
        route.params?.medications || ''
    )
    const allConditions = [
        "Epilepsy",
        "Fainting",
        "Heart Disease",
        "Leprosy",
        "Tuberculosis",
        "Kidney Disease",
        "Cancer",
        "Diabetes-on insulin",
        "Endocrine Disease",
        "Hypotension",
        "Hypertension",
        "Abnormal bleeding tendencies"
    ] 
    const allMedications = [
        "NSAIDs",
        "Antibiotics",
        "Steroids",
        "Other"
    ]
    delete route.params?.conditions
    delete route.params?.medications
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
                        progress={0.6}
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
                    Sign up |{' '}
                    <Text style={{ color: '#7469B6' }}>Conditions</Text>
                </Text>

                <View
                    style={{
                        width: '80%',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            marginBottom: 30,
                        }}
                    >
                        If you do not have any medical conditions or take any
                        medications, click{' '}
                        <Text style={{ color: '#7469B6', fontSize: 18 }}>
                            Next
                        </Text> at the bottom of the page.
                    </Text>
                    <Text
                        style={{
                            fontSize: 18,
                            marginBottom: 20,
                        }}
                    >
                        Do you have any medical conditions? If yes, please list
                        them below.
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            marginBottom: 20,
                            color: 'gray',
                        }}
                    >
                        This includes Epilepsy, Fainting, Heart Disease,
                        Leprosy, Tuberculosis, Kidney Disease, Cancer,
                        Diabetes-on insulin, Endocrine Disease,
                        Hypo/Hypertension, Abnormal bleeding tendencies
                    </Text>
                    <TextInput
                        style={{ ...styles.input, height: 100 }}
                        value={conditions}
                        onChangeText={setConditions}
                        autoComplete="off"
                        multiline={true}
                        placeholder="Enter your conditions here"
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            marginBottom: 20,
                        }}
                    >
                        Do you take any chronic medications? If yes, please list
                        them below.
                    </Text>
                    <TextInput
                        style={{ ...styles.input, height: 100 }}
                        value={medications}
                        onChangeText={setMedications}
                        autoComplete="off"
                        multiline={true}
                        placeholder="Enter your medications here"
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 20,
                    }}
                >
                    <FreeButton
                        onPress={() => {
                            navigation.navigate(
                                `two${
                                    route.params?.affiliated == 'yes'
                                        ? 'beta'
                                        : ''
                                }`,
                                {
                                    ...route.params,
                                    conditions,
                                    medications,
                                }
                            )
                        }}
                        style={{
                            width: '25%',
                        }}
                    >
                        Back
                    </FreeButton>
                    <FreeButton
                        onPress={() => {
                            navigation.navigate(`four`, {
                                ...route.params,
                                conditions,
                                medications,
                            })
                        }}
                        style={{
                            width: '40%',
                        }}
                        disabled={false}
                    >
                        Next
                    </FreeButton>
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}
