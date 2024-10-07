import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./CommunityConnect/Screen/HomeScreen";
import CreatePostScreen from "./CommunityConnect/Screen/CreatePostScreen";

import CreateCommunityScreen from "./CommunityConnect/Screen/CreateCommunityScreen";
import CommunityScreen from "./CommunityConnect/Screen/CommunityScreen";
import ProfileScreen from "./CommunityConnect/Screen/ProfileScreen";
import DonationHomepage from "./Donation/Screen/DHomepage"
import CatergoryScreen from "./Donation/Screen/CamapignScreen"
import AboutScreen from "./Donation/Screen/AboutCampaignScreen"
import CampaignDonation from "./Donation/Screen/CampaignDonationScreen"
import BankDespoits from "./Donation/Screen/BankTransferScreen"
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DonationHomepage">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="CreateCommunityScreen"
          component={CreateCommunityScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="DonationHomepage"
          component={DonationHomepage}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="CatergoryScreen"
          component={CatergoryScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="BankDespoits"
          component={BankDespoits}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AboutScreen"
          component={AboutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CampaignDonation"
          component={CampaignDonation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
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

