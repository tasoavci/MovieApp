import "../global.css";
import { Slot } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import HomeScreen from "../app/screens/HomeScreen";
import MovieScreen from "../app/screens/MovieScreen";
import PersonScreen from "./screens/PersonScreen";
import SearchScreen from "./screens/SearchScreen";
import { CastMember, Movie, MovieDetails } from "./types";

type RootStackParamList = {
  Home: undefined;
  Movie: {
    movie: Movie;
  };

  Person: {
    person: CastMember;
  };
  Search: undefined;
};
export type MovieScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Movie"
>;
export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;
export type PersonScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Person"
>;
export type SearchScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Search"
>;
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Layout() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Movie"
          options={{ headerShown: false }}
          component={MovieScreen}
        />
        <Stack.Screen
          name="Person"
          options={{ headerShown: false }}
          component={PersonScreen}
        />
        <Stack.Screen
          name="Search"
          options={{ headerShown: false }}
          component={SearchScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
