import Octicons from '@expo/vector-icons/Octicons'
import { View, Text } from 'react-native'

export default function Card(props: {
    icon: any
    iconColor: string
    title: string
    subtitle: string
}) {
    return (
        <View
            style={{
                width: "40%",
                height: 100,
                backgroundColor: '#f3f3f3',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Octicons name={props.icon} size={24} color={props.iconColor} />
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                }}
            >
                {props.title}
            </Text>
            <Text
                style={{
                    fontSize: 18,
                    color: 'gray',
                }}
            >
                {props.subtitle}
            </Text>
        </View>
    )
}
