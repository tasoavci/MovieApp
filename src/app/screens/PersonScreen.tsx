import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation } from "expo-router";
import BackAndHeartButtons from "../components/backAndHeartButtons";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import { useRoute } from "@react-navigation/native";
import { PersonScreenProps } from "../_layout";
import {
  fallbackPersonImage,
  fetchCastDetails,
  fetchCastMovieDetails,
  image500,
} from "api/moviedb";
import { CastDetails, CastMovieDetails, MovieCast } from "../types";
const { width, height } = Dimensions.get("window");
const ios = Platform.OS == "ios";

export default function PersonScreen() {
  const [loading, setLoading] = useState(false);
  const { params } = useRoute<PersonScreenProps["route"]>();
  const [castDetails, setCastDetails] = useState<CastDetails>([] as never);
  const [castMovieDetails, setCastMovieDetails] = useState<CastMovieDetails[]>(
    []
  );
  const navigation = useNavigation();
  const verticalMargin = ios ? "" : "my-3";
  const [personMovies, setPersonMovies] = useState([]);

  const getCastDetails = async (id: number) => {
    const data = await fetchCastDetails(id);
    setCastDetails(data);
    setLoading(false);
  };
  const getCastMovieDetails = async (id: number) => {
    const data = await fetchCastMovieDetails(id);
    setCastMovieDetails(data.cast);
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    getCastDetails(params.person?.id);
    getCastMovieDetails(params.person?.id);
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-neutral-900 "
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* person details */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <BackAndHeartButtons
            margin={verticalMargin}
            navigation={navigation.goBack}
            absolute={false}
          />
          <View
            className="my-10"
            style={{
              shadowColor: "gray",
              shadowRadius: 40,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
            }}
          >
            <View className="flex-row justify-center items-center">
              <View className="items-center overflow-hidden rounded-full h-96 w-96 border border-neutral-500">
                <Image
                  source={{
                    uri:
                      image500(params.person?.profile_path) ||
                      fallbackPersonImage,
                  }}
                  style={{ height: height * 0.5, width: width * 0.8 }}
                />
              </View>
            </View>
            <View className="mt-10">
              <Text className="text-4xl text-white text-center font-bold">
                {params.person?.name}
              </Text>
              <Text className="text-base text-neutral-400 text-center ">
                {castDetails.place_of_birth}
              </Text>
            </View>
          </View>
          <View className="mx-3 p-4 mt-4 flex-row justify-center items-center bg-neutral-700 rounded-full">
            <View className="border-r-2 border-r-neutral-400 pr-4 pl-[5px] items-center ">
              <Text className="text-white font-semibold">Gender</Text>
              <Text className="text-neutral-300 text-sm">
                {params.person?.gender === 2 ? "Male" : "Female" || "N/A"}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400  px-4 items-center">
              <Text className="text-white font-semibold">Birthday</Text>
              <Text className="text-neutral-300 text-sm">
                {castDetails.birthday || "N/A"}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-4 items-center">
              <Text className="text-white font-semibold">Known for</Text>
              <Text className="text-neutral-300 text-sm">
                {params.person?.known_for_department || "N/A"}
              </Text>
            </View>
            <View className="  pl-5 items-center">
              <Text className="text-white font-semibold">Popularity</Text>
              <Text className="text-neutral-300 text-sm">
                {params.person?.popularity.toFixed(2) || "N/A"}
              </Text>
            </View>
          </View>
          <View className="my-10 mx-4 flex-col items-center justify-center gap-5">
            <Text className="text-white text-2xl">Biography</Text>
            <Text className="text-neutral-400 tracking-wide text-center">
              {castDetails.biography || "N/A"}
            </Text>
          </View>
          <MovieList title="Movies" hideSeeAll={true} data={castMovieDetails} />
        </>
      )}
    </ScrollView>
  );
}
