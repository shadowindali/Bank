import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from "react-native";
import { CardView } from "react-native-credit-card-input";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "../hooks/context";
import { useNavigation } from "@react-navigation/native";
import Deletecard from "./deletecard";

export default function Credcard() {
  // FONTTTT
  const [fontsLoaded] = useFonts({
    "Protest Riot": require("../../assets/fonts/Protest Riot.ttf"),
  });
  // DATAAAA
  const [cards, setCards] = useState([]);
  const [focus, setFocus] = useState("number");
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const navigator = useNavigation();

  let { useremail } = useUser();

  const changeface = () => {
    if (focus === "number") setFocus("cvc");
    else setFocus("number");
  };

  const fetchData = async () => {
    try {
      const database = getFirestore();
      const userRef = collection(database, "cards");
      const q = query(userRef, where("email", "==", useremail));
      const dataSnapshot = await getDocs(q);
      const cards = [];
      dataSnapshot.forEach((doc) => {
        cards.push(doc.data());
      });
      setCards(cards);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchData}
          colors={["#0000ff"]}
        />
      }
    >
      <View>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <View style={{ alignItems: "center" }}>
              <Text style={s.title}>My Cards</Text>
            </View>
            <ScrollView
              horizontal={true}
              contentContainerStyle={s.scrollViewContainer}
            >
              <View style={s.container}>
                {cards.map((data, index) => {
                  return (
                    <View style={{ alignItems: "center" }} key={index}>
                      <CardView
                        brand={data.type}
                        focused={focus}
                        number={data.number}
                        expiry={data.expiry}
                        name={data.name}
                        cvc={data.cvc}
                        imageBack={require("../../assets/back.jpg")}
                        imageFront={require("../../assets/back.jpg")}
                      />
                      <TouchableOpacity onPress={changeface}>
                        <Text style={{ marginTop: 5, fontWeight: "800" }}>
                          Switch
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            <View>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => navigator.navigate("addcard")}
              >
                <View style={[s.downview, { alignItems: "center" }]}>
                  <Text style={{ fontSize: 20, fontWeight: "900" }}>
                    Add Card
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => navigator.navigate("deletecard")}
              >
                <View style={[s.downview, { alignItems: "center" }]}>
                  <Text style={{ fontSize: 20, fontWeight: "900" }}>
                    Delete Card
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  title: {
    fontSize: 35,
    fontFamily: "Protest Riot",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
  downview: {
    backgroundColor: "white",
    width: "90%",
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
});
