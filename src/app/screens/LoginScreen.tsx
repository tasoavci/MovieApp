import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
const { width, height } = Dimensions.get("window");
import {
  Auth,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home" as never);
      }
    });
    return unSubscribe;
  }, []);

  const handleRegister = async () => {
    setEmail("");
    setPassword("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Oluşturulan kullanıcı:", user);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Hata kodu: ${errorCode}, Hata mesajı: ${errorMessage}`);
      if (errorCode === "auth/email-already-in-use") {
        Alert.alert("User already exists");
      }
    }
  };

  const handleLogin = () => {
    setEmail("");
    setPassword("");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Giriş başarılı
        const user = userCredential.user;
        console.log("Giriş yapılan kullanıcı:", user);
      })
      .catch((error) => {
        // Giriş hatası
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Hata kodu: ${errorCode}, Hata mesajı: ${errorMessage}`);

        if (errorCode === "auth/invalid-credential" || "auth/invalid-email") {
          Alert.alert("Invalid Credentials");
        }
      });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 items-center justify-center bg-neutral-900"
      behavior="padding"
    >
      <View className="flex-col mb-24 justify-center items-center">
        <Text className="text-white text-6xl">
          <Text className="text-[#eab308]">M</Text>ovies
        </Text>
      </View>
      <View
        style={{ width: width * 0.8 }}
        className="flex-col gap-3 justify-center mx-auto  items-center bg-neutral-900 "
      >
        <TextInput
          className="text-neutral-500 text-4xl text-center w-[80%] border-neutral-500 border rounded-3xl p-3"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          className="text-neutral-500 text-4xl text-center w-[80%] border border-neutral-500 rounded-3xl p-3"
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <View className="flex-row items-center justify-center gap-4 mt-10 ">
          <TouchableOpacity
            className="rounded-full overflow-hidden"
            onPress={handleLogin}
          >
            <Text className="text-white text-2xl bg-[#eab308] px-7 py-1 rounded-full  ">
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-full overflow-hidden"
            onPress={handleRegister}
          >
            <Text className="text-white text-2xl bg-[#eab308] px-4 py-1 rounded-full  ">
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
