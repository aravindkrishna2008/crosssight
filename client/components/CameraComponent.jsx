import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Button } from "react-native";
import { RNCamera } from "react-native-camera";

const CameraComponent = () => {
  const cameraRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const captureFrame = async () => {
    if (cameraRef.current) {
      const options = { base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const binaryData = atob(data.base64);
      console.log(binaryData);
    }
  };

  const startCapturing = () => {
    intervalRef.current = setInterval(captureFrame, 100);
  };

  const stopCapturing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      />
      <Button title="Start" onPress={startCapturing} />
      <Button title="Stop" onPress={stopCapturing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default CameraComponent;
