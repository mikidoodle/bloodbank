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
export default function One({
    navigation,
    route,
}: {
    navigation: any
    route: any
}) {
    console.log(route.params)
    let [phoneNumber, setPhoneNumber] = useState<string>(
        route.params?.phoneNumber || ''
    )
    let [affiliated, setAffiliated] = useState<string | null>(
        route.params?.affiliated || 'no'
    )
    delete route.params?.affiliated
    console.log(route.params)

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
                    Sign up
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                        marginBottom: 20,
                    }}
                >
                    Are you affiliated with JIPMER?
                </Text>
                <View>
                    <Picker
                        selectedValue={affiliated}
                        onValueChange={(itemValue) => setAffiliated(itemValue)}
                    >
                        <Picker.Item label="No" value="no" />
                        <Picker.Item label="Yes" value="yes" />
                    </Picker>
                </View>
                <Button
                    onPress={() => {
                        navigation.navigate(
                            `two${affiliated == 'yes' ? 'beta' : ''}`,
                            { ...route.params,
                                phoneNumber, affiliated }
                        )
                    }}
                >
                    Next
                </Button>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}
