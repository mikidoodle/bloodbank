import { router, Stack } from 'expo-router'
import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'
export default function RootLayout() {
    function useNotificationObserver() {
        useEffect(() => {
            let isMounted = true

            function redirect(notification: Notifications.Notification) {
                const url = notification.request.content.data?.url
                if (url) {
                    router.push(url)
                }
            }

            Notifications.getLastNotificationResponseAsync().then(
                (response) => {
                    if (!isMounted || !response?.notification) {
                        return
                    }
                    redirect(response?.notification)
                }
            )

            const subscription =
                Notifications.addNotificationResponseReceivedListener(
                    (response) => {
                        redirect(response.notification)
                    }
                )

            return () => {
                isMounted = false
                subscription.remove()
            }
        }, [])
    }
    useNotificationObserver()
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: 'white',
                },
                animation: 'fade',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="signup/index" />
            <Stack.Screen name="user/index" />
            <Stack.Screen name="hqonboarding/index" />
            <Stack.Screen name="hq/index" />
            <Stack.Screen
                name="logdonor"
                options={{
                    // Set the presentation mode to modal for our modal route.
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
            name="requestblood"
            options={{
                // Set the presentation mode to modal for our modal route.
                presentation: 'modal',
            }}
        />
        </Stack>
    )
}
