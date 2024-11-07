import {
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import QRCode from 'react-native-qrcode-svg'
import { router } from 'expo-router'
import Button from '@/components/Button'
import { Octicons } from '@expo/vector-icons'
import * as Application from 'expo-application'
import App from '../notifications'
export default function Settings() {
  let [uuid, setUUID] = useState<string | null>('notfound')
  let [refreshing, setRefreshing] = useState<boolean>(false)
  async function load(refresh = false) {
    if (refresh) setRefreshing(true)
    let token = await SecureStore.getItemAsync('token')
    setUUID(token)
    setRefreshing(false)
  }

  useEffect(() => {
    load(false)
  }, [])
  let isDarkMode = useColorScheme() === 'dark'
  function reportBug() {
    router.push(
      'mailto:mihir@pidgon.com?subject=JIPMER%20Blood%20Center%20Bug%20Report'
    )
  }
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
      </View>
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          gap: 10,
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
        <Button
          onPress={() => {
            router.push('tel:+914132296666')
          }}
        >
          <Octicons name="device-mobile" size={20} /> Call JIPMER Blood Center
        </Button>
        <Button
          onPress={() => {
            router.push('mailto:mihir@pidgon.com')
          }}
        >
          <Octicons name="mail" size={20} /> Get Support
        </Button>
        <Button onPress={reportBug}>
          <Octicons name="bug" size={20} /> Report a Bug
        </Button>
        <Button
          onPress={() => {
            SecureStore.deleteItemAsync('token')
            router.replace('/')
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Octicons name="sign-out" size={20} /> Log out
        </Button>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              color: 'gray',
              marginTop: 20,
              fontSize: 16,
              
            }}
          >
            JIPMER Blood Bank {Application.nativeApplicationVersion}{' '}
            [{Application.nativeBuildVersion}]
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
