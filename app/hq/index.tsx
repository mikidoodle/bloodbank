import { Text, View } from 'react-native'
import Octicons from '@expo/vector-icons/Octicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
const Tab = createBottomTabNavigator()
const ModalStack = createStackNavigator()
import HQHome from './home'
import Camera from './camera'
export default function HQIndex() {
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
                    name="home"
                    component={HQHome}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Octicons name="home" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="camera"
                    component={Camera}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Octicons name="paste" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </>
    )
}
