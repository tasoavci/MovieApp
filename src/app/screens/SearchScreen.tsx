import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import React, { useCallback, useState } from "react";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "expo-router";
import Loading from "../components/loading";
import { SearchScreenProps } from "../_layout";
import { Movie } from "../types";
import { debounce } from "lodash";
import { fallbackMoviePoster, fetchSearchMovie, image500 } from "api/moviedb";
const { width, height } = Dimensions.get("window");
const ios = Platform.OS == "ios";

export default function SearchScreen() {
  const handleSearch = (value: any) => {
    if (value && value.length > 2) {
      setLoading(true);
      fetchSearchMovie({
        query: value,
        include_adult: "false",
        language: "en-US",
        page: "1",
      }).then((data) => {
        setLoading(false);
        if (data && data.results) {
          setResults(data.results);
        }
      });
    } else {
      setLoading(true);
      setResults([]);
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  const navigation = useNavigation<SearchScreenProps["navigation"]>();
  const [results, setResults] = useState<Movie[]>([]);
  return (
    <View className="bg-neutral-900 flex-1 pt-16">
      <View className="mx-4 mb-3 flex-row justify-center items-center border border-neutral-500 rounded-full">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search Movie"
          placeholderTextColor={"lightgray"}
          className="pb-1 pl-6 flex-1 font-semibold text-lg text-white tracking-wider"
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home" as never);
          }}
          className="rounded-full m-1 p-3 bg-neutral-500"
        >
          <XMarkIcon size={25} color={"white"} />
        </TouchableOpacity>
      </View>
      {/* results */}
      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          className="flex gap-3"
        >
          <Text className="text-white font-semibold ml-1 mb-6 mt-2">
            Results ({results.length})
          </Text>
          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.navigate("Movie", { movie: item })}
                >
                  <View
                    style={{ width: width * 0.45 }}
                    className="mb-6 space-y-2 flex-col items-center justify-center gap-2"
                  >
                    <Image
                      className="rounded-3xl"
                      source={{
                        uri: image500(item.poster_path) || fallbackMoviePoster,
                      }}
                      style={{ width: width * 0.44, height: height * 0.3 }}
                    />
                    <Text
                      numberOfLines={1}
                      className="text-neutral-300 ml-1 text-center"
                    >
                      {item.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-row justify-center">
          <Image
            className="h-96 w-96"
            source={require("../assets/movieTime.png")}
          />
        </View>
      )}
    </View>
  );
}
