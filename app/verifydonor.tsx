import {
    View,
    Platform,
    Text,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Linking,
} from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import Octicons from '@expo/vector-icons/Octicons'
import { Picker } from '@react-native-picker/picker'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FreeButton from '@/components/FreeButton'
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
    let [bloodtype, setBloodtype] = useState<string>('')
    let [conditions, setConditions] = useState<string>('')
    let [medications, setMedications] = useState<string>('')
    const token = local.token

    let [name, setName] = useState<string>('')
    let [phone, setPhone] = useState<string>('')
    let [dob, setDob] = useState<string>('')
    let [affiliated, setAffiliated] = useState<boolean>(false)
    let [affiliatedData, setAffiliatedData] = useState<{
        designation: string
        yearOfJoining: string
        department: string
    } | null>(null)
    let [height, setHeight] = useState<string>('')
    let [weight, setWeight] = useState<string>('')
    let [distance, setDistance] = useState<string>('')
    let [sex, setSex] = useState('')
    let [verified, setVerified] = useState<boolean>(false)
    let [lastDonated, setLastDonated] = useState<string>('')
    let [totalDonations, setTotalDonations] = useState<string>('0')

    let [verifying, setVerifying] = useState<boolean>(false)
    let [rejecting, setRejecting] = useState<boolean>(false)
    let [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        fetch(`http://localhost:3000/hq/requestUserData`, {
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
                    console.log(response.data)
                    setLoading(false)
                    setName(response.data.name)
                    setBloodtype(response.data.bloodtype)
                    setPhone(response.data.phone)
                    setDob(response.data.dob)
                    setAffiliated(response.data.affiliated)
                    setAffiliatedData(response.data.affiliatedata)
                    setHeight(response.data.height)
                    setWeight(response.data.weight)
                    setDistance(response.data.distance)
                    setSex(response.data.sex)
                    setVerified(response.data.verified)
                    setLastDonated(response.data.lastdonated)
                    setTotalDonations(response.data.totaldonated)
                }
            })
            .catch((error) => {
                alert(error)
                router.dismiss()
            })
    }, [])

    function verifyDonor() {
        setVerifying(true)
        fetch(`http://localhost:3000/hq/verifyDonor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                uuid: uuid,
                bloodtype: bloodtype,
                conditions: conditions,
                medications: medications,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.error) {
                    setVerifying(false)
                    alert(response.message)
                } else {
                    alert(response.message)
                    setVerified(true)
                }
            })
            .catch((error) => {
                setVerifying(false)
                alert(error)
            })
    }

    function rejectDonor() {
        setRejecting(true)
        fetch(`http://localhost:3000/rejectDonor`, {
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
                if (!response.error) {
                    setRejecting(false)
                    alert(response.message)
                    Alert.alert('Error', response.message, [
                        {
                            text: 'OK',
                            onPress: () => router.dismiss(),
                        },
                        {
                            text: 'Call donor',
                            onPress: () => {
                                Linking.openURL(`tel:${phone}`)
                            },
                        },
                    ])
                } else {
                    Alert.alert('Error', response.message, [
                        {
                            text: 'OK',
                            onPress: () => router.dismiss(),
                        },
                        {
                            text: 'Call donor',
                            onPress: () => {
                                Linking.openURL(`tel:${phone}`)
                            },
                        },
                        {
                            text: 'Get support',
                            onPress: () => {
                                Linking.openURL(`mailto:mihir@pidgon.com`)
                            },
                        },
                    ])
                    router.dismiss()
                }
            })
            .catch((error) => {
                setRejecting(false)
                alert(error)
            })
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{
                justifyContent: 'center',
                marginTop: 40,
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
                        {name}
                    </Text>
                    <Text
                        style={{
                            fontSize: 24,
                            color: 'grey',
                            textAlign: 'center',
                        }}
                    >
                        +91 {phone}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'column',
                            gap: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            <Card
                                title={bloodtype}
                                icon={'heart'}
                                iconColor={'#F34573'}
                                subtitle={`Blood Group`}
                                border={true}
                            />
                            <Card
                                title={verified ? 'Verified' : 'Not\nVerified'}
                                icon={verified ? 'verified' : 'unverified'}
                                iconColor={verified ? '#35C759' : '#F34573'}
                                border={true}
                                subtitle=""
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            <Card
                                title={`${
                                    //calculate age accurately. use months
                                    Math.floor(
                                        (new Date().getTime() -
                                            new Date(dob).getTime()) /
                                            (1000 * 60 * 60 * 24 * 30 * 12)
                                    )
                                }`}
                                icon="person"
                                iconColor={'black'}
                                subtitle={'years old'}
                                border={true}
                            />
                            <Card
                                title={
                                    affiliated ? 'Affiliated' : 'Unaffiliated'
                                }
                                icon={affiliated ? 'pulse' : 'x'}
                                iconColor={affiliated ? '#35C759' : '#F34573'}
                                subtitle={`with JIPMER`}
                                border={true}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            <Card
                                title={`${height} cm`}
                                icon="diff"
                                iconColor={'black'}
                                subtitle={'height'}
                                border={true}
                            />
                            <Card
                                title={`${weight} kg`}
                                icon="diff"
                                iconColor={'black'}
                                subtitle={'weight'}
                                border={true}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            <Card
                                title={convertTimestampToShortString(
                                    lastDonated
                                )}
                                icon="graph"
                                iconColor={'#'}
                                subtitle={'Last Donated'}
                                border={true}
                            />
                            <Card
                                title={totalDonations}
                                icon="sort-asc"
                                iconColor={'black'}
                                subtitle={'total donations'}
                                border={true}
                            />
                        </View>
                        {affiliated ? (
                            <>
                                <Text
                                    style={{
                                        fontSize: 24,
                                        textAlign: 'center',
                                    }}
                                >
                                    Affiliation Data
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        gap: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            gap: 10,
                                        }}
                                    >
                                        <Card
                                            title={
                                                affiliatedData?.department || ''
                                            }
                                            icon="id-badge"
                                            iconColor={'black'}
                                            subtitle={'Department'}
                                            border={true}
                                        />
                                        <Card
                                            title={
                                                affiliatedData?.designation ||
                                                ''
                                            }
                                            icon="people"
                                            iconColor={'black'}
                                            subtitle={'Designation'}
                                            border={true}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            gap: 10,
                                        }}
                                    >
                                        <Card
                                            title={
                                                affiliatedData?.yearOfJoining?.toString() ||
                                                ''
                                            }
                                            icon="hourglass"
                                            iconColor={'black'}
                                            subtitle={'Joining year'}
                                            border={true}
                                        />
                                    </View>
                                </View>
                            </>
                        ) : null}
                    </View>
                    <View
                        style={{
                            borderColor: '#FF3B2F',
                            borderWidth: 2,
                            backgroundColor: '#FAF9F6',
                            padding: 10,
                            borderRadius: 5,
                            width: '90%',
                            margin: 'auto',
                            marginBottom: 50,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 24,
                                color: '#FF3B2F',
                                fontWeight: 'bold',
                            }}
                        >
                            {verified
                                ? 'Danger Zone'
                                : 'This donor is not verified.'}
                        </Text>
                        {verified ? (
                            <Text style={{ fontSize: 18, color: 'black' }}>
                                Modify blood type
                            </Text>
                        ) : (
                            <Text style={{ fontSize: 18, color: 'black' }}>
                                Please verify their blood group before allowing
                                them to donate.
                            </Text>
                        )}
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
                        <Text style={{ fontSize: 18, margin: 10 }}>
                            {conditions.trim() == '' && medications.trim() == ''
                                ? 'No'
                                : null}{' '}
                            Conditions and Medications
                        </Text>
                        <Text style={{ fontSize: 18, margin: 10 }}>
                            If the donor has any conditions or medications,
                            please enter them here. Leave blank if none.
                        </Text>
                        <TextInput
                            placeholder="Conditions"
                            value={conditions}
                            onChangeText={setConditions}
                            multiline={true}
                            style={{
                                margin: 10,
                                borderRadius: 9,
                                backgroundColor: '#F3F3F3',
                                height: 100,
                            }}
                        />
                        <TextInput
                            placeholder="Medications"
                            value={medications}
                            onChangeText={setMedications}
                            multiline={true}
                            style={{
                                margin: 10,
                                borderRadius: 9,
                                backgroundColor: '#F3F3F3',
                                height: 100,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            <FreeButton
                                onPress={()=>{
                                    Alert.alert('Warning', 'Are you sure you want to reject this donor?', [
                                        {
                                            text: 'Cancel',
                                            onPress: () => {},
                                        },
                                        {
                                            text: 'Reject',
                                            onPress: () => {
                                                rejectDonor()
                                            },
                                            style: 'destructive',
                                        },
                                    ])
                                }}
                                disabled={rejecting}
                                style={{ width: '40%', backgroundColor: 'red' }}
                            >
                                <Text>{verified ? 'Remove' : 'Reject'}{rejecting ? 'ing...' : ''}</Text>
                            </FreeButton>
                            <FreeButton
                                onPress={verifyDonor}
                                disabled={verifying}
                                style={{ width: '40%' }}
                            >
                                <Text>
                                    {verified ? 'Confirm' : 'Verify'}
                                    {verifying ? 'ing...' : ''}
                                </Text>
                            </FreeButton>
                        </View>
                    </View>
                </View>
            )}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </KeyboardAwareScrollView>
    )
}
