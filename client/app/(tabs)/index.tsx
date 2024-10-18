import React, { useState, useRef, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Audio } from "expo-av";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
} from "react-native-heroicons/solid";

import Map from "@/components/MapComponent";
import Hamburger from "@/components/HamburgerComponent";
import BottomPopUp from "@/components/BottomPopUp";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermissionResponse, requestAudioPermission] =
    Audio.usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [recording, setRecording] = useState();
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!cameraPermission || isLoading) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={requestCameraPermission}
          title="Grant camera permission"
        />
      </View>
    );
  }

  const flipCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  async function startRecording() {
    try {
      if (audioPermissionResponse.status !== "granted") {
        console.log("Requesting audio permission..");
        await requestAudioPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.LOW_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    await sendAudioToServer(uri);
  }

  async function sendAudioToServer(uri) {
    setIsTranscribing(true);
    setTranscription("");
    const serverUrl = "http://192.168.86.184:5001/transcribe"; // Update this

    try {
      console.log("Preparing to send audio file:", uri);

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "audio/wav",
        name: "audio.wav",
      });

      console.log("Sending request to server:", serverUrl);

      const response = await fetch(serverUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("Raw server response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Parsed server response:", result);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Invalid JSON response from server");
      }

      if (result !== undefined) {
        console.log("Transcription:", result);
        setTranscription(result);
        console.log("Transcription set");
      } else {
        setTranscription("Error: Unable to transcribe audio");
      }
    } catch (error) {
      console.error("Detailed error:", error);
      setTranscription(`Error: ${error.message}`);
    } finally {
      setIsTranscribing(false);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <BottomPopUp />
        {mapVisible && <Map />}
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <Image
            source={require("@/assets/images/camera.png")}
            style={styles.cameraOverlay}
          />
        </TouchableOpacity>
        <SafeAreaView>
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.00)", "rgba(255, 255, 255, 0.58)"]}
            style={styles.topGradient}
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
            <Text style={styles.title}>Visualizer</Text>
            <Hamburger setMapVisible={setMapVisible} flipCamera={flipCamera} />
          </View>
          
        </SafeAreaView>
      </CameraView>
      {isTranscribing && <Text>Transcribing audio...</Text>}
      {transcription !== "" && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionTitle}>Transcription:</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      )}
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
  cameraOverlay: {
    alignSelf: "center",
    height: 320,
    width: 320,
    position: "absolute",
    top: 242,
  },
  topGradient: {
    position: "absolute",
    width: "120%",
    height: 100,
    top: 0,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
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
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  transcriptionContainer: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 5,
  },
  transcriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transcriptionText: {
    fontSize: 16,
  },
});
