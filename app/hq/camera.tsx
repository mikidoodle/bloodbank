import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { useEffect, useState } from 'react'
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native'
import Button from '@/components/Button'
import Octicons from '@expo/vector-icons/Octicons'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'
export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions()
    const [flash, setFlash] = useState(false)
    const [side, setSide] = useState<'front' | 'back'>('back')
    const [currentData, setCurrentData] = useState<any>('')
    const [token, setToken] = useState<string | null>('')

    useEffect(() => {
        async function getToken() {
        let t = await SecureStore.getItemAsync('token')
        setToken(t)
        }
        getToken()
    }, [])
    function toggleFlash() {
        setFlash(!flash)
    }
    function toggleFront() {
        setSide(side === 'front' ? 'back' : 'front')
    }
    if (!permission) {
        // Camera permissions are still loading.
        return <View />
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={{
                    color: "#7469B6",
                }}>We need your permission to show the camera.</Text>
                <Button onPress={requestPermission} disabled={false}>
                    Allow Camera Access
                </Button>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={side}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={(result) => {
                    if (result.data.startsWith('bloodbank-') !== true) {
                        setCurrentData('')
                    } else {
                        setCurrentData(result.data)
                    }
                }}
                enableTorch={flash}
            ></CameraView>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 30,
                    alignItems: 'center',
                    width: '100%',
                    position: 'absolute',
                    bottom: '12%',
                    borderRadius: 64,
                    padding: 10,
                    elevation: 10,
                }}
            >
                <Pressable
                    style={{
                        borderRadius: 64,
                        backgroundColor: '#fff',
                        padding: 10,
                        elevation: 10,
                    }}
                    onPress={toggleFront}
                >
                    <Octicons name="sync" size={28} color="#7469B6" />
                </Pressable>
                {currentData !== '' ? (
                    <Pressable
                        style={{
                            borderRadius: 64,
                            backgroundColor: '#fff',
                            padding: 10,
                        }}
                        onPress={() => {
                            router.push({
                                pathname: '/logdonor',
                                params: {
                                    uuid: currentData,
                                    token: token
                                },
                            })
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                color: '#7469B6',
                            }}
                        >
                            Scan!
                        </Text>
                    </Pressable>
                ) : null}
                <Pressable
                    style={{
                        borderRadius: 64,
                        backgroundColor: '#fff',
                        padding: 10,
                        elevation: 10,
                    }}
                    onPress={toggleFlash}
                >
                    <Octicons name="sun" size={28} color="#7469B6" />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
})
