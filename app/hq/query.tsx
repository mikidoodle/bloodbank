import {
    Alert,
    Dimensions,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import Card from '@/components/Card'
import Octicons from '@expo/vector-icons/Octicons'
import FreeButton from '@/components/FreeButton'
import { TextInput } from 'react-native'
import styles from '@/assets/styles/styles'
import TwoRowInput from '@/components/TwoRowInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Picker } from '@react-native-picker/picker'

export default function Query() {
    let [refreshing, setRefreshing] = useState<boolean>(false)
    let [totalDonators, setTotalDonators] = useState<number | null>(null)
    let [totalDonations, setTotalDonations] = useState<number | null>(null)
    let [expandCriteria, setExpandCriteria] = useState<boolean>(false)
    let [expandSearchBox, setExpandSearchBox] = useState<boolean>(true)
    let [activeHotswap, setActiveHotswap] = useState<boolean>(true)
    let [bloodtype, setBloodtype] = useState<string>('')
    let [name, setName] = useState<string>('')
    let [minimumMonths, setMinimumMonths] = useState<string>('')
    let [modifyValue, setModifyValue] = useState<'distance' | 'months'>(
        'months'
    )
    let inputRef = useRef<TextInput>(null)
    let [showModal, setShowModal] = useState<boolean>(false)

    let [showBloodTypeModal, setShowBloodTypeModal] = useState<boolean>(false)
    let [openUnverified, setOpenUnverified] = useState<boolean>(false)
    let [requireUsersVerified, setRequireUsersVerified] =
        useState<boolean>(true)
    let [requireUsersAffiliated, setRequireUsersAffiliated] =
        useState<boolean>(false)
    let [radius, setRadius] = useState<string>('')
    let [token, setToken] = useState<string | null>('')
    let [resultData, setResultData] = useState<any>([])
    let [loading, setLoading] = useState<boolean>(false)

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

    useEffect(() => {
        async function getToken() {
            let t = await SecureStore.getItemAsync('token')
            setToken(t)
        }
        getToken()
    }, [])
    async function queryDonors(refresh = false, unverified = false) {
        if (refresh) setRefreshing(true)
        setResultData([])
        setLoading(true)
        let token = await SecureStore.getItemAsync('token')
        fetch(`http://localhost:3000/hq/queryDonors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                unverified
                    ? {
                          token: token,
                          unverified: true,
                      }
                    : {
                          token: token,
                          months: minimumMonths,
                          verified: requireUsersVerified,
                          affiliated: requireUsersAffiliated,
                          distance: radius,
                          bloodtype: bloodtype,
                          name: name,
                          unverified: false,
                      }
            ),
        })
            .then((response) => response.json())
            .then((response) => {
                if (refresh) setRefreshing(false)
                if (!unverified) setExpandSearchBox(false)
                if (response.error) {
                    Alert.alert('Error', 'Unauthorized Access', [
                        {
                            text: 'Go back',
                            onPress: () => {
                                SecureStore.deleteItemAsync('token')
                                router.navigate('/')
                            },
                        },
                    ])
                } else {
                    setLoading(false)
                    if (unverified) setOpenUnverified(true)
                    console.log(response.data)
                    setResultData(response.data)
                }
            })
            .catch((error) => {
                if (refresh) setRefreshing(false)
                setLoading(false)
                Alert.alert('Error', 'Failed to fetch data')
            })
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setShowModal(false)
                }}
                visible={showModal}
            >
                <TouchableOpacity
                    onPressOut={() => {
                        setShowModal(false)
                    }}
                    style={{
                        flex: 1,
                    }}
                />
                <View
                    style={{
                        height: '55%',
                        borderRadius: 25,
                        padding: 16,
                        marginTop: 'auto',
                        backgroundColor: 'white',
                    }}
                >
                    <KeyboardAwareScrollView>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                Set minimum {modifyValue}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    setShowModal(false)
                                    modifyValue == 'months'
                                        ? setMinimumMonths('')
                                        : setRadius('')
                                }}
                            >
                                <Text style={{ fontSize: 20, color: 'red' }}>
                                    Remove
                                </Text>
                            </Pressable>
                            <Pressable onPress={() => setShowModal(false)}>
                                <Text
                                    style={{ fontSize: 20, color: '#7469B6' }}
                                >
                                    Done
                                </Text>
                            </Pressable>
                        </View>
                        <Text style={{ fontSize: 16, marginTop: 10 }}>
                            {modifyValue == 'months'
                                ? 'Set the minimum number of months required before the last donation'
                                : 'Set the minimum distance in kilometers from the donors to the blood bank'}
                        </Text>
                        <TextInput
                            style={{
                                ...styles.input,
                                width: '90%',
                                alignSelf: 'center',
                            }}
                            keyboardType="number-pad"
                            value={
                                modifyValue == 'months' ? minimumMonths : radius
                            }
                            ref={inputRef}
                            placeholder={
                                modifyValue == 'months'
                                    ? 'Number of months'
                                    : 'Distance in km'
                            }
                            onChangeText={(e) => {
                                modifyValue == 'months'
                                    ? setMinimumMonths(e.replace(/[^0-9]/g, ''))
                                    : setRadius(e.replace(/[^0-9]/g, ''))
                            }}
                            onSubmitEditing={() => setShowModal(false)}
                        />
                    </KeyboardAwareScrollView>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setShowBloodTypeModal(false)
                }}
                visible={showBloodTypeModal}
            >
                <TouchableOpacity
                    onPressOut={() => {
                        setShowBloodTypeModal(false)
                    }}
                    style={{
                        flex: 1,
                    }}
                />
                <View
                    style={{
                        height: '55%',
                        borderRadius: 25,
                        padding: 16,
                        marginTop: 'auto',
                        backgroundColor: 'white',
                    }}
                >
                    <KeyboardAwareScrollView>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                Set required blood type
                            </Text>
                            <Pressable
                                onPress={() => {
                                    setShowBloodTypeModal(false)
                                    setBloodtype('')
                                }}
                            >
                                <Text style={{ fontSize: 20, color: 'red' }}>
                                    Remove
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setShowBloodTypeModal(false)}
                            >
                                <Text
                                    style={{ fontSize: 20, color: '#7469B6' }}
                                >
                                    Done
                                </Text>
                            </Pressable>
                        </View>
                        <Text style={{ fontSize: 16, marginTop: 10 }}>
                            Set the required blood type of the donors.
                        </Text>
                        <Picker
                            selectedValue={bloodtype}
                            onValueChange={setBloodtype}
                        >
                            <Picker.Item label="Not required" value="" />
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
                    </KeyboardAwareScrollView>
                </View>
            </Modal>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '80%',
                    marginBottom: 50,
                    marginTop: 20,
                }}
            >
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    JIPMER{' '}
                    <Text style={{ color: '#7469B6' }}>Blood Center HQ</Text>
                </Text>
                <Pressable
                    onPress={() => queryDonors(true)}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Octicons name="sync" size={24} color="#7469B6" />
                </Pressable>
            </View>
            <KeyboardAwareScrollView
                style={{
                    width: '100%',
                }}
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            queryDonors(true)
                        }}
                    />
                }
            >
                <View
                    style={{
                        alignContent: 'flex-start',
                        width: '80%',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 28,
                            textAlign: 'left',
                            color: '#7469B6',
                            fontWeight: 'bold',
                        }}
                    >
                        Donors
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 10,
                        backgroundColor: '#EBEDEF',
                        padding: 10,
                        borderRadius: 20,
                    }}
                >
                    <Pressable
                        onPress={() => {
                            setActiveHotswap(true)
                            setOpenUnverified(false)
                        }}
                        style={{
                            padding: 10,
                            borderRadius: 10,
                            width: '40%',
                            backgroundColor: activeHotswap
                                ? '#AD88C6'
                                : '#D3D3D3',
                        }}
                    >
                        <Text
                            style={{
                                color: activeHotswap ? 'white' : 'black',
                                fontSize: 18,
                                textAlign: 'center',
                            }}
                        >
                            Custom Search
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setResultData([])
                            setActiveHotswap(false)
                            queryDonors(false, true)
                        }}
                        style={{
                            padding: 10,
                            borderRadius: 10,
                            width: '40%',
                            borderColor: '#D3D3D3',
                            backgroundColor: openUnverified
                                ? '#AD88C6'
                                : '#D3D3D3',
                        }}
                    >
                        <Text
                            style={{
                                color: openUnverified ? 'white' : 'black',
                                fontSize: 18,
                                textAlign: 'center',
                            }}
                        >
                            Unverified
                        </Text>
                    </Pressable>
                </View>
                {activeHotswap ? (
                    <Pressable
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '80%',
                            marginTop: 20,
                            alignSelf: 'center',
                        }}
                        onPress={() => setExpandSearchBox(!expandSearchBox)}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                alignSelf: 'flex-start',
                                fontWeight: 'bold',
                            }}
                        >
                            Search
                        </Text>
                        <Octicons
                            name={
                                expandSearchBox ? 'chevron-up' : 'chevron-down'
                            }
                            size={28}
                            color="#7469B6"
                        />
                    </Pressable>
                ) : null}
                {expandSearchBox ? (
                    <View
                        style={{
                            width: '90%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20,
                            backgroundColor: '#EBEDEF',
                            borderRadius: 20,
                        }}
                    >
                        {activeHotswap ? (
                            <Pressable
                                onPress={() =>
                                    setExpandCriteria(!expandCriteria)
                                }
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '80%',
                                    marginTop: 20,
                                    alignSelf: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        alignSelf: 'flex-start',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Criteria
                                </Text>
                                <Octicons
                                    name={
                                        expandCriteria
                                            ? 'chevron-up'
                                            : 'chevron-down'
                                    }
                                    size={28}
                                    color="#7469B6"
                                />
                            </Pressable>
                        ) : null}
                        {activeHotswap ? (
                            <ScrollView
                                horizontal={!expandCriteria}
                                contentContainerStyle={{
                                    gap: 10,
                                    padding: 9,
                                    borderRadius: 25,
                                }}
                                style={{
                                    width: '85%',
                                    backgroundColor: '#fff',
                                    borderRadius: 25,
                                    marginTop: 5,
                                }}
                                showsHorizontalScrollIndicator={false}
                            >
                                <Pressable
                                    onPress={() => {
                                        setShowBloodTypeModal(true)
                                    }}
                                    style={{
                                        backgroundColor:
                                            bloodtype == ''
                                                ? '#DDE1E4'
                                                : '#AD88C6',
                                        padding: 10,
                                        borderRadius: 16,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            textAlign: 'left',
                                            color:
                                                bloodtype == ''
                                                    ? 'black'
                                                    : 'white',
                                        }}
                                    >
                                        {bloodtype == ''
                                            ? 'Blood type'
                                            : `${bloodtype} blood type`}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        setModifyValue('distance')
                                        setShowModal(true)
                                        inputRef.current?.focus()
                                    }}
                                    style={{
                                        backgroundColor:
                                            radius == ''
                                                ? '#DDE1E4'
                                                : '#AD88C6',
                                        padding: 10,
                                        borderRadius: 16,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            textAlign: 'left',
                                            color:
                                                radius == ''
                                                    ? 'black'
                                                    : 'white',
                                        }}
                                    >
                                        {radius == ''
                                            ? 'Minimum distance'
                                            : `${radius} km radius`}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        setModifyValue('months')
                                        setShowModal(true)
                                        inputRef.current?.focus()
                                    }}
                                    style={{
                                        backgroundColor:
                                            minimumMonths == ''
                                                ? '#DDE1E4'
                                                : '#AD88C6',
                                        padding: 10,
                                        borderRadius: 16,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            textAlign: 'left',
                                            color:
                                                minimumMonths == ''
                                                    ? 'black'
                                                    : 'white',
                                        }}
                                    >
                                        {minimumMonths}{' '}
                                        {minimumMonths == '' ? 'M' : 'm'}inimum
                                        month
                                        {parseInt(minimumMonths) == 1
                                            ? ''
                                            : 's'}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        setRequireUsersVerified(
                                            !requireUsersVerified
                                        )
                                    }}
                                    style={{
                                        backgroundColor:
                                            requireUsersVerified == true
                                                ? '#AD88C6'
                                                : '#DDE1E4',
                                        padding: 10,
                                        borderRadius: 16,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            textAlign: 'left',
                                            color:
                                                requireUsersVerified == true
                                                    ? 'white'
                                                    : 'black',
                                        }}
                                    >
                                        Verification{' '}
                                        {requireUsersVerified
                                            ? 'required'
                                            : 'not required'}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        setRequireUsersAffiliated(
                                            !requireUsersAffiliated
                                        )
                                    }}
                                    style={{
                                        backgroundColor:
                                            requireUsersAffiliated == true
                                                ? '#AD88C6'
                                                : '#DDE1E4',
                                        padding: 10,
                                        borderRadius: 16,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            textAlign: 'left',
                                            color:
                                                requireUsersAffiliated == true
                                                    ? 'white'
                                                    : 'black',
                                        }}
                                    >
                                        Affiliation{' '}
                                        {requireUsersAffiliated
                                            ? 'required'
                                            : 'not required'}
                                    </Text>
                                </Pressable>
                            </ScrollView>
                        ) : null}
                        {activeHotswap ? (
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    width: '90%',
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '90%',
                                        alignSelf: 'center',
                                        marginTop: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            alignSelf: 'flex-start',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Name
                                    </Text>
                                    <Pressable onPress={() => setName('')}>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: 'red',
                                            }}
                                        >
                                            Clear
                                        </Text>
                                    </Pressable>
                                </View>
                                <TextInput
                                    style={{
                                        ...styles.input,
                                        width: '90%',
                                        alignSelf: 'center',
                                        marginTop: 10,
                                        backgroundColor: '#fff',
                                    }}
                                    placeholder="Type here"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        ) : null}
                        {activeHotswap ? (
                            <Button
                                onPress={() => {
                                    queryDonors(false)
                                }}
                            >
                                Search!
                            </Button>
                        ) : null}
                    </View>
                ) : null}
                {loading ? (
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                            marginTop: 20,
                        }}
                    >
                        Loading...
                    </Text>
                ) : (
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 10,
                            marginTop: 20,
                            marginBottom: 100,
                        }}
                    >
                        {resultData.map((donor: any) => {
                            return (
                                <View
                                    style={{
                                        width: '90%',
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10,
                                        gap: 10,
                                    }}
                                    key={donor.uuid}
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {donor.name}{' '}
                                        <Text style={{ color: 'red' }}>
                                            ({donor.bloodtype})
                                        </Text>
                                        {'  '}
                                        {donor.affiliated ? '🏥' : ''}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: 25,
                                            margin: 'auto',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: donor.verified
                                                    ? '#26CD41'
                                                    : '#FF3B2F',
                                            }}
                                        >
                                            {donor.verified
                                                ? 'Verified'
                                                : 'Unverified'}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color:
                                                    donor.distance < 5
                                                        ? '#35C759'
                                                        : donor.distance < 10
                                                        ? '#FF9503'
                                                        : '#FF3B31',
                                            }}
                                        >
                                            {parseFloat(
                                                donor.distance < 1
                                                    ? donor.distance * 1000
                                                    : donor.distance
                                            )
                                                .toPrecision(2)
                                                .toString()
                                                .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                )}{' '}
                                            {donor.distance < 1 ? 'm' : 'km'}{' '}
                                            away
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: 5,
                                            justifyContent: 'center',
                                            alignSelf: 'flex-start',
                                            width: '100%',
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                gap: 5,
                                                backgroundColor: '#F3F3F3',
                                                padding: 10,
                                                borderRadius: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {convertTimestampToShortString(
                                                    donor.lastdonated
                                                )}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                }}
                                            >
                                                Last donated
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                gap: 5,
                                                backgroundColor: '#F3F3F3',
                                                padding: 10,
                                                borderRadius: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {donor.totaldonations || 0}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                }}
                                            >
                                                Total donations
                                            </Text>
                                        </View>
                                    </View>
                                    <Pressable
                                        onPress={() => {
                                            router.push(`tel:${donor.phone}`)
                                        }}
                                        style={{
                                            alignSelf: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: '#7469B6',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Call +91 {donor.phone}
                                        </Text>
                                    </Pressable>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: 10,
                                        }}
                                    >
                                        <Button
                                            style={{ marginTop: 10 }}
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/verifydonor',
                                                    params: {
                                                        uuid: donor.uuid,
                                                        token: token,
                                                    },
                                                })
                                            }}
                                        >
                                            {donor.verified
                                                ? 'View donor'
                                                : 'Verify'}
                                        </Button>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                )}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}