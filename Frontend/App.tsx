import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./CommunityConnect/Screen/HomeScreen";
import CreatePostScreen from "./CommunityConnect/Screen/CreatePostScreen";

import CreateCommunityScreen from "./CommunityConnect/Screen/CreateCommunityScreen";
import CommunityScreen from "./CommunityConnect/Screen/CommunityScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CreatePostScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateCommunityScreen"
          component={CreateCommunityScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreatePostScreen"
          component={CreatePostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CommunityScreen"
          component={CommunityScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
