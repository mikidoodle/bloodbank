import {
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
import QRCode from 'react-native-qrcode-svg'
import Octicons from '@expo/vector-icons/Octicons'
export default function QR() {
  let [uuid, setUUID] = useState<string | null>('notfound')
  let [refreshing, setRefreshing] = useState<boolean>(false)
  async function load(refresh = false) {
    if (refresh) setRefreshing(true)
    let token = await SecureStore.getItemAsync('token')
    setUUID(token)
    setRefreshing(false)
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
            marginTop: 20,
          }}
        >
          <QRCode
            value={'bloodbank-' + (uuid ?? 'notfound')}
            backgroundColor="transparent"
            color={isDarkMode ? 'white' : 'black'}
            size={325}
          />
        </View>
        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            margin: 20,
            color: isDarkMode ? 'white' : 'black',
          }}
        >
          This QR code is unique to you and is used to identify you when you
          donate.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
