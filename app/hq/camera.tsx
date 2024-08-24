import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { useState } from 'react'
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Button from '@/components/Button'
import Octicons from '@expo/vector-icons/Octicons'
import { router } from 'expo-router'
export default function Camera() {
    const [facing, setFacing] = useState<CameraType>('back')
    const [permission, requestPermission] = useCameraPermissions()
    const [flash, setFlash] = useState(false)
    const [side, setSide] = useState<'front' | 'back'>('back')
    const [currentData, setCurrentData] = useState<any>('')
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
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
                <Text>We need your permission to show the camera.</Text>
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
                    if (
                        //scanShutoff ||
                        result.data.startsWith('bloodbank-') !== true
                    ) {
                        setCurrentData('')
                    } else {

                        setCurrentData(result.data)
                        setHeight(result.cornerPoints[0].y-200)
                        setWidth(result.cornerPoints[0].x)
                        /*
                        router.push({
                            pathname: '/logdonor',
                            params: {
                                uuid: result.data,
                            },
                        })
                        setScanShutoff(true)*/
                    }
                }}
                enableTorch={flash}
            ></CameraView>
            { currentData !== '' ? <Pressable
                style={{
                    borderRadius: 64,
                    backgroundColor: '#fff',
                    padding: 10,
                    position: 'absolute',
                    //use the height and width to position the button
                    transform: [{ translateY: height }, { translateX: width }],
                    elevation: 10,
                }}
                onPress={() => {
                    router.push({
                        pathname: '/logdonor',
                        params: {
                            uuid: currentData,
                        },
                    })
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        color: '#7469B6',
                    }}
                >
                    Scan!
                </Text>
            </Pressable> : null}
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
