import { Link, useNavigation } from "expo-router";
import React from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "./screens/HomeScreen";
import Layout from "./_layout";
export default function Page(): React.JSX.Element {
  return <Layout />;
}
