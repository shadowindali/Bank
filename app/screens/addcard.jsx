import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { CreditCardInput } from "react-native-credit-card-input";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useUser } from "../hooks/context";

export default function Addcard() {
  const [data, setData] = useState({});
  const [status, setStatus] = useState({});
  const [error, setError] = useState("");

  let { useremail } = useUser();

  const addCard = async () => {
    if (!data.cvc || !data.expiry || !data.name || !data.number) {
      setError("Missing Fields");
      return;
    }
    if (
      status.cvc != "valid" ||
      status.number != "valid" ||
      status.expiry != "valid" ||
      status.name != "valid"
    ) {
      setError("Wrong Fields");
      return;
    }
    try {
      const datato = { ...data, email: useremail };
      // console.log(datato);
      const database = getFirestore();
      const userRef = collection(database, "cards");
      const dataSnapshot = await addDoc(userRef, datato);
      setError("Done");
    } catch (err) {
      console.log(err);
    }
  };

  _onChange = (formData) => {
    // console.log(formData);
    setData(formData.values);
    // console.log(data);
    setStatus(formData.status);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={s.container}>
        <CreditCardInput
          autoFocus
          requiresName
          requiresCVC
          labelStyle={s.label}
          inputStyle={s.input}
          validColor={"black"}
          invalidColor={"red"}
          placeholderColor={"darkgray"}
          onFocus={this._onFocus}
          onChange={this._onChange}
          cardImageBack={require("../../assets/back.jpg")}
          cardImageFront={require("../../assets/back.jpg")}
        />
      </View>
      {error == "Done" ? (
        <Text style={{ textAlign: "center", color: "green" }}>Done</Text>
      ) : (
        <Text style={{ textAlign: "center", color: "red" }}>{error}</Text>
      )}
      <TouchableOpacity style={{ alignItems: "center" }} onPress={addCard}>
        <View style={s.downview}>
          <Text style={{ fontSize: 40 }}>Add</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 30,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 280,
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
    alignItems: "center",
    width: "90%",
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
