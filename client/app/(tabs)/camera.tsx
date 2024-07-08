import { useCameraDevice, Camera } from "react-native-vision-camera";
import { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

export default function CameraScreen() {
  const device = useCameraDevice("back");

  if (device == null) return <Text>No camera device found</Text>;
  return (
    <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});
