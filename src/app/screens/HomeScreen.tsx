import {
  View,
  Text,
  SafeAreaView,
  Platform,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import TrendingMovies from "../components/trendingMovies";
import MovieList from "../components/movieList";
import { useNavigation } from "expo-router";
import Loading from "../components/loading";
import {
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "api/moviedb";
import { auth } from "../../../firebase";

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const darkModeColor = colorScheme === "dark" ? "white" : "black";
  const primaryColor = "text-[#eab308]";
  const ios = Platform.OS == "ios";

  // fetching the data from API

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();

    if (data && data.results) {
      setTrending(data.results);
      setLoading(false);
    }
  };
  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    if (data && data.results) {
      setUpcoming(data.results);
      setLoading(false);
    }
  };
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    if (data && data.results) {
      setTopRated(data.results);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  return (
    <View className="flex-1 dark:bg-neutral-800 bg-white ">
      <SafeAreaView className={ios ? "mb-3" : "mt-16"}>
        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile" as never)}
          >
            <Bars3CenterLeftIcon
              size={34}
              strokeWidth={2}
              color={darkModeColor}
            />
          </TouchableOpacity>

          <Text className="text-3xl text-black font-bold dark:text-white">
            <Text className={primaryColor}>M</Text>ovies
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Search" as never)}
          >
            <MagnifyingGlassIcon
              size={30}
              strokeWidth={2}
              color={darkModeColor}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {/* TRENDING MOVIES */}
          {trending.length > 0 && <TrendingMovies data={trending} />}
          {/* upcoming movies */}
          {upcoming.length > 0 && (
            <MovieList title="Upcoming" data={upcoming} hideSeeAll={true} />
          )}
          {/* top rated movies */}
          {topRated.length > 0 && (
            <MovieList title="Top rated" data={topRated} hideSeeAll={true} />
          )}
        </ScrollView>
      )}
    </View>
  );
}
