import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '@/components/Button'
import { Link, router, useLocalSearchParams } from 'expo-router'
import Card from '@/components/Card'
import Octicons from '@expo/vector-icons/Octicons'

export default function Home() {
  let [refreshing, setRefreshing] = useState<boolean>(false)
  let [name, setName] = useState<string>('')
  let [donated, setDonated] = useState<number | null>(null)
  let [verified, setVerified] = useState<boolean>(true)
  let [lastDonation, setLastDonation] = useState<string>('')
  let [totalDonators, setTotalDonators] = useState<number | null>(null)
  let [log, setLog] = useState<{ x: string; y: number }[]>([])
  let [donatingSince, setDonatingSince] = useState<string>('')

  function humanizeDate(date: string) {
    let d = new Date(date)
    //return DDth MMM, YYYY at HH:MM AM/PM
    return `${d.getDate()}${
      [1, 21, 31].includes(d.getDate())
        ? 'st'
        : [2, 22].includes(d.getDate())
        ? 'nd'
        : [3, 23].includes(d.getDate())
        ? 'rd'
        : 'th'
    } ${
      [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ][d.getMonth()]
    } ${d.getFullYear()} at ${d.getHours() % 12 || 12}:${
      d.getMinutes() < 10 ? '0' : ''
    }${d.getMinutes()} ${d.getHours() > 12 ? 'PM' : 'AM'}`
  }
  async function load(refresh = false) {
    if (refresh) setRefreshing(true)
    let token = await SecureStore.getItemAsync('token')
    fetch(`http://localhost:3000/getUserData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        console.log(response)
        if (refresh) setRefreshing(false)
        if (response.error) {
          await SecureStore.deleteItemAsync('token')
          setName('')
          setDonated(null)
          setLastDonation('')
          setTotalDonators(null)
          setDonatingSince('')
          setLog([])

          Alert.alert(
            'User not found.',
            response.error, //login again redirect
            [
              {
                text: 'Sign in',
                onPress: () => {
                  SecureStore.deleteItemAsync('token')
                  router.navigate('/')
                },
              },
            ]
          )
        } else {
          setName(response.data.name)
          setDonated(response.data.donated)
          setLastDonation(response.data.lastDonated)
          setTotalDonators(response.data.totalDonators)
          setDonatingSince(response.data.donatingSince)
          setLog(response.data.log.reverse())
          setVerified(response.data.verified)
          console.log(response.data.installed)
          if (response.data.installed === false) {
            router.push({
              pathname: '/accountmigration',
              params: {
                name: response.data.name,
                phone: response.data.phone,
                coords: response.data.coords,
              },
            })
          }
        }
      })
      .catch((error) => {
        if (refresh) setRefreshing(true)
        console.log(error)
      })
  }
  useEffect(() => {
    console.log('loading')
    load(false)
  }, [])
  let isDarkMode = useColorScheme() === 'dark'
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '80%',
          marginBottom: 40,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            color: isDarkMode ? 'white' : 'black',
          }}
        >
          JIPMER <Text style={{ color: '#7469B6' }}>Blood Center</Text>
        </Text>
        <Pressable
          onPress={() => load(true)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Octicons name="sync" size={24} color="#7469B6" />
        </Pressable>
      </View>
      <ScrollView
        style={{
          width: '100%',
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        //refresh control
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              load(true)
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
              color: isDarkMode ? 'white' : 'black',
            }}
          >
            Hello{name.trim() === '' ? '!' : ', '}
            <Text style={{ color: '#7469B6', fontWeight: 'bold' }}>
              {name}
            </Text>{' '}
            <Pressable
              onPress={() => {
                if (verified) {
                  Alert.alert(
                    'Verified user',
                    'Your details have been verified by the blood center.'
                  )
                } else {
                  Alert.alert(
                    'Unverified user',
                    'Your details have not been verified yet. Please allow a few days for verification. Alternatively, you can visit or call the blood center to get verified.'
                  )
                }
              }}
            >
              {verified ? (
                <Octicons
                  name="verified"
                  size={24}
                  color="#7469B6"
                  style={{ marginLeft: 5 }}
                />
              ) : (
                <Octicons
                  name="unverified"
                  size={24}
                  color="#FF3B2F"
                  style={{ marginLeft: 5 }}
                />
              )}
            </Pressable>
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <View
            style={{
              width: '100%',
              gap: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Card
              icon="heart-fill"
              iconColor="#AD88C6"
              title={donated?.toString() || ''}
              subtitle="units donated"
            />
            <Card
              icon="calendar"
              iconColor="#AD88C6"
              title={lastDonation}
              subtitle="last donation"
            />
          </View>
          <View
            style={{
              width: '100%',
              gap: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Card
              icon="code-of-conduct"
              iconColor="#AD88C6"
              title={totalDonators?.toString() || ''}
              subtitle="total donors"
            />
            <Card
              icon="graph"
              iconColor="#AD88C6"
              title={donatingSince}
              subtitle="donating since"
            />
          </View>
          {verified == false ? (
            <View
              style={{
                width: '80%',
                backgroundColor: isDarkMode ? '#242526' : '#fff',
                borderRadius: 10,
                justifyContent: 'flex-start',
                padding: 20,
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: isDarkMode ? 'white' : 'black',
                  marginBottom: 10,
                }}
              >
                Verification status:{' '}
                <Text
                  style={{
                    color: '#FF3B2F',
                  }}
                >
                  Unverified
                </Text>
              </Text>
              <Text
                style={{ fontSize: 16, color: isDarkMode ? 'white' : 'black' }}
              >
                Your details have not been verified yet. Please allow a few days
                for verification. Alternatively, you can visit or call the blood
                center to get verified.
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'left',
            marginBottom: 20,
            width: '80%',
            marginTop: 20,
          }}
        >
          Log
        </Text>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            gap: 20,
            marginBottom: 50,
          }}
        >
          {log.map((item, index) => {
            let { x, y } = item
            let parsedXString = ''
            if (x.startsWith('v')) {
              parsedXString = `Verified blood type as ${x.split('-')[1]}`
            } else if (x.startsWith('d')) {
              parsedXString = `Donated blood`
            }

            return (
              <View
                key={index}
                style={{
                  width: '80%',
                  backgroundColor: isDarkMode ? '#242526' : '#f3f3f3',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: 20,
                  shadowColor: '#7469B6',
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: isDarkMode ? '#fff' : '#000',
                  }}
                >
                  {parsedXString}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'gray',
                  }}
                >
                  {humanizeDate(y.toString())}
                </Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
