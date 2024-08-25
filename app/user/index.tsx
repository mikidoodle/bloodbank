import { Alert, Platform, Text, View } from 'react-native'
import Octicons from '@expo/vector-icons/Octicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
const Tab = createBottomTabNavigator()
const ModalStack = createStackNavigator()
import Home from './home'
import QR from './qr'
import Settings from './settings'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useRef, useState } from 'react'
import Constants from 'expo-constants'
import { router } from 'expo-router'
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
})
export default function Index() {
    const [expoPushToken, setExpoPushToken] = useState('')
    const [channels, setChannels] = useState<
        Notifications.NotificationChannel[]
    >([])
    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >(undefined)
    const notificationListener = useRef<Notifications.Subscription>()
    const responseListener = useRef<Notifications.Subscription>()
    useEffect(() => {
        async function checkNotifs() {
            let uuid = await SecureStore.getItemAsync('token')
            if (!uuid) {
                Alert.alert('Error', 'Please login to continue', [
                    {
                        text: 'Login',
                        onPress: () => {
                            router.navigate('/')
                        },
                    },
                ])
            } else {
                const perms = await Notifications.getPermissionsAsync()
                let existingStatus = perms.status
                if (existingStatus !== 'granted') {
                    registerForPushNotificationsAsync().then(async (token) => {
                        if (token) {
                            setExpoPushToken(token)
                            console.log(token)
                            fetch(
                                'http://192.168.0.141:3000/updateNotifications',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        token: uuid,
                                        notificationToken: token,
                                    }),
                                }
                            )
                                .then((response) => response.json())
                                .then((response) => {
                                    if (response.error) {
                                        Alert.alert('Error', response.error)
                                    }
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        } else {
                            Alert.alert(
                                'Error',
                                'Failed to get notification token'
                            )
                        }
                    })
                    if (Platform.OS === 'android') {
                        Notifications.getNotificationChannelsAsync().then(
                            (value) => setChannels(value ?? [])
                        )
                    }
                    notificationListener.current =
                        Notifications.addNotificationReceivedListener(
                            (notification) => {
                                setNotification(notification)
                            }
                        )

                    responseListener.current =
                        Notifications.addNotificationResponseReceivedListener(
                            (response) => {
                                console.log(response)
                            }
                        )

                    return () => {
                        notificationListener.current &&
                            Notifications.removeNotificationSubscription(
                                notificationListener.current
                            )
                        responseListener.current &&
                            Notifications.removeNotificationSubscription(
                                responseListener.current
                            )
                    }
                }
            }
        }
        checkNotifs()
    }, [])
    return (
        <>
            <Tab.Navigator
                sceneContainerStyle={{
                    backgroundColor: '#efeef7',
                }}
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        /*position: "absolute",
            bottom: 25,
            left: 33.5,
            width: 325,*/
                        position: 'absolute',
                        bottom: '0%',
                        left: '0%',
                        width: '100%',
                        alignSelf: 'center',
                        height: 80,
                        paddingTop: 15,
                        shadowColor: '#7469B6',
                        shadowOpacity: 0.3,
                        shadowRadius: 20,
                        borderRadius: 64,
                        elevation: 10,
                        backgroundColor: '#fff',
                        backfaceVisibility: 'hidden',
                    },
                    tabBarActiveTintColor: '#7469B6',
                    tabBarIconStyle: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    },
                }}
                initialRouteName="home"
            >
                <Tab.Screen
                    name="qr"
                    component={QR}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Octicons name="heart" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Octicons name="home" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="settings"
                    component={Settings}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Octicons name="gear" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </>
    )
}

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here', test: { test1: 'more data' } },
        },
        trigger: { seconds: 2 },
    })
}

async function registerForPushNotificationsAsync() {
    let token

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowCriticalAlerts: true,
                },
                android: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowVibration: true,
                },
            })
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!')
            return
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // EAS projectId is used here.
        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId
            if (!projectId) {
                throw new Error('Project ID not found')
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data
            console.log(token)
        } catch (e) {
            token = `${e}`
        }
    } else {
        alert('Must use physical device for Push Notifications')
    }

    return token
}
