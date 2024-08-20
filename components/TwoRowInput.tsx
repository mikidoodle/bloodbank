import styles from '@/assets/styles/styles'
import { Text, TextInput, View } from 'react-native'
export default function TwoRowInput(props: {
    placeholder: string
    value: string
    setValue: (value: string) => void
    keyboardType: any
    children: any
}) {

    return (
        <View
            style={{
                flexDirection: 'row',
                width: 300,
                justifyContent: 'space-between',
            }}
        >
            <TextInput
                placeholder={props.placeholder}
                keyboardType={props.keyboardType}
                value={props.value}
                onChangeText={props.setValue}
                style={{ ...styles.input, width: '75%' }}
            />
            <View
                style={{
                    borderRadius: 9,
                    padding: 5,
                    backgroundColor: '#F3F3F3',
                    width: '20%',
                    height: 50,
                    margin: 10,
                    marginLeft: 0,
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 18,
                    }}
                >
                    {props.children}
                </Text>
            </View>
        </View>
    )
}
