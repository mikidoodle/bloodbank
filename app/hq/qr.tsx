import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native'
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
                    marginTop: 20
                }}
            >
                <Text style={{ fontSize: 24, textAlign: 'center' }}>
                    JIPMER <Text style={{ color: '#7469B6' }}>Blood Bank</Text>
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
                <View style={{
                    marginTop: 20
                }}>
                <QRCode
                    value={'bloodbank-' + (uuid ?? 'notfound')}
                    backgroundColor="transparent"
                    logoSize={50}
                    size={325}
                    
                />
                </View>
                <Text style={{
                    fontSize: 14,
                    textAlign: 'center',
                    margin: 20,
                }}>
                    This QR code is unique to you and is used to identify you
                    when you donate.
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}
