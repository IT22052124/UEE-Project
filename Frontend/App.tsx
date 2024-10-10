import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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
import { DetailedPostScreen } from "./Pages/CommunityConnect/Screen/DetailedPostScreen";
import SearchScreen from "./Pages/CommunityConnect/Screen/SearchScreen";
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
import Program from "./CommunityProgram/Screen/Program";
import EnrolledProgram from "./CommunityProgram/Screen/EnrolledProgram";
import Location from "./CommunityProgram/Screen/Location";
import JobProviderSignIn from "./Jobs/Screen/JobProviderSignIn";
import Toast from "react-native-toast-message";
import JobApplicationsScreen from "./Jobs/Screen/ApplicationsRecieved";
import UserScreen from "./Pages/CommunityConnect/Screen/UserScreen";
import UpdateJobScreen from "./Jobs/Screen/UpdateJob";
import AppliedJobsScreen from "./Jobs/Screen/AppliedJobs";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function JPBottomTabNavigator({ route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "PostedJobs") {
            iconName = focused ? "briefcase" : "briefcase-outline"; // Icon for posted jobs
          } else if (route.name === "Applications") {
            iconName = focused ? "document" : "document-outline"; // Icon for company profile
          } else if (route.name === "Profile") {
            iconName = focused ? "business" : "business-outline"; // Icon for company profile
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="PostedJobs"
        component={PostedJobsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Applications"
        component={JobApplicationsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={CompanyProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "JobListScreen") {
            // Icon for Job List Screen
            iconName = focused ? "briefcase" : "briefcase-outline";
          } else if (route.name === "AppliedJobsScreen") {
            // Icon for Applied Jobs Screen
            iconName = focused ? "document" : "document-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato", // Customize the active icon color
        tabBarInactiveTintColor: "gray", // Customize the inactive icon color
      })}
    >
      <Tab.Screen
        name="JobListScreen"
        component={JobListScreen}
        options={{ headerShown: false, tabBarLabel: "Jobs" }} // Set proper label
      />
      <Tab.Screen
        name="AppliedJobsScreen"
        component={AppliedJobsScreen}
        options={{ headerShown: false, tabBarLabel: "Applied Jobs" }} // Set proper label
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserScreen"
          component={UserScreen}
          options={{ headerShown: false }}
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
          name="DetailedPostScreen"
          component={DetailedPostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Program"
          component={Program}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EnrolledProgram"
          component={EnrolledProgram}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Location"
          component={Location}
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
          name="JobProviderSignIn"
          component={JobProviderSignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JPMainTabs"
          component={JPBottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobPostingScreen"
          component={JobPostingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateJobScreen"
          component={UpdateJobScreen}
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
      <Toast ref={(ref) => Toast.setRef(ref)} />
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
