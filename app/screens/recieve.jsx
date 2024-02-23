import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { useFonts } from "expo-font";
import { Searchbar, TextInput } from "react-native-paper";
import { useUser } from "../hooks/context";
import Modal from "react-native-modal";

export default function Recieve() {
  // Fonts
  const [fontsLoaded] = useFonts({
    "Protest Riot": require("../../assets/fonts/Protest Riot.ttf"),
  });

  // Data
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingB, setLoadingB] = useState(false);
  const [error, setError] = useState("");
  const [Amount, setAmount] = useState(0);
  const [requests, setRequests] = useState([]);

  const { useremail } = useUser();

  const handleUserPress = (item) => {
    setSelectedUser(item);
  };

  const filterUsers = (query) => {
    const normalizedQuery = query.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(normalizedQuery) ||
        user.name.toLowerCase().includes(normalizedQuery)
    );
  };

  const filteredUsers = filterUsers(searchQuery);

  // MODALLL
  const [isSendModalVisible, setSendModalVisible] = useState(false);
  const [isRequestModalVisible, setRequestModalVisible] = useState(false);

  const toggleModal = () => {
    setSendModalVisible(!isSendModalVisible);
    setError("");
  };

  const toggleRequestModal = () => {
    setRequestModalVisible(!isRequestModalVisible);
  };
  // MODALLL

  const fetchData = async () => {
    try {
      const database = getFirestore();
      const userRef = collection(database, "users");
      const dataSnapshot = await getDocs(query(userRef));
      const users = [];
      dataSnapshot.forEach((doc) => {
        const { name, email } = doc.data();
        users.push({ name, email });
      });
      setUsers(users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const database = getFirestore();
      const userRef = collection(database, "requests");
      const dataSnapshot = await getDocs(
        query(userRef, where("Requester", "==", useremail))
      );
      const requests = [];
      dataSnapshot.forEach((doc) => {
        requests.push(doc.data());
      });
      setRequests(requests);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const requestMoney = async () => {
    setLoadingB(true);
    try {
      const database = getFirestore();
      const datatosend = {
        Amount: Amount,
        Requester: useremail,
        Requseting: selectedUser.email,
        Status: "Pending",
      };
      const transRef = collection(database, "requests");
      const dataSnapshot = await addDoc(transRef, datatosend);
      setError("Done");
      setLoadingB(false);
      setAmount(0);
    } catch (err) {
      console.log(err);
      setLoadingB(false);
    } finally {
      setLoadingB(false);
      setAmount(0);
    }
  };

  useEffect(() => {
    fetchData();
    // fetchRequests();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      <View style={style.container}>
        {/* <StatusBar /> */}
        <Text style={style.title}>Request Money</Text>
      </View>

      <View style={style.userscont}>
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 5 }}>
          Choose Sender
        </Text>
        <Searchbar
          placeholder="Search"
          autoCapitalize="none"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{
            backgroundColor: "white",
            borderWidth: 2,
          }}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            style={style.flatliststyle}
            data={filteredUsers}
            renderItem={({ item, index }) => {
              if (item.email !== useremail) {
                return (
                  <TouchableOpacity
                    onPress={() => handleUserPress(item)}
                    style={[
                      style.usercont,
                      selectedUser &&
                        selectedUser.email === item.email && {
                          backgroundColor: "lightgray",
                        },
                    ]}
                    key={index}
                  >
                    <Text
                      style={{
                        fontWeight: "900",
                        fontSize: 17,
                        marginLeft: 10,
                      }}
                    >
                      {item.email}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "900",
                        fontSize: 14,
                        marginLeft: 25,
                        color: "grey",
                      }}
                    >
                      name: {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }
            }}
            keyExtractor={(item) => item.email}
          />
        )}
      </View>

      {selectedUser ? (
        <TouchableOpacity onPress={toggleModal} style={{ width: "90%" }}>
          <View style={[style.downview]}>
            <Text style={{ fontSize: 20, fontWeight: "900", color: "blue" }}>
              Next
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={toggleModal}
          style={{ width: "90%" }}
          disabled
        >
          <View style={[style.downview]}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: "blue",
                opacity: 0.5,
              }}
            >
              Select User
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{ width: "90%" }}
        onPress={() => {
          toggleRequestModal();
          fetchRequests();
        }}
      >
        <View style={[style.downview]}>
          <Text style={{ fontSize: 20, fontWeight: "900", color: "green" }}>
            View Requests
          </Text>
        </View>
      </TouchableOpacity>

      {/* SEND MODAL */}

      <Modal
        onBackdropPress={() => setSendModalVisible(false)}
        onBackButtonPress={() => setSendModalVisible(false)}
        isVisible={isSendModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        animationInTiming={900}
        animationOutTiming={500}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={500}
        style={style.modal}
      >
        <View style={style.modalContent}>
          {loadingB ? (
            <View style={style.center}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <>
              <View style={style.center}>
                <View style={style.barIcon} />
              </View>
              <View style={style.centerdata}>
                <TextInput
                  style={style.input}
                  placeholder="Enter Amount"
                  right={<TextInput.Affix text="$" />}
                  mode="outlined"
                  label="Amount"
                  keyboardType="numeric"
                  onChangeText={setAmount}
                  autoCapitalize="none"
                />
                {error && <Text style={{ color: "green" }}>{error}</Text>}
                <TouchableOpacity
                  style={{ width: "90%" }}
                  onPress={requestMoney}
                >
                  <View style={[style.downview]}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "900",
                        color: "blue",
                      }}
                    >
                      Send
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* REQUESTS MODAL */}

      <Modal
        onBackdropPress={() => setRequestModalVisible(false)}
        onBackButtonPress={() => setRequestModalVisible(false)}
        isVisible={isRequestModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleRequestModal}
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        animationInTiming={900}
        animationOutTiming={500}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={500}
        style={[style.modal, { height: 300 }]}
      >
        <View style={style.modalContent}>
          <View style={style.center}>
            <View style={style.barIcon} />
            <Text style={{ margin: 3, fontSize: 20, fontWeight: "800" }}>
              Requested
            </Text>
          </View>
          <FlatList
            style={[style.flatliststyle, { height: "60%" }]}
            data={requests}
            renderItem={({ item, index }) => {
              if (item.email !== useremail) {
                return (
                  <TouchableOpacity
                    style={[style.usercont, { flexDirection: "row", gap: 5 }]}
                    key={index}
                  >
                    <View>
                      <Text
                        style={{
                          fontWeight: "900",
                          fontSize: 17,
                          marginLeft: 5,
                        }}
                      >
                        {item.Requseting}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "900",
                          fontSize: 14,
                          marginLeft: 25,
                          color: "grey",
                        }}
                      >
                        Amount: {item.Amount}$
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          right: 5,
                          position: "absolute",
                          color: item.Status == "Received" ? "green" : "red",
                        }}
                      >
                        {item.Status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            }}
            keyExtractor={(item) => item.Requseting}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontFamily: "Protest Riot",
  },
  userscont: {
    backgroundColor: "white",
    width: "90%",
    flex: 0.95,
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 1,
    elevation: 10,
  },
  flatliststyle: {
    width: "100%",
    backgroundColor: "white",
  },
  usercont: {
    backgroundColor: "white",
    width: "100%",
    padding: 7,
    borderRadius: 40,
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
  downview: {
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    borderRadius: 40,
    justifyContent: "center",
    marginTop: 5,
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
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: "60%",
    paddingBottom: 20,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
  },
  centerdata: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: "white",
    width: "90%",
  },
});
