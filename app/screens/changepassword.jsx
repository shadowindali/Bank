import {
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { updatePassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../hooks/Firebase";

export default function Changepassword() {
  const [newpassword, setNewpassword] = useState();
  const [confpassword, setConfpassword] = useState();

  const [error, setError] = useState(true);

  const updatePass = async () => {
    if (!newpassword || !confpassword) {
      setError("Missing Fields");
      return;
    }
    if (newpassword != confpassword) {
      setError("Unmatched Passwords");
      return;
    }
    setError(" ");

    Alert.alert("Change Information", "Are you Sure", [
      {
        text: "Yes",
        onPress: async () => {
          const auth = FIREBASE_AUTH;
          const user = auth.currentUser;
          try {
            await updatePassword(user, newpassword);
            setError(false);
          } catch (error) {
            console.log(error);
          }
        },
      },
      {
        text: "No",
        onPress: () => {
          return;
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View style={styles.profilecont}>
          <View style={styles.downview}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              onChangeText={setNewpassword}
              autoCapitalize="none"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              onChangeText={setConfpassword}
              autoCapitalize="none"
              secureTextEntry
            />
            {error ? (
              <Text style={{ color: "red", fontWeight: "600" }}>{error}</Text>
            ) : (
              <Text style={{ color: "green", fontWeight: "600" }}>Done</Text>
            )}
            <TouchableOpacity style={styles.editicon} onPress={updatePass}>
              <AntDesign name="edit" size={24} color="black" />
              <Text>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </>
        )} */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  profilecont: {
    width: "95%",
    height: "98%",
    borderRadius: 20,
  },
  downview: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginTop: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 1,
    elevation: 10,
  },
  editicon: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 0.5,
    padding: 6,
    borderRadius: 10,
    width: "90%",
  },
});
