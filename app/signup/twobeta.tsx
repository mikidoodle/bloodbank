import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../../assets/styles/styles'
import { Picker } from '@react-native-picker/picker'
import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import TwoRowInput from '@/components/TwoRowInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Progress from 'react-native-progress'
import { Octicons } from '@expo/vector-icons'
import FreeButton from '@/components/FreeButton'
export default function TwoBeta({
  route,
  navigation,
}: {
  route: any
  navigation: any
}) {
  let [designation, setDesignation] = useState<string>(
    route.params?.designation || 'Faculty'
  )
  let [yearOfJoining, setYearOfJoining] = useState<any>(
    route.params?.yearOfJoining || ''
  )
  let [department, setDepartment] = useState<string>(
    route.params?.department || ''
  )
  delete route.params?.designation
  delete route.params?.yearOfJoining
  delete route.params?.department

  let responsiveDark = useColorScheme() === 'dark' ? 'white' : 'black'
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 40,
            marginTop: 20,
            gap: 20,
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <Pressable onPress={() => router.push('/')}>
              <Octicons name="arrow-left" size={24} color={responsiveDark} />
            </Pressable>
            <Text
              style={{
                fontSize: 24,
                textAlign: 'center',
                color: responsiveDark,
              }}
            >
              JIPMER <Text style={{ color: '#7469B6' }}>Blood Center</Text>
            </Text>
          </View>
          <Progress.Bar
            progress={0.2}
            width={300}
            height={10}
            color="#7469B6"
            borderRadius={10}
          />
        </View>
        <Text
          style={{
            fontSize: 28,
            textAlign: 'center',
            margin: 'auto',
            color: responsiveDark,
          }}
        >
          Sign up | <Text style={{ color: '#7469B6' }}>Employee Details</Text>
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 20,
            color: responsiveDark,
          }}
        >
          Enter your designation at JIPMER
        </Text>
        <Picker
          selectedValue={designation}
          onValueChange={(itemValue, itemIndex) => setDesignation(itemValue)}
        >
          <Picker.Item label="Faculty" value="Faculty" color={responsiveDark} />
          <Picker.Item
            label="Resident"
            value="Resident"
            color={responsiveDark}
          />
          <Picker.Item label="MBBS" value="MBBS" color={responsiveDark} />
          <Picker.Item
            label="B.Sc. Nursing"
            value="B Sc. Nursing"
            color={responsiveDark}
          />
          <Picker.Item
            label="B.Sc. Allied Medical Sciences"
            value="B.Sc. Allied Medical Sciences"
            color={responsiveDark}
          />
          <Picker.Item
            label="Nursing staff"
            value="Nursing staff"
            color={responsiveDark}
          />
          <Picker.Item label="Other" value="Other" color={responsiveDark} />
        </Picker>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 20,
            color: responsiveDark,
          }}
        >
          Enter year of joining
        </Text>
        <TextInput
          placeholder="Enter year of joining"
          value={yearOfJoining}
          placeholderTextColor={'grey'}
          onChangeText={setYearOfJoining}
          keyboardType="numeric"
          style={styles.input}
        />
        <Text
          style={{
            fontSize: 18,
            marginBottom: 20,
            color: responsiveDark,
          }}
        >
          Enter your department.{'\n'}(If you are an intern, enter 'Intern')
        </Text>
        <TextInput
          placeholder="Enter department"
          value={department}
          placeholderTextColor={'grey'}
          onChangeText={setDepartment}
          keyboardType="default"
          style={styles.input}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <FreeButton
            onPress={() => {
              navigation.navigate('one', {
                ...route.params,
                designation,
                yearOfJoining,
                department,
              })
            }}
            style={{
              width: '25%',
            }}
          >
            Back
          </FreeButton>
          <FreeButton
            onPress={() => {
              navigation.navigate('two', {
                ...route.params,
                designation,
                yearOfJoining,
                department,
              })
            }}
            disabled={department === ''}
            style={{
              width: '40%',
            }}
          >
            Next
          </FreeButton>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  )
}
