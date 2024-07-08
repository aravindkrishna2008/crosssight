import React from "react";
import MapView from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import Camera from "react-native-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

// icons
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
} from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} enab>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <SafeAreaView>
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.00)", "rgba(255, 255, 255, 0.58)"]}
            style={{
              position: "absolute",
              width: "120%",
              height: 100,
              top: 0,
            }}
            end={{ x: 0, y: 0 }}
            start={{ x: 0, y: 1 }}
          />
          <View style={styles.topButtons}>
            <TouchableOpacity
              style={styles.buttonCircle}
              onPress={() => console.log("back")}
            >
              <ChevronLeftIcon color="white" size={20} />
            </TouchableOpacity>
            <Text
              style={{
                color: "white",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              Visualizer
            </Text>
            <TouchableOpacity
              style={styles.buttonCircle}
              onPress={() => console.log("back")}
            >
              <EllipsisVerticalIcon
                color="white"
                size={20}
                onPress={() => console.log("back")}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={require("@/assets/images/camera.png")}
            style={{
              alignSelf: "center",
              height: 320,
              width: 320,
              position: "absolute",
              top: 262,
            }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 430,
    position: "absolute",
    bottom: -430 / 2,
    borderRadius: 200,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 4,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    borderRadius: 200,
    backgroundColor: "rgba(255, 255, 255, 0.40)",
    justifyContent: "center",
    alignItems: "center",
  },
});
