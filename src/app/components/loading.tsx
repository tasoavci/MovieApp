import { View, Text, Dimensions } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";

const { width, height } = Dimensions.get("window");
export default function Loading() {
  const primaryColor = "#eab308";

  return (
    <View
      style={{ width: width, height: height }}
      className="absolute flex-row justify-center items-center"
    >
      <Progress.CircleSnail thickness={12} size={160} color={primaryColor} />
    </View>
  );
}
