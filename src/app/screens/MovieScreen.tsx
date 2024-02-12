import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
const dot = "•";
// import { useRouter } from "expo-router";
// import { useRouteInfo } from "expo-router/build/hooks";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import BackAndHeartButtons from "../components/backAndHeartButtons";
import Loading from "../components/loading";
import { MovieScreenProps } from "../_layout";
import {
  fallbackMoviePoster,
  fetchCredits,
  fetchDetails,
  fetchSimilar,
  image185,
  image342,
  image500,
} from "api/moviedb";
import { useColorScheme } from "nativewind";
import { CastMember, MovieCredits, MovieDetails } from "../types";
import { db, auth } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS == "ios";
const topMargin = ios ? "" : "mt-3";
export default function MovieScreen() {
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [loadingCast, setLoadingCast] = useState(false);

  const [isFavourite, setIsFavourite] = useState(false);
  const favouriteColor = isFavourite ? "red" : "white";
  const [cast, setCast] = useState<CastMember[]>([] as never);
  const [details, setDetails] = useState<MovieDetails>([] as never);

  const [similarMovies, setSimilarMovies] = useState([]);
  const navigation = useNavigation<MovieScreenProps["navigation"]>();
  const { params } = useRoute<MovieScreenProps["route"]>();

  const { colorScheme } = useColorScheme();
  const gradientColors =
    colorScheme === "dark"
      ? ["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]
      : [
          "transparent",
          "rgba(255,255,255,0.00)",
          "rgba(255,255,255,0.00)",
          "rgba(255,255,255,1)",
        ];

  useEffect(() => {
    const checkFavouriteStatus = async () => {
      const isFavourite = await checkIfMovieIsFavourite();
      setIsFavourite(isFavourite);
    };

    checkFavouriteStatus();
  }, []);

  const addFavouriteMovie = async () => {
    try {
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

      // Yeni bir belge (film) ekle
      await addDoc(favoriteMoviesRef, params?.movie);

      console.log("Favori film eklendi");
    } catch (error: any) {
      console.error("Favori film eklenirken hata oluştu:", error.message);
    }
  };

  const handleAddToFavourites = async () => {
    await addFavouriteMovie();
    setIsFavourite(true); // Favori eklendiğinde durumu true olarak güncelle
  };

  const checkIfMovieIsFavourite = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error("Kullanıcı oturumu açık değil.");
        return false; // Kullanıcı oturumu açık değilse, favori film değil.
      }

      const favoriteMoviesRef = collection(
        db,
        "users",
        userId,
        "favoriteMovies"
      );

      // Favori filmler koleksiyonundaki belirli bir filmi içeren belgeyi sorgula
      const querySnapshot = await getDocs(
        query(favoriteMoviesRef, where("id", "==", params?.movie.id))
      );

      // Eğer belge bulunduysa, film favori olarak işaretlenmiş demektir
      if (!querySnapshot.empty) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error(
        "Favori film kontrol edilirken hata oluştu:",
        error.message
      );
      return false; // Bir hata oluştuğunda, favori film değil.
    }
  };

  const deleteFavoriteMovie = async () => {
    try {
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

      // Kullanıcının favori filmler koleksiyonundan belirli bir filmi kaldır
      const querySnapshot = await getDocs(
        query(favoriteMoviesRef, where("id", "==", params?.movie.id))
      );

      // Koleksiyonda belirli bir film belgesi varsa, onu kaldır
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log("Favori film kaldırıldı");
    } catch (error: any) {
      console.error("Favori film kaldırılırken hata oluştu:", error.message);
    }
  };

  const handleRemoveFromFavourites = async () => {
    await deleteFavoriteMovie();

    setIsFavourite(false); // Favori kaldırıldığında durumu false olarak güncelle
  };

  const getCredits = async (id: number) => {
    setCast([]);
    const data = await fetchCredits(id);
    setCast(data.cast);
    setLoadingCast(false);
  };
  const getDetails = async (id: number) => {
    const data = await fetchDetails(id);
    setDetails(data);
    setLoadingDetails(false);
  };
  const getSimilarMovies = async (id: number) => {
    const data = await fetchSimilar(id);
    setSimilarMovies(data.results);
    setLoadingSimilar(false);
  };
  useEffect(() => {
    setLoadingSimilar(true);
    setLoadingCast(true);
    setLoadingDetails(true);
    getDetails(params.movie?.id);
    getCredits(params.movie?.id);
    getSimilarMovies(params.movie?.id);
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {loadingCast && loadingSimilar && loadingDetails ? (
        <Loading />
      ) : (
        <>
          <View className="w-full">
            <BackAndHeartButtons
              margin={topMargin}
              navigation={navigation.goBack}
              absolute={true}
            />

            <View>
              <Image
                source={{
                  uri:
                    image500(params.movie?.poster_path) || fallbackMoviePoster,
                }}
                style={{ width: width, height: height * 0.55 }}
              />
              <LinearGradient
                colors={gradientColors}
                style={{
                  width: width,
                  height: height * 0.4,
                  position: "absolute",
                  bottom: 0,
                }}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
            </View>
          </View>
          <View
            style={{ marginTop: -(height * 0.09) }}
            className="flex-col justify-center items-center gap-8"
          >
            <Text className="text-black dark:text-white text-center text-3xl font-bold tracking-wider">
              {params.movie?.title}
            </Text>
            <TouchableOpacity
              onPress={
                isFavourite ? handleRemoveFromFavourites : handleAddToFavourites
              }
            >
              <HeartIcon size={34} strokeWidth={2.4} color={favouriteColor} />
            </TouchableOpacity>
            <Text className="text-neutral-400 font-semibold text-base text-center my-2">
              {details.status} {dot} {params.movie?.release_date.slice(0, 4)}{" "}
              {dot} {details.runtime} min
            </Text>

            <View className="flex flex-row items-center justify-center gap-4">
              {details.genres &&
                details.genres.map((genre, index) => (
                  <Text className="text-neutral-400 text-lg" key={index}>
                    {genre.name}
                  </Text>
                ))}
            </View>
            <Text className="text-neutral-400 mx-4 tracking-wider mb-5">
              {params.movie?.overview}
            </Text>
          </View>
          {cast.length > 0 && <Cast navigation={navigation} cast={cast} />}
          {similarMovies.length > 0 && (
            <MovieList
              title={"Similar Movies"}
              hideSeeAll={true}
              data={similarMovies}
            />
          )}
        </>
      )}
    </ScrollView>
  );
}
