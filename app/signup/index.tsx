import { ImageBackground } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import One from './one'
import Two from './two'
import TwoBeta from './twobeta'
import { useLocalSearchParams } from 'expo-router'
import Three from './three'
import Four from './four'
import Five from './five'
const Stack = createNativeStackNavigator()

export default function Signup() {
    const local = useLocalSearchParams()
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: '#fff',
                    },
                    animation: 'fade',
                }}
            >
                <Stack.Screen
                    name="one"
                    component={One}
                    initialParams={{ phoneNumber: local.phoneNumber }}
                />
                <Stack.Screen name="two" component={Two} />
                <Stack.Screen name="twobeta" component={TwoBeta} />
                <Stack.Screen name="three" component={Three} />
                <Stack.Screen name="four" component={Four} />
                <Stack.Screen name="five" component={Five} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
