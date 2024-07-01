import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import {LinearGradient} from "expo-linear-gradient";

// icons
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
} from "react-native-heroicons/solid";

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

  async function sendFrameToServer(uri: string) {
    console.log("sending frame to server");
      // @ts-ignore
    const file = await FileSystem.readAsStringAsync(uri, {
      // @ts-ignore
      encoding: FileSystem.EncodingType.Base64,
    });

      const response = await fetch("YOUR_SERVER_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: file,
        }),
      });

      const data = await response.json();
      console.log(data);
  }
  
    useEffect(() => {
      let intervalId: NodeJS.Timeout;
      if (permission && permission.granted) {
        intervalId = setInterval(() => {
          captureFrame();
        }, 2000); // Capture frame every 2 seconds
      }
      return () => clearInterval(intervalId);
    }, [permission]);

  async function captureFrame() {
      console.log("capturing frame");
      if (cameraRef.current) {
        // @ts-ignore
        const photo = await cameraRef.current.takePictureAsync();
        await sendFrameToServer(photo.uri);
      }
    }

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View
          style={{
            padding: 16,
          }}
        >
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
