import {
  View,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import BackAndHeartButtons from "../components/backAndHeartButtons";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../_layout";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Firebase bağlantı nesnenizi buradan alın
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import { Image } from "react-native";

import { fallbackMoviePoster, image500 } from "api/moviedb";

const ios = Platform.OS == "ios";
const topMargin = ios ? "" : "mt-3";
const { width, height } = Dimensions.get("window");

interface FavouriteMovies {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [favouriteData, setFavouriteData] = useState<FavouriteMovies[]>([]);
  useEffect(() => {
    // Firestore'dan favori filmleri çekme işlemi
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error("Kullanıcı oturumu açık değil.");
          return;
        }

        const favoriteMoviesRef = collection(
          db,
          "users",
          userId,
          "favoriteMovies"
        );
        const q = query(favoriteMoviesRef);

        const querySnapshot = await getDocs(q);
        const favouriteData = querySnapshot.docs.map(
          (doc) => doc.data() as FavouriteMovies
        );
        setLoading(false);
        setFavouriteData(favouriteData);
      } catch (error: any) {
        console.error(
          "Favori filmler getirilirken hata oluştu:",
          error.message
        );
      }
    };

    fetchData(); // useEffect içinde fetchData fonksiyonunu çağırarak veriyi çekiyoruz
  }, []);
  const navigation = useNavigation<RootStackNavigationProp<"Profile">>();
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Çıkış başarılı");
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Çıkış işlemi sırasında hata oluştu:", error.message);
    }
  };

  return (
    <View className="flex-1 bg-neutral-900">
      {loading ? (
        <Loading />
      ) : (
        <View className="w-full">
          <BackAndHeartButtons
            navigation={navigation.goBack}
            margin={topMargin}
            absolute={false}
          />
          <View className="flex h-[85%] items-center justify-center gap-6 mt-10">
            <Text className="text-white text-4xl">
              Hello {auth.currentUser?.email} !
            </Text>
            <TouchableOpacity
              onPress={handleSignOut}
              className="rounded-2xl overflow-hidden"
            >
              <Text className="text-neutral-200 bg-red-500 text-3xl px-7 py-3">
                Sign Out
              </Text>
            </TouchableOpacity>
            <Text className="text-[#eab308] font-semibold ml-1 mb-6 mt-2 text-center text-2xl ">
              <Text className="text-white ">Your Favourite </Text>Movies
            </Text>

            {favouriteData.length > 0 && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                className="flex gap-3"
              >
                <View className="flex-row justify-between flex-wrap">
                  {favouriteData.map((item, index) => {
                    return (
                      <TouchableWithoutFeedback
                        key={index}
                        onPress={() =>
                          navigation.navigate("Movie", { movie: item })
                        }
                      >
                        <View
                          style={{ width: width * 0.45 }}
                          className="mb-6 space-y-2 flex-col items-center justify-center gap-2"
                        >
                          <Image
                            className="rounded-3xl"
                            source={{
                              uri:
                                image500(item.poster_path) ||
                                fallbackMoviePoster,
                            }}
                            style={{
                              width: width * 0.44,
                              height: height * 0.3,
                            }}
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
            )}
          </View>
        </View>
      )}
    </View>
  );
}
