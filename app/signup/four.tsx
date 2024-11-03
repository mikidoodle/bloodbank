import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../../assets/styles/styles'
import { Picker } from '@react-native-picker/picker'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
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
  const [userDefinedLocation, setUserDefinedLocation] = useState<any | null>(
    route.params?.location
  )
  const [distance, setDistance] = useState<number | null>(
    route.params?.distance
  )
  delete route.params?.location
  delete route.params?.distance
  const [errorMsg, setErrorMsg] = useState<string>('')
  let [addressText, setAddressText] = useState<string>('')
  let [useCustomLocation, setUseCustomLocation] = useState<boolean>(false)
  let [customAddressLookupID, setCustomAddressLookupID] = useState<string>('')

  let [isLocatingCustomAddress, setIsLocatingCustomAddress] =
    useState<boolean>(false)
  let [customLocationFormattedAddress, setCustomLocationFormattedAddress] =
    useState<string>('')
  let text = ''

  useEffect(() => {
    SecureStore.getItemAsync('lookup').then((res) => {
      if (res) {
        console.log('Found lookup')
        setCustomAddressLookupID(res)
      }
    })
  }, [])

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

    let location = await Location.getLastKnownPositionAsync({})
    if (!location) {
      location = await Location.getCurrentPositionAsync({})
    }
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
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c
    setDistance(d)
  }

  // Converts numeric degrees to radians
  function toRad(v: number) {
    return (v * Math.PI) / 180
  }

  let responsiveDark = useColorScheme() === 'dark' ? 'white' : 'black'

  async function geocodeAddress() {
    setIsLocatingCustomAddress(true)
    fetch(`http://192.168.1.29:3000/geocodeAndCalculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: addressText,
        uuid: customAddressLookupID,
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.error) {
          if (res.message == 'ratelimit') {
            Alert.alert(
              'Error',
              `You've reached the monthly limit for address lookups. Please try again next month, or use the map to locate your address.`
            )
          } else {
            Alert.alert(
              'Error',
              'We could not locate the address you entered. Please try again, or use the map to locate your address.'
            )
          }
          setIsLocatingCustomAddress(false)
        } else {
          Alert.alert(
            'Address located!',
            'For security reasons, your exact address cannot be displayed. Please ensure that the distance is roughly accurate. If not, enter a more specific address and try again.'
          )
          setIsLocatingCustomAddress(false)
          setDistance(res.data.distance)
          setCustomLocationFormattedAddress(res.data.formattedAddress)
          console.log(distance)
          setCustomAddressLookupID(res.data.uuid)
          await SecureStore.setItemAsync('lookup', res.data.uuid)
        }
      })
      .catch((e) => {
        console.log(e)
        setIsLocatingCustomAddress(false)
        setErrorMsg('An error occurred. Please try again.')
        setDistance(null)
        setUserDefinedLocation(null)
      })
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
            alignSelf: 'center',
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
              <Octicons name="arrow-left" size={24} color={responsiveDark} />
            </Pressable>
            <Text
              style={{
                fontSize: 24,
                textAlign: 'center',
                color: responsiveDark,
              }}
            >
              JIPMER <Text style={{ color: '#7469B6' }}>Blood Center</Text>
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
            color: responsiveDark,
          }}
        >
          Sign up | <Text style={{ color: '#7469B6' }}>Location</Text>
        </Text>
        <View
          style={{
            width: '80%',
          }}
        >
          {distance && !useCustomLocation ? (
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 20,
                color: responsiveDark,
              }}
            >
              Tap and drag the map to move the marker to your location.{' '}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 20,
                color: responsiveDark,
              }}
            >
              Knowing your distance from our blood bank allows us to prioritize
              contacting you in urgent situations.
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
            ) : userDefinedLocation && !useCustomLocation ? (
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
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                        {distance < 1 ? 'm' : 'km'} from Blood Bank
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
                        Reset
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
                <MapView
                  provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
                  style={{ width: '100%', height: 300, borderRadius: 20 }}
                  region={userDefinedLocation}
                  onRegionChangeComplete={(r) => {
                    setUserDefinedLocation(r)
                    calcCrow(r)
                  }}
                  zoomControlEnabled={true}
                >
                  <Marker
                    coordinate={{
                      latitude: userDefinedLocation.latitude,
                      longitude: userDefinedLocation.longitude,
                    }}
                    title="Your Location"
                  />
                  <Marker
                    coordinate={{
                      latitude: 11.953852,
                      longitude: 79.797765,
                    }}
                    title="Blood Bank"
                    pinColor="blue"
                  />
                </MapView>
              </View>
            ) : !useCustomLocation ? (
              <Button
                onPress={getLocation}
                style={{
                  width: '50%',
                }}
              >
                Get Location
              </Button>
            ) : null}

            {!useCustomLocation ? (
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                Please ensure you are at your permanent location. If not, enter
                your address below and we'll locate you.
              </Text>
            ) : null}
            <>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginBottom: 10,
                    alignSelf: 'center',
                  }}
                >
                  Use custom address (limited)
                </Text>
                <Switch
                  onValueChange={() => {
                    let future = !useCustomLocation
                    if (future) {
                      setDistance(null)
                      setUserDefinedLocation(null)
                    } else getLocation()
                    setUseCustomLocation(future)
                  }}
                  value={useCustomLocation}
                />
              </View>
              {distance &&
              customLocationFormattedAddress !== '' &&
              useCustomLocation ? (
                <>
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: 'center',
                      borderRadius: 10,
                      borderWidth: 1,
                      padding: 10,
                      width: 320,
                    }}
                  >
                    {customLocationFormattedAddress}
                  </Text>
                  <View
                    style={{
                      borderRadius: 10,
                      width: '90%',
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
                        textAlign: 'center',
                      }}
                    >
                      {parseFloat(
                        (distance < 1 ? distance * 1000 : distance).toPrecision(
                          2
                        )
                      )
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                      {distance < 1 ? 'm' : 'km'} from Blood Bank
                    </Text>
                  </View>
                </>
              ) : null}
              {useCustomLocation ? (
                <View>
                  <TextInput
                    placeholder="Enter your address"
                    style={styles.input}
                    value={addressText}
                    onChangeText={setAddressText}
                  />
                  <FreeButton
                    onPress={geocodeAddress}
                    disabled={isLocatingCustomAddress}
                  >
                    {isLocatingCustomAddress ? 'Locating...' : 'Locate Address'}
                  </FreeButton>
                </View>
              ) : null}
            </>
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
                location: useCustomLocation
                  ? {
                      lookup: customAddressLookupID,
                      address: customLocationFormattedAddress,
                    }
                  : userDefinedLocation,
                distance: distance,
              })
            }}
            disabled={
              userDefinedLocation
                ? false
                : useCustomLocation
                ? customAddressLookupID === ''
                : true
            }
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
