import { ImageBackground } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import One from "./one";
import Two from "./two";
import TwoBeta from "./twobeta";
const Stack = createNativeStackNavigator();

export default function Swipes() {
  return (
      <NavigationContainer independent={true}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#fff",
            },
            animation: "fade"
          }}
        >
          <Stack.Screen name="one" component={One}/>
          <Stack.Screen name="two" component={Two}/>
          <Stack.Screen name="twobeta" component={TwoBeta}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}
