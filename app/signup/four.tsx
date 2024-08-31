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
import MapView, { Marker } from 'react-native-maps'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import TwoRowInput from '@/components/TwoRowInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Progress from 'react-native-progress'
import { Octicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import FreeButton from '@/components/FreeButton'
import * as Location from 'expo-location'
export default function Four({
    navigation,
    route,
}: {
    navigation: any
    route: any
}) {
    //const [location, setLocation] = useState<Location.LocationObject | null>()
    const [userDefinedLocation, setUserDefinedLocation] = useState<any | null>(
        route.params?.location
    )
    const [distance, setDistance] = useState<number | null>(
        route.params?.distance
    )
    delete route.params?.location
    delete route.params?.distance
    const [errorMsg, setErrorMsg] = useState<string>('')
    let text = ''
    async function getLocation() {
        setErrorMsg('')
        text = 'Getting location...'
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied')
            setDistance(null)
            setUserDefinedLocation(null)
            return
        }

        let location = await Location.getCurrentPositionAsync({})
        setUserDefinedLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        })
        calcCrow({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        })

        console.log(location)
    }

    function calcCrow(region: { latitude: number; longitude: number }) {
        let lat = region.latitude
        let lon = region.longitude
        let bbLat = 11.953852
        let bbLon = 79.797765
        var R = 6371 // km
        var dLat = toRad(bbLat - lat)
        var dLon = toRad(bbLon - lon)
        var lat1 = toRad(lat)
        var lat2 = toRad(bbLat)

        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
                Math.sin(dLon / 2) *
                Math.cos(lat1) *
                Math.cos(lat2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        var d = R * c
        setDistance(d)
    }

    // Converts numeric degrees to radians
    function toRad(v: number) {
        return (v * Math.PI) / 180
    }
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
                        progress={0.8}
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
                    Sign up | <Text style={{ color: '#7469B6' }}>Location</Text>
                </Text>
                <View
                    style={{
                        width: '80%',
                    }}
                >
                    {distance ? (
                        <Text
                            style={{
                                fontSize: 16,
                                textAlign: 'center',
                                marginBottom: 20,
                            }}
                        >
                            Tap and drag the map to move the marker to your
                            location.{' '}
                        </Text>
                    ) : (
                        <Text
                            style={{
                                fontSize: 16,
                                textAlign: 'center',
                                marginBottom: 20,
                            }}
                        >
                            Knowing your distance from our blood bank allows us
                            to prioritize contacting you in urgent situations.{'\n\n'}
                            Your location data is only used to calculate this
                            distance and will not be stored.
                        </Text>
                    )}
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 20,
                        }}
                    >
                        {errorMsg !== '' ? (
                            <>
                                <Text style={{ color: 'red' }}>{errorMsg}</Text>
                                <Button
                                    onPress={getLocation}
                                    style={{
                                        width: '50%',
                                    }}
                                >
                                    Try Again
                                </Button>
                            </>
                        ) : userDefinedLocation ? (
                            <View
                                style={{
                                    width: '100%',
                                    borderRadius: 20,
                                }}
                            >
                                {distance ? (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderRadius: 10,
                                                marginBottom: 20,
                                                padding: 10,
                                                backgroundColor:
                                                    distance < 5
                                                        ? '#35C759'
                                                        : distance < 10
                                                        ? '#FF9503'
                                                        : '#FF3B31',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: 'white',
                                                }}
                                            >
                                                {parseFloat(
                                                    (distance < 1
                                                        ? distance * 1000
                                                        : distance
                                                    ).toPrecision(2)
                                                )
                                                    .toString()
                                                    .replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ','
                                                    )}{' '}
                                                {distance < 1 ? 'm' : 'km'} from
                                                Blood Bank
                                            </Text>
                                        </View>
                                        <Pressable
                                            onPress={getLocation}
                                            style={{
                                                borderRadius: 10,
                                                marginBottom: 20,
                                                padding: 10,
                                                backgroundColor: '#AD88C6', //'#7469B6',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontSize: 16,
                                                }}
                                            >
                                                Refresh
                                            </Text>
                                        </Pressable>
                                    </View>
                                ) : null}
                                <MapView
                                    style={{
                                        width: '100%',
                                        height: 300,
                                        borderRadius: 20,
                                    }}
                                    region={userDefinedLocation}
                                    onRegionChangeComplete={(r) => {
                                        setUserDefinedLocation(r)
                                        calcCrow(r)
                                    }}
                                    zoomControlEnabled={true}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude:
                                                userDefinedLocation.latitude,
                                            longitude:
                                                userDefinedLocation.longitude,
                                        }}
                                        title="Your Location"
                                    />
                                </MapView>
                            </View>
                        ) : (
                            <Button
                                onPress={getLocation}
                                style={{
                                    width: '50%',
                                }}
                            >
                                Get Location
                            </Button>
                        )}

                        {distance ? (
                            <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
                                Please ensure this is your permanent location.
                                If not, sign up when you are, or move the map to
                                your location.
                            </Text>
                        ) : null}
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexGrow: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '80%',
                        gap: 20,
                    }}
                >
                    <FreeButton
                        onPress={() => {
                            navigation.navigate(`three`, {
                                ...route.params,
                                location: userDefinedLocation,
                                distance: distance,
                            })
                        }}
                        style={{
                            width: '25%',
                        }}
                    >
                        Back
                    </FreeButton>
                    <FreeButton
                        onPress={() => {
                            navigation.navigate(`five`, {
                                ...route.params,
                                location: userDefinedLocation,
                                distance: distance,
                            })
                        }}
                        disabled={userDefinedLocation ? false : true}
                        style={{
                            width: '40%',
                        }}
                    >
                        Next
                    </FreeButton>
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}
