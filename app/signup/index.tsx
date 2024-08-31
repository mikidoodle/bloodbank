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
                />{' '}
                {/* affiliation with the hospital */}
                <Stack.Screen name="two" component={Two} /> {/* biodata */}
                <Stack.Screen name="twobeta" component={TwoBeta} />{' '}
                {/* additional affiliation */}
                <Stack.Screen name="three" component={Three} />{' '}
                {/* medical conditions and medications */}
                <Stack.Screen name="four" component={Four} />{' '}
                {/* location access */}
                <Stack.Screen name="five" component={Five} /> {/* extras */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
