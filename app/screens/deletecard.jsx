import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "../hooks/context";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";

export default function Deletecard() {
  let { useremail } = useUser();

  const [cards, setCards] = useState([]);

  const fetchData = async () => {
    try {
      const database = getFirestore();
      const userRef = collection(database, "cards");
      const q = query(userRef, where("email", "==", useremail));
      const dataSnapshot = await getDocs(q);
      const fetchedCards = [];
      dataSnapshot.forEach((doc) => {
        fetchedCards.push({ id: doc.id, ...doc.data() });
      });
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert("Confirm", "Do you want to delete?", [
      {
        text: "Yes",
        onPress: async () => {
          try {
            const database = getFirestore();
            const cardRef = doc(database, "cards", id);
            await deleteDoc(cardRef);
            fetchData();
          } catch (error) {
            console.error("Error deleting card:", error);
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
    <View>
      {cards.map((card, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleDelete(card.id)}
          style={{ alignItems: "center", marginVertical: 6 }}
        >
          <View style={styles.downview}>
            {card.type == "visa" ? (
              <FontAwesome name="cc-visa" size={24} color="black" />
            ) : (
              <FontAwesome name="cc-mastercard" size={24} color="black" />
            )}
            <Text style={{ fontSize: 20 }}>{card.number}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  downview: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "90%",
    padding: 15,
    borderRadius: 40,
    justifyContent: "space-around",
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
