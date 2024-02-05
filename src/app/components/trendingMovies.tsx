import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";
import { useNavigation } from "expo-router";
import { image500 } from "api/moviedb";
import { Movie } from "../types";
import { HomeScreenProps } from "../_layout";
const { width, height } = Dimensions.get("window");

interface TrendingMoviesProps {
  data: Movie[];
}

export default function TrendingMovies({ data }: TrendingMoviesProps) {
  const navigation = useNavigation<HomeScreenProps["navigation"]>();

  return (
    <View className="py-10 flex  gap-5 ">
      <Text className="text-black text-xl ml-3 dark:text-white">
        Trending Movies
      </Text>
      <Carousel
        data={data}
        renderItem={({ item }) => (
          <MovieCard
            item={item}
            handleClick={(item) =>
              navigation.navigate("Movie", { movie: item })
            }
          />
        )}
        firstItem={1}
        inactiveSlideOpacity={0.6}
        sliderWidth={width}
        itemWidth={width * 0.62}
        slideStyle={{
          display: "flex",
          alignItems: "center",
        }}
      />
    </View>
  );
}

interface MovieCardProps {
  item: Movie;
  handleClick: (movie: Movie) => void;
}
const MovieCard = ({ item, handleClick }: MovieCardProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <Image
        // source={require("../assets/moviePoster1.png")}
        source={{ uri: image500(item.poster_path) ?? "" }}
        style={{
          width: width * 0.6,
          height: height * 0.4,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
        }}
        className="rounded-3xl"
      />
    </TouchableWithoutFeedback>
  );
};
