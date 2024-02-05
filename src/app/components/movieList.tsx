import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { fallbackMoviePoster, image185 } from "api/moviedb";
import { HomeScreenProps } from "../_layout";
import { useColorScheme } from "nativewind";

const { width, height } = Dimensions.get("window");

interface MovieListProps {
  title: string;
  data: any[];
  hideSeeAll?: boolean;
}

const MovieList: React.FunctionComponent<MovieListProps> = ({
  title,
  data,
  hideSeeAll,
}) => {
  const navigation = useNavigation<HomeScreenProps["navigation"]>();

  //   const movieName = "Ant-Man and the Wasp: Quantumania";

  return (
    <View className="mb-8 space-y-3 flex flex-col gap-3">
      <View className="mx-4 flex-row items-center justify-between ">
        <Text className="text-black text-xl dark:text-white">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity>
            <Text className="text-[#eab308] text-lg">See All</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Movie row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {data.map((item, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => navigation.push("Movie", { movie: item })}
          >
            <View className="space-y-1 mr-4" style={{ width: width * 0.33 }}>
              <Image
                style={{
                  height: height * 0.22,
                }}
                className="rounded-3xl"
                source={{
                  uri: image185(item.poster_path) || fallbackMoviePoster,
                }}
                // source={require("../assets/moviePoster2.png")}
              />
              <Text
                style={{ flexGrow: 1 }}
                numberOfLines={2}
                className="text-black w-full dark:text-gray-400 my-2 text-center"
              >
                {/* {item && item.title
                  ? item.title.length > 14
                    ? item.title.slice(0, 14) + "..."
                    : item.title
                  : ""} */}
                {item.title}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};
export default MovieList;
