import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useRouter } from 'expo-router';
import { ImageBackground, Text, View } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import auth from "@react-native-firebase/auth";

export default function Auth() {
  const intent = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  // If null, no SMS has been sent
  const [confirm, setConfirm] =
    React.useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const [phoneNumber, setPhoneNumber] = React.useState<string>("+911234567890");
  const [otpValue, setOtpValue] = React.useState<string>("");

  // Handle login
  function onAuthStateChanged(user: any) {
    if (user) {
      console.log("@onAuthStateChanged.user:", user);
      router.push('/');
    }
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  async function handleOtpSend() {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Toast.show({
        type: "success",
        text1: "Please enter the otp here.",
      });
    } catch (error: any) {
      setConfirm(null);
      Toast.show({
        type: "error",
        text1: "Failed to send otp.",
        text2: error?.message,
      });
    }
  }

  async function handleVerify() {
    if (!confirm) return;
    try {
      await confirm.confirm(otpValue);
      Toast.show({
        type: "success",
        text1: "You are logined successfully",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to verify otp.",
        text2: error?.message,
      });
    }
  }

  async function handleSubmit() {
    if (phoneNumber.trim() == "") {
      Toast.show({
        type: "success",
        text1: "Invalid input",
        text2: "Please enter your phone number.",
      });
      return;
    }
    if (confirm) await handleVerify();
    else await handleOtpSend();
  }

  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <StatusBar style="light" />
      <ImageBackground
        source={require("../assets/images/login_image_background.png")}
        style={{
          paddingHorizontal: 20,
          paddingTop: 60 + intent.top,
          paddingVertical: 35,
          flexDirection: "column",
          rowGap: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: 500,
            fontSize: 40,
            lineHeight: 45,
            fontFamily: "DMSansMedium",
          }}
        >
          {"Sign in to your \nAccount"}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontFamily: "DMSansExtraLight",
          }}
        >
          Sign in to your Account
        </Text>
      </ImageBackground>
      <View
        style={{
          paddingVertical: 35,
          paddingHorizontal: 20,
          backgroundColor: "white",
          height: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            rowGap: 25,
          }}
        >
          <TextInput
            mode="outlined"
            label="Phone Number"
            spellCheck={false}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            outlineColor="#d9d9d9"
            activeOutlineColor={theme.colors.primary}
            outlineStyle={{
              borderRadius: 8,
              elevation: 0,
              shadowOpacity: 0,
            }}
            style={{
              backgroundColor: "#ffffff",
            }}
          />
          <TextInput
            mode="outlined"
            label="Otp here"
            // secureTextEntry
            spellCheck={false}
            outlineColor="#d9d9d9"
            value={otpValue}
            onChangeText={(text) => setOtpValue(text)}
            maxLength={6}
            activeOutlineColor={theme.colors.primary}
            outlineStyle={{
              borderRadius: 8,
              elevation: 0,
              shadowOpacity: 0,
            }}
            style={{
              backgroundColor: "#ffffff",
            }}
          />
          <Text
            style={{
              textAlign: "right",
              fontWeight: "500",
              color: theme.colors.primary,
            }}
          >
            Resend Otp?
          </Text>
          <Button
            onPress={handleSubmit}
            mode="contained"
            buttonColor={theme.colors.primaryContainer}
            textColor="#000"
            labelStyle={{
              fontSize: 16,
              fontWeight: "600",
              fontFamily: "DMSansMedium",
            }}
            contentStyle={{
              paddingVertical: 4,
            }}
            style={{
              borderRadius: 10,
            }}
          >
            {confirm ? "Verify" : "Get Otp"}
          </Button>
        </View>
      </View>
    </View>
  );
}
