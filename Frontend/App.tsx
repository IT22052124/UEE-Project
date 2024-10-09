import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CreatePostScreen from "./Pages/CommunityConnect/Screen/CreatePostScreen";
import CreateCommunityScreen from "./Pages/CommunityConnect/Screen/CreateCommunityScreen";
import CommunityScreen from "./Pages/CommunityConnect/Screen/CommunityScreen";
import ProfileScreen from "./Pages/CommunityConnect/Screen/ProfileScreen";
import DonationHomepage from "./Donation/Screen/DHomepage";
import CatergoryScreen from "./Donation/Screen/CamapignScreen";
import AboutScreen from "./Donation/Screen/AboutCampaignScreen";
import CampaignDonation from "./Donation/Screen/CampaignDonationScreen";
import DirectTransfer from "./Donation/Screen/OrganizationScreen";
import BankDeposits from "./Donation/Screen/BankTransferScreen";
import JobProviderRegistration from "./Jobs/Screen/RegisterJobProvider";
import SignUpScreen from "./OtherScreens/SignUpScreen";
import { S } from "@expo/html-elements";
import JobProviderRegistration2 from "./Jobs/Screen/RegisterJobProvider2";
import JobPostingScreen from "./Jobs/Screen/PostJob";
import HomeScreen from "./Pages/CommunityConnect/Screen/HomeScreen";
import PostedJobsScreen from "./Jobs/Screen/PostedJobs";
import CardPayment from "./Donation/Screen/Card";
import DoneS from "./Donation/Screen/Done";
import CompanyProfileScreen from "./Jobs/Screen/JobProviderProfile";
import JobListScreen from "./Jobs/Screen/JobListing";
import JobDetailsScreen from "./Jobs/Screen/JobDetails";
import ApplyJobScreen from "./Jobs/Screen/ApplyJob";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="JobListScreen">
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
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
          name="BankDeposits"
          component={BankDeposits}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DoneScreen"
          component={DoneS}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DirectTransfer"
          component={DirectTransfer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AboutScreen"
          component={AboutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CardPayment"
          component={CardPayment}
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
        <Stack.Screen
          name="JobProviderRegistration"
          component={JobProviderRegistration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobProviderRegistration2"
          component={JobProviderRegistration2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobPostingScreen"
          component={JobPostingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostedJobsScreen"
          component={PostedJobsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompanyProfileScreen"
          component={CompanyProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobListScreen"
          component={JobListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobDetailsScreen"
          component={JobDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ApplyJobScreen"
          component={ApplyJobScreen}
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
