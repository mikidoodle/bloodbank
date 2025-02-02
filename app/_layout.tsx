import { router, Stack } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import { useColorScheme } from 'react-native'
export default function RootLayout() {
  let isDarkMode = useColorScheme() === 'dark'
  function useNotificationObserver() {
    useEffect(() => {
      let isMounted = true
      function redirect(notification: Notifications.Notification) {
        const url = notification.request.content.data?.url
        if (url) {
          router.push(url)
        }
      }

      Notifications.getLastNotificationResponseAsync().then((response) => {
        if (!isMounted || !response?.notification) {
          return
        }
        redirect(response?.notification)
      })

      const subscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          redirect(response.notification)
        })

      return () => {
        isMounted = false
        subscription.remove()
      }
    }, [])
  }

  useNotificationObserver()

  SplashScreen.preventAutoHideAsync()

  const [appIsReady, setAppIsReady] = useState(false)
  useEffect(() => {
    async function prepare() {
      
      try {
        SecureStore.getItemAsync('token').then((token) => {
          if (token) {
            if (token.startsWith('hq-')) {
              router.push('/hq')
            } else {
              console.log(token)
              router.push('/user')
            }
          }
        })
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  useEffect(() => {
    onLayoutRootView();
  }, [appIsReady]);

  if (!appIsReady) {
    return null
  }

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
        name="accountmigration"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />
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
      <Stack.Screen
        name="verifydonor"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="signupcomplete"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
