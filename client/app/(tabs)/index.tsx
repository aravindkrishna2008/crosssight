import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

// icons
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
} from "react-native-heroicons/solid";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

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
      <CameraView style={styles.camera} facing={facing}>
        <View
          style={{
            padding: 16,
          }}
        >
          <View style={styles.topButtons}>
            <View style={styles.buttonCircle}>
              <ChevronLeftIcon
                color="white"
                size={20}
                onPress={() => console.log("back")}
              />
            </View>
            <Text
              style={{
                color: "white",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              Visualizer
            </Text>
            <View style={styles.buttonCircle}>
              <EllipsisVerticalIcon
                color="white"
                size={20}
                onPress={() => console.log("back")}
              />
            </View>
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
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    margin: 64,
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
    marginTop: 40,
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
