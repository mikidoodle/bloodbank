import {
  View,
  Platform,
  Text,
  Alert,
  Pressable,
  ScrollView,
  useColorScheme,
  Switch,
  TextInput,
} from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import Octicons from '@expo/vector-icons/Octicons'
import { Picker } from '@react-native-picker/picker'
import Button from '@/components/Button'
import * as SecureStore from 'expo-secure-store'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker'
import styles from '@/assets/styles/styles'
import FreeButton from '@/components/FreeButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default function Modal() {
  let { name, phone, birthday, coords }: any = useLocalSearchParams()
  let [dob, setDob] = useState<string>(birthday || new Date().toISOString())
  let [distance, setDistance] = useState<number | null>(null)
  //custom address
  let [addressText, setAddressText] = useState<string>('')
  let [useCustomLocation, setUseCustomLocation] = useState<boolean>(false)
  let [formattedAddress, setFormattedAddress] = useState<string>('')
  let [geocodeLookupId, setGeocodeLookupId] = useState<string>('')
  let [isLocatingCustomAddress, setIsLocatingCustomAddress] =
    useState<boolean>(false)

  useEffect(() => {

    SecureStore.getItemAsync('lookup').then((res) => {
      if (res) {
        console.log('Found lookup', res)
        setGeocodeLookupId(res)
      }
    })
  }, [])

  let [userDefinedLocation, setUserDefinedLocation] = useState<{
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  } | null>(coords.hasOwnProperty('latitude') ? coords : null)
  let [errorMsg, setErrorMsg] = useState<string>('')
  let [disable, setDisable] = useState<boolean>(false)
  let text = ''
  let [uuid, setUUID] = useState<string | null>(null)
  useEffect(() => {
    async function setToken() {
      let e = await SecureStore.getItemAsync('token')
      setUUID(e)
    }
    setToken()
  })
  async function updateLocation() {
    let nowDate = new Date()
    //check if user is 18
    let dobDate = new Date(dob)
    if (nowDate.getFullYear() - dobDate.getFullYear() < 18) {
      Alert.alert('You must be 18 years old to donate blood.', '', [
        {
          text: 'Contact Support',
          onPress: () => {
            router.push('tel:+914132296666')
          },
        },
        {
          text: 'OK',
          onPress: () => {},
        },
      ])
      return
    } else {
      setDisable(true)
      fetch('http://192.168.1.29:3000/updateLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: uuid,
          distance: distance,
          coords: useCustomLocation ?
            formattedAddress
          : userDefinedLocation
            ? `${userDefinedLocation.latitude},${userDefinedLocation.longitude}`
            : '',
          lookupid: geocodeLookupId,
        }),
      })
        .then((res) => res.json())
        .then(async (res) => {
          setDisable(false)
          if (res.error) {
            Alert.alert('An error occurred. Please try again.', res.message, [
              {
                text: 'OK',
                onPress: () => {},
              },
              {
                text: 'Get help',
                onPress: () => {
                  router.push('mailto:mihir@pidgon.com')
                },
              },
            ])
          } else {
            await SecureStore.deleteItemAsync('lookup')
            router.dismissAll()
            router.replace('/user')
          }
        })
        .catch((e) => {
          Alert.alert('An error occurred. Please try again.', JSON.stringify(e))
          setDisable(false)
        })
    }
  }

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
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c
    setDistance(d)
  }

  
  // Converts numeric degrees to radians
  function toRad(v: number) {
    return (v * Math.PI) / 180
  }

  async function geocodeAddress() {
    setIsLocatingCustomAddress(true)
    fetch(`http://192.168.1.29:3000/geocodeAndCalculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: addressText,
        uuid: geocodeLookupId,
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
          setFormattedAddress(res.data.formattedAddress)
          console.log(distance)
          setGeocodeLookupId(res.data.uuid)
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

  let isDarkMode = useColorScheme() === 'dark'
  return (
    <KeyboardAwareScrollView
      style={{
        marginBottom: 30,
        marginTop: 30,
      }}
      contentContainerStyle={{
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center',
        gap: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Thanks for installing,{'\n'}{' '}
        <Text
          style={{
            color: '#7469B6',
          }}
        >
          {name}
        </Text>
        !
      </Text>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 40,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            color: '#7469B6',
            marginBottom: 25,
          }}
        >
          Your JIPMER Blood Center account has been created, and all your data
          has been migrated.{'\n'}
        </Text>
        <View
          style={{
            flexDirection: 'column',
            gap: 30,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'space-between',
              alignContent: 'center',
              width: '85%',
            }}
          >
            <Text
              style={{
                fontSize: 28,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              📲
            </Text>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              The next time you donate blood, open the app and show an employee
              your unique QR code to log your donation.
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'space-between',
              alignContent: 'center',
              width: '85%',
            }}
          >
            <Text
              style={{
                fontSize: 28,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              ✅
            </Text>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Since you're a pre-existing donor, you do not require further
              verification.
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'space-between',
              alignContent: 'center',
              width: '85%',
            }}
          >
            <Text
              style={{
                fontSize: 28,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              🩸
            </Text>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              You will receive alerts on your phone when the blood bank is in
              urgent need of your blood type.
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 20 }}>
          As a final step, please confirm your information.
        </Text>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          1. Set your birthday
        </Text>
        {Platform.OS === 'android' ? (
          <Pressable
            onPress={() => {
              DateTimePickerAndroid.open({
                value: new Date(dob),
                mode: 'date',
                onChange(event, date) {
                  if (date) setDob(date.toISOString())
                },
              })
            }}
            style={{
              padding: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#7469B6',
              marginBottom: 20,
            }}
          >
            <Text>{new Date(dob).toLocaleDateString()}</Text>
          </Pressable>
        ) : (
          <DateTimePicker
            value={new Date(dob)}
            mode="date"
            display="default"
            style={{
              alignSelf: 'center',
              marginBottom: 20,
            }}
            onChange={(event, date) => {
              if (date) setDob(date.toISOString())
            }}
          />
        )}
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          1. Set your location
        </Text>
        <View
          style={{
            width: '90%',
          }}
        >
          {distance && !useCustomLocation ? (
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 20,
                color: isDarkMode ? 'white' : 'black',
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
                color: isDarkMode ? 'white' : 'black',
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
                  style={{ width: '100%', height: 300, borderRadius: 20 }}
                  region={userDefinedLocation}
                  onRegionChangeComplete={(r) => {
                    setUserDefinedLocation(r)
                    calcCrow(r)
                  }}
                  zoomControlEnabled={true}
                  provider={Platform.OS === 'ios' ? undefined : 'google'}
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
              formattedAddress !== '' &&
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
                    {formattedAddress}
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

              <Button
                onPress={updateLocation}
                disabled={useCustomLocation ? !distance : !userDefinedLocation}
                style={{
                  width: '50%',
                }}
              >
                Confirm
              </Button>
            </>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}
