import React, { useEffect, useState } from "react";
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
import { getFirestore, collection, query, addDoc } from "firebase/firestore";
import { useUser } from "../hooks/context";
import Blogo from "../../assets/logo.png";
import Bank from "../../assets/bank.jpg";
import { useNavigation } from "@react-navigation/native";

export default function Addinfo() {
  let { useremail } = useUser();
  const [Info, setInfo] = useState({ email: useremail, balance: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigator = useNavigation();

  const addInfo = async () => {
    if (!Info.name || !Info.age || !Info.phonenb || !Info.address) {
      setError("Missing Fields");
      return;
    }
    setLoading(true);
    try {
      // console.log(Info);
      const database = getFirestore();
      const userRef = collection(database, "users");
      const dataSnapshot = await addDoc(userRef, Info);
      navigator.navigate("pages");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setError("");
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
                placeholder="Enter your Name"
                onChangeText={(e) => {
                  setInfo({ ...Info, name: e });
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your Age"
                keyboardType="numeric"
                onChangeText={(e) => {
                  setInfo({ ...Info, age: e });
                }}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your phoneNb"
                keyboardType="numeric"
                onChangeText={(e) => {
                  setInfo({ ...Info, phonenb: e });
                }}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your Address"
                onChangeText={(e) => {
                  setInfo({ ...Info, address: e });
                }}
                autoCapitalize="none"
              />
              {error ? (
                <Text style={{ color: "red", fontWeight: "900" }}>{error}</Text>
              ) : (
                ""
              )}
            </View>
            <TouchableOpacity style={styles.btn} onPress={addInfo}>
              <Text style={{ color: "white", fontSize: 18 }}>Submit</Text>
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
