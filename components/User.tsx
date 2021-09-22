import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GroupStats from "./GroupStats";
import UserStats from "./UserStats";
import { getUser, getGroup } from "../dbfunctions/dynamo.js";


export type Props = {
  currGroup?: any;
  navigation?: any;
};

const User: React.FC<Props> = ({ navigation }) => {
  const [currUser, setCurrUser] = useState(null);
  const [hasErrored, setHasErrored] = useState(false);
  const [currGroup, setCurrGroup] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    getUser()
      .then((res) => {
        setCurrUser(res);
        setHasLoaded(true);
      })
      .catch((err) => {
        setHasErrored(true);
      });
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      console.log('hello');
      console.log(currUser.Groups[0].length, '<--current group');
      
      getGroup(currUser.Groups[0]).then((res) => {
        setCurrGroup(res)
      }).catch((err) => {
        setHasErrored(true);
      });

    }
  }, [hasLoaded]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          style={styles.buttonHome}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonHomeText}>Home</Text>
        </Pressable>
        <Image
          style={styles.logo}
          source={require("../src/icons/carbontrack.png")}
        />
      </View>
      <View style={styles.userHeader}>
        <Text style={styles.userWelcome}>
          Hey,  {currUser ? currUser.UserName : "friend!"}
        </Text>
      </View>
      {currUser&&(
      <View style={styles.statsContainer}>
        <UserStats navigation={navigation} currUser={currUser} />
      </View>
      )}
      <View style={styles.statsContainer}>
        {currGroup&&
        (<GroupStats navigation={navigation} currUser={currUser} currGroup={currGroup}/>)
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "red",
  },
  headerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
    width: "90%",
    height: 60,
  },
  buttonHome: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#2F4847",
    backgroundColor: "#2F4847",
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    width: 80,
  },
  buttonHomeText: {
    color: "white",
    fontSize: 20,
  },
  userHeader: {
    color: "black",
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 2,
    // borderColor: "purple",
  },
  userWelcome: {
    fontSize: 28,
    fontWeight: "bold",
  },
  statsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: 250,
    borderRadius: 28,
    backgroundColor: "#D7E7E1",
    margin: 20,
    borderWidth: 2,
    borderColor: "green",
  },

  logo: {
    height: 35,
    width: 240,
    padding: 0,
    margin: 0,
  },
});

export default User;
