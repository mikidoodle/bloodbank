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
import DateTimePicker from '@react-native-community/datetimepicker';
export default function Two({
    navigation,
    route,
}: {
    navigation: any
    route: any
}) {
    let [name, setName] = useState<string>('')
    let [dob, setDob] = useState<string>(new Date().toISOString())
    let [sex, setSex] = useState<string>('male')
    let [bloodGroup, setBloodGroup] = useState<string>('')
    let [weight, setWeight] = useState<string>('')
    let [height, setHeight] = useState<string>('')

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
                        progress={0.1}
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
                    Sign up | <Text style={{ color: '#7469B6' }}>Biodata</Text>
                </Text>
                <Text
                    style={{
                        fontSize: 18,
                        marginBottom: 20,
                    }}
                >
                    Enter your name
                </Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <Text
                    style={{
                        fontSize: 18,
                        marginBottom: 20,
                    }}
                >
                    Enter your sex
                </Text>
                <Picker selectedValue={sex} onValueChange={setSex}>
                    <Picker.Item label="Male" value={'male'} />
                    <Picker.Item label="Female" value={'female'} />
                    <Picker.Item label="Other" value={'other'} />
                </Picker>
                <Text
                    style={{
                        fontSize: 18,
                        marginBottom: 20,
                    }}
                >
                    Enter your date of birth
                </Text>
                <DateTimePicker value={new Date(dob)} mode="date" onChange={(event, date) => {
                    if (date) setDob(date.toISOString())
                }} 
            display='compact'
                />
                <TwoRowInput
                    placeholder="weight"
                    value={weight}
                    setValue={setWeight}
                    keyboardType={'numeric'}
                >
                    kg
                </TwoRowInput>
                <TwoRowInput
                    placeholder="height"
                    value={height}
                    setValue={setHeight}
                    keyboardType={'numeric'}
                >
                    cm
                </TwoRowInput>
                <View>
                    <Picker
                        selectedValue={bloodGroup}
                        onValueChange={setBloodGroup}
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
                </View>
                <Button
                    onPress={() => {
                        navigation.navigate(`one`, {
                            ...route.params,
                            name,
                            dob,
                            sex,
                            bloodGroup,
                            weight,
                            height,
                        })
                    }}
                >
                    Next
                </Button>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}
