import React, { useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { Audio } from "expo-av";

export default function App() {
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
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
    setIsLoading(true);
    setTranscription(""); // Clear previous transcription
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
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {isLoading && <Text>Loading transcription...</Text>}
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
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
  transcriptionContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "90%",
  },
  transcriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transcriptionText: {
    fontSize: 16,
  },
});
