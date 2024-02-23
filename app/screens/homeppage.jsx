import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { RadioButton } from "react-native-paper";

export default function Homeppage() {
  const [data, setData] = useState({});
  const [currency, setCurrency] = useState("USD");
  const [Amount, setAmount] = useState(0);
  const [Transfered, setTransfered] = useState("Result");

  const getDollar = async () => {
    const resp = await axios.get(`https://rate.onrender.com/api/v1/dollarRate`);
    setData(resp.data);
  };

  const calculate = () => {
    const rate = data.buy_rate;
    let rating = rate.replace(/,/g, "");
    let amount = 0;
    if (currency === "USD") {
      amount = parseFloat(Amount) * parseFloat(rating);
      amount = amount.toFixed(2); // Ensure amount has two decimal places
      amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas for thousands separator
      amount += " LBP";
    } else {
      amount = parseFloat(Amount) / parseFloat(rating);
      amount = amount.toFixed(2); // Ensure amount has two decimal places
      amount += " USD";
    }
    setTransfered(amount);
  };

  useEffect(() => {
    getDollar();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={style.cont}>
          <Text style={{ fontSize: 25, fontWeight: "700" }}>
            <Image
              style={{ width: 35, height: 20 }}
              source={require("../../assets/leb.webp")}
            />
            {"  "}LBP {" -> "} USD{"  "}
            <Image
              style={{ width: 35, height: 20 }}
              source={require("../../assets/usd.webp")}
            />
          </Text>
        </View>
        <View style={style.cont}>
          <View>
            <Text style={{ fontSize: 25, fontWeight: "900" }}>Buy Rate</Text>
            <Text
              style={{ fontSize: 20, textAlign: "center", fontWeight: "700" }}
            >
              {" "}
              {data.buy_rate}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 25, fontWeight: "900" }}>Sell Rate</Text>
            <Text
              style={{ fontSize: 20, textAlign: "center", fontWeight: "700" }}
            >
              {" "}
              {data.sell_rate}
            </Text>
          </View>
        </View>
        <View style={style.cont}>
          <Text style={{ fontSize: 25, fontWeight: "700" }}>
            LBP{" -> "}USD Calculator
          </Text>
        </View>
        <View
          style={[
            style.cont,
            { flexDirection: "column", alignItems: "center" },
          ]}
        >
          <TextInput
            style={style.input}
            placeholder="Enter Amount"
            onChangeText={setAmount}
            autoCapitalize="none"
          />

          <RadioButton.Group
            value={currency}
            onValueChange={(newValue) => setCurrency(newValue)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>USD</Text>
                <RadioButton value="USD" />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginEnd: 30,
                }}
              >
                <Text>LBP</Text>
                <RadioButton value="LBP" />
              </View>
            </View>
          </RadioButton.Group>
          <TouchableOpacity style={style.calculatebtn} onPress={calculate}>
            <Text>Calculate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.calculatebtn}>
            <Text>
              <Text style={{ fontSize: 20, fontWeight: 800 }}>
                {Transfered}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  cont: {
    backgroundColor: "white",
    flexDirection: "row",
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
  input: {
    borderWidth: 0.5,
    padding: 6,
    borderRadius: 10,
    width: "90%",
  },
  calculatebtn: {
    backgroundColor: "white",
    flexDirection: "row",
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
