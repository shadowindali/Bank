import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../hooks/Firebase";
import Login from "../screens/login";
import Signup from "../screens/signup";
import App from "./AppTab";
import { useUser } from "../hooks/context";
import Addinfo from "../screens/addinfo";
import Personalinfo from "../screens/personalinfo";
import Changepassword from "../screens/changepassword";
import Addcard from "../screens/addcard";
import Deletecard from "../screens/deletecard";
import Transactions from "../screens/transactions";
import { StatusBar } from "react-native";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  const [user, setUser] = useState();
  let { useremail, setUseremail, emailuser } = useUser();

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUseremail(user?.email);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={"black"} />
      <Stack.Navigator initialRouteName="login">
        {user ? (
          <>
            <Stack.Screen
              name="pages"
              component={App}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="perinfo"
              component={Personalinfo}
              options={{ title: "Personal Information" }}
            />
            <Stack.Screen
              name="transactions"
              component={Transactions}
              options={{ title: "Trasactions" }}
            />
            <Stack.Screen
              name="changepass"
              component={Changepassword}
              options={{ title: "Change Pasword" }}
            />
            <Stack.Screen
              name="addcard"
              component={Addcard}
              options={{ title: "Add Card" }}
            />
            <Stack.Screen
              name="deletecard"
              component={Deletecard}
              options={{ title: "Delete Card" }}
            />
            <Stack.Screen
              name="addInfo"
              component={Addinfo}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="signup"
              component={Signup}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
