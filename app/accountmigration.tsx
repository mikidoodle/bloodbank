import {
  View,
  Platform,
  Text,
  Alert,
  Pressable,
  ScrollView,
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
import { set } from 'badgin'
export default function Modal() {
  let {
    name,
    phone,
  }: {
    name: string
    phone: string
    uuid: string
  } = useLocalSearchParams()
  let [distance, setDistance] = useState<number | null>(null)
  let [userDefinedLocation, setUserDefinedLocation] = useState<{
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  } | null>(null)
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
    setDisable(true)
    fetch('https://bloodbank.pidgon.com/updateLocation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: uuid,
        distance: distance,
        coords: userDefinedLocation
          ? `${userDefinedLocation.latitude},${userDefinedLocation.longitude}`
          : '',
      }),
    })
      .then((res) => res.json())
      .then((res) => {
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
          router.dismissAll()
          router.replace('/user')
        }
      })
      .catch((e) => {
        Alert.alert('An error occurred. Please try again.', JSON.stringify(e))
      })
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
  return (
    <ScrollView
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
            fontSize: 24,
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
              The next time you donate blood, open the app and show your unique
              QR code to the employee to verify your data. Your data will be
              updated immediately to reflect your donation.
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
              verification. You can donate blood at the JIPMER Blood Center
              immediately.
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
          As a final step, please verify your location.
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
              Tap and drag the map to move the marker to your location.{' '}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Knowing your distance from our blood bank allows us to prioritize
              contacting you in urgent situations.
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            width: '100%',
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
                        (distance < 1 ? distance * 1000 : distance).toPrecision(
                          2
                        )
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
                        fontSize: 18,
                      }}
                    >
                      Reset
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
            <>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                Please ensure this is your permanent location. If not, sign up
                when you are, or move the map to your location.
              </Text>

              <Button onPress={updateLocation} disabled={disable}>
                Continue
              </Button>
            </>
          ) : null}
        </View>
      </View>
    </ScrollView>
  )
}
