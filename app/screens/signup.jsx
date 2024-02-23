import {
  View,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Blogo from "../../assets/logo.png";
import Bank from "../../assets/bank.jpg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../hooks/Firebase";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigator = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleSignup = async () => {
    if (!password || !email || !confirmpassword) {
      setError("Missing Fields");
      return;
    }
    if (password != confirmpassword) {
      setError("Confirm Password is different");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigator.navigate("addInfo");
    } catch (error) {
      // console.log(error.code);
      if (error.code == "auth/weak-password") {
        setError("Password should be at least 6 charecters");
      }
      if (error.code == "auth/email-already-in-use") {
        setError("Email is already in use");
      }
      if (error.code == "auth/invalid-email") {
        setError("Invalid Email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView style={styles.maincont}>
        {loading && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 99,
              backgroundColor: "rgba(67, 67, 67, 0.697)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
        <ImageBackground
          source={Bank}
          style={[styles.maincont, { width: "100%" }]}
        >
          <StatusBar />
          <View style={styles.logincont}>
            <Image source={Blogo} style={styles.image} />
            <View style={styles.inputscon}>
              <TextInput
                style={styles.input}
                placeholder="Enter new Email"
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter new Password"
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm new Password"
                onChangeText={setConfirmpassword}
                secureTextEntry
                autoCapitalize="none"
              />
              {error ? (
                <Text style={{ color: "red", fontWeight: "900" }}>{error}</Text>
              ) : (
                ""
              )}
            </View>
            <TouchableOpacity style={styles.btn} onPress={handleSignup}>
              <Text style={{ color: "white", fontSize: 18 }}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigator.navigate("login")}>
              <Text style={{ color: "blue", fontWeight: "700" }}>
                Do you have account!
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  maincont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  logincont: {
    width: "90%",
    height: "auto",
    gap: 20,
    padding: 10,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 40,
    shadowColor: "black",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 103,
    elevation: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
  },
  inputscon: {
    width: "90%",
    justifyContent: "center",
    gap: 15,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  inputtitle: {
    marginLeft: 10,
  },
  input: {
    borderWidth: 0.5,
    padding: 6,
    borderRadius: 10,
    width: "90%",
  },
  btn: {
    borderRadius: 30,
    backgroundColor: "black",
    padding: 12,
  },
});
