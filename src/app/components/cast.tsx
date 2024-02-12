import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { MovieScreenProps } from "../_layout";
import { CastMember } from "../types";
import { fallbackPersonImage, image185, image342, image500 } from "api/moviedb";

interface CastProps {
  navigation: MovieScreenProps["navigation"];
  cast: CastMember[];
}

export default function Cast({ navigation, cast }: CastProps) {
  let personName = "Keanu Reevs";
  let characterName = "John Wick";
  const { width, height } = Dimensions.get("window");
  //   console.log(JSON.stringify(cast, null, 2));
  return (
    <View className="my-6">
      <Text className="text-black dark:text-white text-lg mx-4 mb-5">
        Top Cast
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast &&
          cast.map((person, index) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.push("Person", { person })}
                key={index}
                className="mr-4 items-center "
                style={{ width: width * 0.2 }}
              >
                <View className="rounded-full overflow-hidden h-20 w-20  border border-neutral-500">
                  <Image
                    className=" h-28 w-20"
                    source={{
                      uri: image342(person.profile_path) || fallbackPersonImage,
                    }}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  className="text-xs text-black dark:text-white mt-1 "
                >
                  {person.character}
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-xs text-neutral-400  mt-1 "
                >
                  {person.name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
