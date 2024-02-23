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
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../hooks/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Blogo from "../../assets/logo.png";
import Bank from "../../assets/bank.jpg";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigator = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Missing Fields");
      return;
    }
    setError("");

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      // console.log(response);
    } catch (error) {
      // console.log(error);
      setError("Invailed email or password");
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
                placeholder="Enter your Email"
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your Password"
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              {error ? (
                <Text style={{ color: "red", fontWeight: "900" }}>{error}</Text>
              ) : (
                ""
              )}
            </View>
            <TouchableOpacity style={styles.btn} onPress={handleLogin}>
              <Text style={{ color: "white", fontSize: 18 }}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigator.navigate("signup")}>
              <Text>
                Do you want to{" "}
                <Text style={{ color: "blue", fontWeight: "900" }}>
                  Signup!
                </Text>
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
