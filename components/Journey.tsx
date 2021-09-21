import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { getDistance, getCoordinates } from "../dbfunctions/api-functions";
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';


const Journey: React.FC<Props> = ({ navigation }) => {
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  const [distance, setDistance] = useState(null);
  const [hasErrored, setHasErrored] = useState(false);
  const [coords, setCoords] = useState({})

  const handleSubmit = () => {
    getDistance(fromInput, toInput).then((res) => {
      setDistance(res);
    }).catch((err) => {
      setHasErrored(true);
    })

    getCoordinates(fromInput, toInput).then((res) => {
      setCoords(res)

      setDistance(res);
    }).catch((err) => {
      setHasErrored(true);
    });
  };
   
 

  return (
    <View style={styles.container}>
      <Text style={styles.from}>From:</Text>
      <TextInput
        defaultValue={fromInput}
        placeholder="PostCode/Location"
        style={styles.input}
        onChangeText={(fromInput) => setFromInput(fromInput)}
      />
      <Text style={styles.to}>To:</Text>
      <TextInput
        defaultValue={toInput}
        placeholder="PostCode/Location"
        style={styles.input}
        onChangeText={(toInput) => setToInput(toInput)}
      />
      <Button title="Submit" color="black" onPress={handleSubmit} />
      {distance && <Text>{distance}</Text>}
      <Button title="Back" color="black" onPress={() => { navigation.navigate("Home") }} />


      
        <MapView style={styles.mapView}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 53.481162,
          longitude: -2.244259,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
           }} >
          <Marker
          coordinate={{ latitude: coords.startLat, longitude: coords.startLng }}
          pinColor={'black'}
          />
          <Polyline
          coordinates={[
            { latitude: coords.startLat, longitude: coords.startLng },
            { latitude: coords.endLat, longitude: coords.endLng },
          ]}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={[
            '#E5845C',
          ]}
          strokeWidth={6}
          />
          <Marker
          coordinate={{ latitude: coords.endLat, longitude: coords.endLng }}
          title={'End of Carbon Offset'}
          />
         </MapView>
        
        

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  from: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
  to: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    width: 100,
  },
  mapView: {
    width: Dimensions.get('window').width,
    height: 300,
  }
});

export default Journey;