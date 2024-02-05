import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React, { useState } from "react";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HomeIcon } from "react-native-heroicons/solid";
import { useNavigation } from "expo-router";
import { MovieScreenProps } from "../_layout";

interface ListProps {
  margin: string;
  navigation: any;
  absolute?: boolean;
}

export default function BackAndHeartButtons({
  margin,
  navigation,
  absolute,
}: ListProps) {
  const [isFavourite, setIsFavourite] = useState(false);
  const colorScheme = useColorScheme();
  const darkModeColor = colorScheme === "dark" ? "white" : "black";
  const isAbsolute = absolute ? "z-10 absolute" : "";
  const nav = useNavigation<MovieScreenProps["navigation"]>();

  return (
    <View
      className={
        `${isAbsolute} w-full pt-16 px-4 flex-row justify-between items-center` +
        { margin }
      }
    >
      <TouchableOpacity
        onPress={() => navigation()}
        className="rounded-xl p-1 pr-2 py-[6px] bg-[#eab308]  "
      >
        <ChevronLeftIcon size={28} strokeWidth={2.5} color={darkModeColor} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => nav.navigate("Home")}>
        <HomeIcon size={35} strokeWidth={2.5} color={"white"} />
      </TouchableOpacity>
    </View>
  );
}
