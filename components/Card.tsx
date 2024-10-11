import Octicons from '@expo/vector-icons/Octicons'
import { View, Text, useColorScheme } from 'react-native'

export default function Card(props: {
  icon: any
  iconColor: string
  title: string
  subtitle: string
  border?: boolean
}) {
  let isDarkMode = useColorScheme() === 'dark'
  return (
    <View
      style={{
        width: '40%',
        height: 120,
        backgroundColor: props.border
          ? isDarkMode
            ? '#242526'
            : '#f3f3f3'
          : isDarkMode
          ? '#242526'
          : '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Octicons name={props.icon} size={28} color={props.iconColor} />
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          color: isDarkMode ? '#fff' : '#000',
        }}
      >
        {/^\d+$/.test(props.title)
          ? props.title.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : props.title}
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
