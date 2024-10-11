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
import { Link, router } from 'expo-router'
import Card from '@/components/Card'
import Octicons from '@expo/vector-icons/Octicons'

export default function HQHome() {
  let [refreshing, setRefreshing] = useState<boolean>(false)
  let [totalDonators, setTotalDonators] = useState<number>(0)
  let [verifiedDonors, setVerifiedDonors] = useState<number>(0)
  let [unverifiedDonors, setUnverifiedDonors] = useState<number>(0)
  let [totalDonations, setTotalDonations] = useState<number | null>(null)
  let [token, setToken] = useState<string | null>('')
  useEffect(() => {
    async function getToken() {
      let t = await SecureStore.getItemAsync('token')
      console.log(t)
      setToken(t)
    }
    getToken()
  }, [])
  async function load(refresh = false) {
    if (refresh) setRefreshing(true)

    let token = await SecureStore.getItemAsync('token')
    fetch(`https://bloodbank.pidgon.com/hq/getStats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loginCode: token,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (refresh) setRefreshing(false)
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
          setTotalDonations(response.data.totalDonated)

          let totalDonors = response.data.totalDonors
          let verified = 0,
            unverified = 0,
            total = totalDonors.length

          totalDonors.forEach((donor: any) => {
            if (donor.verified) verified++
            else unverified++
          })
          setTotalDonators(total)
          setVerifiedDonors(verified)
          setUnverifiedDonors(unverified)
        }
      })
      .catch((error) => {
        if (refresh) setRefreshing(false)
        Alert.alert('Error', 'Failed to fetch data')
      })
  }
  useEffect(() => {
    console.log('loading')
    load(false)
  }, [])
  let responsiveColor = useColorScheme() === 'dark' ? 'white' : 'black'
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
          style={{ fontSize: 24, textAlign: 'center', color: responsiveColor }}
        >
          JIPMER <Text style={{ color: '#7469B6' }}>Blood Center HQ</Text>
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
              color: '#7469B6',
              fontWeight: 'bold',
            }}
          >
            Stats
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
              icon="code-of-conduct"
              iconColor="#AD88C6"
              title={totalDonators?.toString() || ''}
              subtitle="total donors"
            />
            <Card
              icon="heart-fill"
              iconColor="#AD88C6"
              title={totalDonations?.toString() || ''}
              subtitle="total donated"
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
              icon="unverified"
              iconColor="#AD88C6"
              title={unverifiedDonors?.toString() || ''}
              subtitle="unverified"
            />
            <Card
              icon="verified"
              iconColor="#AD88C6"
              title={verifiedDonors?.toString() || ''}
              subtitle="verified"
            />
          </View>
          <Button
            onPress={() =>
              router.push({
                pathname: '/requestblood',
                params: {
                  token: token,
                },
              })
            }
          >
            Request Blood
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
