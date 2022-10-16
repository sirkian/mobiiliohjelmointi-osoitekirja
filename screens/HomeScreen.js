import { StyleSheet, View, FlatList, Alert } from "react-native";
import { database } from "../firebase";
import { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { Icon, Input, ListItem, Button } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const addressesRef = ref(database, "addresses/");
    onValue(addressesRef, (snapshot) => {
      const data = snapshot.val();
      const addresses = data
        ? Object.keys(data).map((key) => ({ key, ...data[key] }))
        : [];
      setAddresses(addresses);
    });
  }, []);

  const handleMapView = (address, disabled) => {
    if (address.length > 0) {
      navigation.navigate("MapView", { address: address, disabled: disabled });
    }
    setAddress("");
  };

  const showAlert = (address) => {
    Alert.alert(
      "Delete address?",
      `Address ${address.Street} will be permantently deleted.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "delete", onPress: () => handleDelete(address) },
      ]
    );
  };

  const handleDelete = (address) => {
    remove(ref(database, "/addresses/" + address.key));
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          label="Placefinder"
          labelStyle={{ color: "#c0ebd2" }}
          inputStyle={{ color: "white" }}
          placeholder="Type in address.."
          onChangeText={(text) => setAddress(text)}
          value={address}
        />
        <Button
          type="clear"
          title="Search"
          containerStyle={styles.btnContainer}
          icon={<Icon name="search" size={24} color="#c0ebd2" />}
          titleStyle={{ color: "#c0ebd2" }}
          onPress={() => handleMapView(address, false)}
        />
      </View>
      <View style={styles.listContainer}>
        {addresses.length > 0 && (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <ListItem
                containerStyle={{ backgroundColor: "#d7d5f0", borderRadius: 3 }}
                style={styles.listItem}
                onLongPress={() => showAlert(item)}
                topDivider
              >
                <ListItem.Content style={styles.list}>
                  <ListItem.Title>{`${item.Street}, ${item.PostalCode} ${item.City}`}</ListItem.Title>
                  <ListItem.Subtitle
                    onPress={() => handleMapView(item.Search, true)}
                  >
                    <Icon name="pin-drop" size={24} color="#181726" />
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181726",
    alignItems: "center",
  },
  inputContainer: {
    width: "70%",
    marginTop: 50,
    marginBottom: 30,
  },
  btnContainer: {
    alignSelf: "center",
    width: "50%",
    marginTop: -15,
  },
  listContainer: {
    width: "90%",
    display: "flex",
  },
  listItem: {
    marginBottom: 5,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
