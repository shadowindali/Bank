import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import { FIREBASE_AUTH } from "../hooks/Firebase";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "../hooks/context";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  let { useremail } = useUser();

  function unixTimestampToDate(timestamp) {
    // Create a new Date object with the provided timestamp
    const date = new Date(timestamp);

    // Format the date as desired (for example, "YYYY-MM-DD HH:MM:SS")
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} \n${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;

    // Return the formatted date
    return formattedDate;
  }

  const fetchTransactions = async () => {
    try {
      const database = getFirestore();
      const userRef = collection(database, "transactions");

      const q1 = query(userRef, where("Recieveremail", "==", useremail));
      const q2 = query(userRef, where("Senderemail", "==", useremail));

      const querySnapshot1 = await getDocs(q1);
      const querySnapshot2 = await getDocs(q2);

      const documents = [];
      querySnapshot1.forEach((doc) => documents.push(doc.data()));
      querySnapshot2.forEach((doc) => documents.push(doc.data()));

      // Assuming 'documents' is an array of objects with a nested 'date' variable
      documents.sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);

        // Compare the dates
        return dateB - dateA;
      });

      setTransactions(documents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size={"large"} color={"black"} />}
      <FlatList
        style={styles.flatliststyle}
        data={transactions}
        renderItem={({ item, index }) => {
          const a = item.Date;
          const date = unixTimestampToDate(a);
          return (
            <TouchableOpacity style={[styles.usercont]} key={index}>
              {item.Recieveremail == useremail ? (
                <View style={styles.view}>
                  <Text style={{ fontSize: 15 }}>{item.SenderName}</Text>
                  <Text style={{ fontSize: 15 }}>{item.Amount} $</Text>
                  <MaterialIcons name="call-received" size={30} color="black" />
                  <Text style={{ textAlign: "center" }}>{date}</Text>
                </View>
              ) : (
                <View style={styles.view}>
                  <Text style={{ fontSize: 15 }}>{item.Recievername}</Text>
                  <Text style={{ fontSize: 15 }}>{item.Amount} $</Text>
                  <Text>
                    <FontAwesome name="send" size={30} color="black" />
                  </Text>
                  <Text style={{ textAlign: "center" }}>{date}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.Date}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  flatliststyle: {
    width: "100%",
    backgroundColor: "white",
  },
  usercont: {
    backgroundColor: "rgb(128, 170, 243)",
    flexDirection: "column",
    width: "95%",
    alignSelf: "center",
    padding: 5,
    alignItems: "center",
    borderRadius: 40,
    gap: 5,
    justifyContent: "center",
    marginTop: 5,
    borderWidth: 0.4,
    shadowColor: "black",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 1,
    elevation: 3,
  },
  view: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
  },
});
