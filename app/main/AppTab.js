import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../screens/profile";
import Receive from "../screens/recieve";
import Send from "../screens/send";
import Credcard from "../screens/credcard";
import Homeppage from "../screens/homeppage";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 6,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Homeppage}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo name="home" size={24} color={focused ? "blue" : "black"} />
          ),
        }}
      />
      <Tab.Screen
        name="Send"
        component={Send}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome
              name="send"
              size={24}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Receive"
        component={Receive}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo
              name="credit"
              size={24}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Card"
        component={Credcard}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome
              name="credit-card-alt"
              size={24}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "blue" : "black",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
                height: 60,
                width: 60,
                borderRadius: 30,
                marginBottom: 10,
              }}
            >
              <Ionicons name="person" size={24} color="white" />

              <Text style={{ color: "white", fontSize: 10 }}>Profile</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
