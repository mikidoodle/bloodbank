import { Pressable, Text } from 'react-native'

export default function Button(props: {
    onPress: () => void
    children: any
    disabled?: boolean
}) {
    return (
        <Pressable
            onPress={props.onPress}
            style={{
                backgroundColor: '#AD88C6',
                padding: 10,
                margin: 10,
                borderRadius: 9,
                width: 300,
                shadowColor: '#E1AFD1',
                shadowRadius: 20,
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity: 0.5,
            }}
            disabled={props.disabled}
        >
            <Text style={{ textAlign: 'center', fontSize: 20 }}>
                {props.children}
            </Text>
        </Pressable>
    )
}
