import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { database } from "../firebase.js";
import { useEffect, useState } from "react";
import { push, ref } from "firebase/database";
import { Button } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

const API_KEY = "v2SRCGHU06h3rSc5G4XhbrL7Dum3C2RX";
const API_URL = `http://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=`;

export default function MapScreen({ route, navigation }) {
  const [region, setRegion] = useState(null);
  const [addressDetails, setAddressDetails] = useState(null);
  const { address, disabled } = route.params;

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await fetch(`${API_URL}${address}`);
      const json = await res.json();
      const result = json.results[0].locations[0];
      setRegion({
        latitude: result.displayLatLng.lat,
        longitude: result.displayLatLng.lng,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      });
      setAddressDetails({
        search: address,
        street: result.street,
        postalCode: result.postalCode,
        city: result.adminArea5,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = () => {
    if (address.length > 0) {
      push(ref(database, "addresses/"), {
        Street: addressDetails.street,
        City: addressDetails.city,
        PostalCode: addressDetails.postalCode,
        Search: address,
      });
      navigation.navigate("Placefinder");
    }
  };

  return (
    <SafeAreaProvider>
      <MapView style={styles.mapContainer} region={region}>
        {region !== null && <Marker coordinate={region} title={address} />}
      </MapView>
      <Button
        disabled={disabled}
        buttonStyle={{
          backgroundColor: "#181726",
          padding: 15,
        }}
        title="Save address"
        onPress={handleSave}
      />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});
