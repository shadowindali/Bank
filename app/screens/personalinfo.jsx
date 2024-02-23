import {
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { useUser } from "../hooks/context";

export default function Personalinfo() {
  const [name, setName] = useState(null);
  const [age, setAge] = useState(null);
  const [phonenb, setPhonenb] = useState(null);
  const [address, setAddress] = useState(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  let { useremail } = useUser();

  const fetchData = async () => {
    try {
      const database = getFirestore();
      const userRef = collection(database, "users");
      const q = query(userRef, where("email", "==", useremail));
      const dataSnapshot = await getDocs(q);
      dataSnapshot.forEach((doc) => {
        const { name, age, phonenb, address, email } = doc.data();
        setUserData({ name, age, phonenb, address, email });
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    Alert.alert("Change Information", "Are you Sure", [
      {
        text: "Yes",
        onPress: async () => {
          try {
            const database = getFirestore();
            const userRef = collection(database, "users");
            const q = query(userRef, where("email", "==", useremail));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
              try {
                const dataToUpdate = {};
                if (name !== null) dataToUpdate.name = name;
                if (age !== null) dataToUpdate.age = age;
                if (phonenb !== null) dataToUpdate.phonenb = phonenb;
                if (address !== null) dataToUpdate.address = address;

                await updateDoc(doc.ref, dataToUpdate);
                setError(true);
              } catch (updateError) {
                console.error("Error updating document:", updateError);
              }
            });
          } catch (error) {
            console.error("Error fetching user data:", error);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <View style={styles.profilecont}>
              <View style={styles.downview}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="Email"
                  value={userData.email}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Name"
                  mode="outlined"
                  label="Name"
                  defaultValue={userData.name}
                  onChangeText={setName}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Age"
                  defaultValue={userData.age}
                  mode="outlined"
                  label="Age"
                  keyboardType="numeric"
                  onChangeText={setAge}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phoneNb"
                  defaultValue={userData.phonenb}
                  keyboardType="numeric"
                  mode="outlined"
                  label="PhoneNb"
                  onChangeText={setPhonenb}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your address"
                  defaultValue={userData.address}
                  mode="outlined"
                  label="Address"
                  onChangeText={setAddress}
                  autoCapitalize="none"
                />
                {error && (
                  <Text style={{ color: "green", fontWeight: "600" }}>
                    Done
                  </Text>
                )}
                <TouchableOpacity style={styles.editicon} onPress={updateData}>
                  <AntDesign name="edit" size={24} color="black" />
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
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
    width: "90%",
    height: 45,
    backgroundColor: "white",
  },
});
