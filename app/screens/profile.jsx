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

export default function Profile() {
  // FONTTTTS
  const [fontsLoaded] = useFonts({
    "Protest Riot": require("../../assets/fonts/Protest Riot.ttf"),
  });

  //DATAAAA
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [transactions, setTransactions] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  let { useremail } = useUser();
  const navigator = useNavigation();

  const fetchData = async () => {
    try {
      setRefreshing(true); // Set refreshing state to true when fetching data
      const database = getFirestore();
      const userRef = collection(database, "users");
      const q = query(userRef, where("email", "==", useremail));
      const dataSnapshot = await getDocs(q);
      dataSnapshot.forEach((doc) => {
        const { name, balance } = doc.data();
        setUserData({ name, balance });
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setRefreshing(false); // Set refreshing state to false after data fetching
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
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
        // Access the nested date variables
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);

        // Compare the dates
        return dateB - dateA;
      });

      setTransactions(documents);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchData();
    fetchTransactions();
  }, []);

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            fetchData();
            fetchTransactions();
          }}
          colors={["#0000ff"]}
        />
      }
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <SafeAreaView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <View style={styles.profilecont}>
                <View style={styles.upperview}>
                  <Text style={styles.username}>{userData.name}</Text>
                  <Text style={styles.balance}>
                    Balance:{" "}
                    <Text style={{ color: "blue", fontSize: 30 }}>
                      {userData.balance}$
                    </Text>
                  </Text>
                </View>

                <View
                  style={[
                    styles.downview,
                    { alignItems: "center", height: "38%" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      marginBottom: 10,
                      fontWeight: "800",
                    }}
                  >
                    Recent Transactions
                  </Text>
                  <FlatList
                    style={styles.flatliststyle}
                    horizontal
                    data={transactions}
                    renderItem={({ item, index }) => {
                      const a = item.Date;
                      const date = unixTimestampToDate(a);
                      return (
                        <TouchableOpacity style={[styles.usercont]} key={index}>
                          {item.Recieveremail == useremail ? (
                            <>
                              <Text style={{ fontSize: 15 }}>
                                {item.SenderName}
                              </Text>
                              <Text style={{ fontSize: 15 }}>
                                {item.Amount} $
                              </Text>
                              <MaterialIcons
                                name="call-received"
                                size={30}
                                color="black"
                              />
                              <Text style={{ textAlign: "center" }}>
                                {date}
                              </Text>
                            </>
                          ) : (
                            <>
                              <Text style={{ fontSize: 15 }}>
                                {item.Recievername}
                              </Text>
                              <Text style={{ fontSize: 15 }}>
                                {item.Amount} $
                              </Text>
                              <Text>
                                <FontAwesome
                                  name="send"
                                  size={30}
                                  color="black"
                                />
                              </Text>
                              <Text style={{ textAlign: "center" }}>
                                {date}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item) => item.Date}
                  />
                  <TouchableOpacity
                    style={{ marginTop: 10 }}
                    onPress={() => navigator.navigate("transactions")}
                  >
                    <Text>See All</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => navigator.navigate("perinfo")}>
                  <View style={[styles.downview, { alignItems: "center" }]}>
                    <Text style={{ fontSize: 20, fontWeight: "900" }}>
                      Personal Information
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigator.navigate("changepass")}
                >
                  <View style={[styles.downview, { alignItems: "center" }]}>
                    <Text
                      style={{ fontSize: 20, fontWeight: "900", color: "red" }}
                    >
                      Change Password
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLogout}>
                  <View style={[styles.downview, { alignItems: "center" }]}>
                    <Text
                      style={{ fontSize: 20, fontWeight: "900", color: "red" }}
                    >
                      Logout
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profilecont: {
    width: "95%",
    height: "98%",
    borderRadius: 20,
  },
  upperview: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 40,
    marginTop: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 103,
    elevation: 10,
  },
  username: {
    fontSize: 40,
    fontFamily: "Protest Riot",
  },
  balance: {
    fontSize: 22,
    fontFamily: "Protest Riot",
  },
  downview: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 40,
    justifyContent: "center",
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
  flatliststyle: {
    width: "100%",
    backgroundColor: "white",
  },
  usercont: {
    backgroundColor: "rgb(128, 170, 243)",
    width: 150,
    padding: 5,
    alignItems: "center",
    borderRadius: 40,
    gap: 5,
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 0.4,
    shadowColor: "black",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 1,
    elevation: 3,
  },
});
