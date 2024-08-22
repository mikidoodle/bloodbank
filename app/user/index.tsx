import { Text, View } from 'react-native'
import Octicons from '@expo/vector-icons/Octicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
const Tab = createBottomTabNavigator()
const ModalStack = createStackNavigator()
import Home from './home'
export default function Index() {
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
                    }

                }}
            >
                <Tab.Screen
                    name="home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Octicons
                                name="telescope"
                                color={color}
                                size={size}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </>
    )
}
