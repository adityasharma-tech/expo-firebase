import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import auth from "@react-native-firebase/auth";
import { Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = React.useState<any>(null);

  function onAuthStateChanged(u: any) {
      console.log("@onAuthStateChanged.user:", u);
      if (!u) {
        router.push("/auth");
      }
      setUser(u);
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  async function handleLogout() {
    await auth()
      .signOut()
      .then(() => router.push("/auth"))
      .catch((err: any) =>
        Toast.show({
          type: "error",
          text1: "Some error occurred.",
          text2: err?.message,
        })
      );
  }

  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {user ? (
          <Button mode="contained" onPress={handleLogout}>
            Logout
          </Button>
        ) : (
            <Button mode="contained">Loading....</Button>
        )}
      </View>
    </View>
  );
}
