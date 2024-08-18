import * as React from "react";
import { ActivityIndicator, Text, StyleSheet, View, Pressable, Image, TextInput } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border } from '@/components/GlobalStyles';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { useState } from "react";
import { FIREBASE_AUTH } from "@/Firebase/FirebaseConfig";
import TabLayout from "./(tabs)/_layout";
const SignIn = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate("(tabs)");
    } catch (error: any) {
      let errorMessage = "Sign in failed.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      }
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.signIn}>
      <View style={[styles.topParent, styles.topParentPosition]}>
        <View style={[styles.top, styles.topPosition]}>
          <Text style={styles.signIn1}>Sign In</Text>
        
        </View>
        <View style={[styles.groupParent, styles.groupPosition]}>
          <View
            style={[
              styles.roundedRectangleParent,
              styles.rectangleParentPosition,
            ]}
          >
            <View style={[styles.roundedRectangle, styles.roundedBorder]} />
            <TextInput
              style={[styles.enterYourEmail, styles.enterYourEmailFlexBox]}
              placeholder="Enter your Email"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
            />
            <Image
              style={[styles.iconUserOutline, styles.iconLayout1]}
              // contentFit="cover"
              source={require("../assets/icon--useroutline1.png")}
            />
          </View>
          <View style={[styles.roundedRectangleGroup, styles.groupPosition]}>
            <View style={[styles.roundedRectangle, styles.roundedBorder]} />
            <Image
              style={[styles.iconUserOutline, styles.iconLayout1]}
              source={require("../assets/icon--password.png")}
            />
            <TextInput
              style={[styles.enterYourEmail, styles.enterYourEmailFlexBox]}
              placeholder="Enter your Password"
              autoCapitalize="none"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />
            <Image
              style={[styles.iconEyeSlash, styles.iconLayout1]}
              // contentFit="cover"
              source={require("../assets/icon--eye-slash.png")}
            />
          </View>
          <Text style={[styles.forgotPassword, styles.enterYourEmailFlexBox]}>
            Forgot password?
          </Text>
        </View>
        <View style={[styles.groupContainer, styles.groupPosition]}>
          <View style={[styles.rectangleParent, styles.rectangleParentPosition]}>
            <Pressable style={styles.groupChild} onPress={signIn} />
            <Text style={[styles.signIn2, styles.signTypo]}>Sign In</Text>
          </View>
          <Pressable
            style={[styles.dontHaveAnContainer, styles.topParentPosition]}
            onPress={() => navigation.navigate("signup")}
          >
            <Text style={styles.text}>
              <Text style={styles.dontHaveAnAccount}>
                <Text style={styles.dontHaveAn}>{`Don’t have an account? `}</Text>
                {` `}
              </Text>
              <Text style={[styles.signUp, styles.signTypo]}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </View>
      {loading && <ActivityIndicator size="large" color={Color.colorDodgerblue_100} />}
    </View>
  );
};

const styles = StyleSheet.create({
  topParentPosition: {
    top: 65,
    position: "absolute",
  },
  topPosition: {
    height: 40,
    left: 0,
    top: 0,
    position: "absolute",
  },
  groupPosition: {
    left: "0%",
    right: "0%",
    position: "absolute",
    width: "100%",
  },
  rectangleParentPosition: {
    top: "0%",
    left: "0%",
    right: "0%",
    position: "absolute",
    width: "100%",
  },
  roundedBorder: {
    borderWidth: 1,
    borderStyle: "solid",
    position: "absolute",
  },
  enterYourEmailFlexBox: {
    textAlign: "left",
    //position: "absolute",
  },
  iconLayout1: {
    maxHeight: "100%",
    maxWidth: "100%",
    bottom: "28.57%",
    width: "8%",
    height: "42.86%",
    top: "28.57%",
    position: "absolute",
    overflow: "hidden",
  },
  signTypo: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
  },
  signIn1: {
    top: 8,
    left: 119,
    fontSize: FontSize.size_lg,
    fontWeight: "700",
    fontFamily: FontFamily.poppinsBold,
    textAlign: "center",
    color: Color.colorGray_100,
    lineHeight: 24,
    position: "absolute",
  },
  buttonIcon: {
    width: 40,
  },
  top: {
    width: 181,
  },
  roundedRectangle: {
    backgroundColor: Color.colorWhitesmoke,
    borderColor: Color.colorGray_500,
    borderRadius: Border.br_7xs,
    borderWidth: 1,
    bottom: "0%",
    height: "100%",
    top: "0%",
    left: "0%",
    right: "0%",
    width: "100%",
  },
  enterYourEmail: {
    left: "21.33%",
    lineHeight: 21,
    color: Color.colorGray_300,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: FontSize.size_sm,
    top: "32.14%",
    textAlign: "left",
  },
  iconUserOutline: {
    right: "83.67%",
    left: "8.33%",
  },
  roundedRectangleParent: {
    bottom: "67.06%",
    height: "32.94%",
  },
  iconEyeSlash: {
    right: "8.33%",
    left: "83.67%",
  },
  roundedRectangleGroup: {
    top: "47.65%",
    bottom: "19.41%",
    height: "32.94%",
  },
  forgotPassword: {
    width: "40.33%",
    top: "89.41%",
    left: "59.67%",
    fontSize: FontSize.size_smi,
    lineHeight: 18,
    fontWeight: "500",
    fontFamily: FontFamily.poppinsMedium,
    color: Color.colorDodgerblue_100,
  },
  groupParent: {
    height: "27.42%",
    top: "11.29%",
    bottom: "61.29%",
  },
  groupChild: {
    borderRadius: Border.br_13xl,
    backgroundColor: Color.colorDodgerblue_100,
    bottom: "0%",
    height: "100%",
    top: "0%",
    left: "0%",
    right: "0%",
    position: "absolute",
    width: "100%",
  },
  signIn2: {
    left: "41%",
    color: Color.colorWhite,
    fontSize: FontSize.size_base,
    textAlign: "center",
    lineHeight: 24,
    position: "absolute",
    top: "28.57%",
    fontWeight: "600",
  },
  rectangleParent: {
    height: "65.12%",
    bottom: "34.88%",
  },
  dontHaveAn: {
    letterSpacing: 1,
  },
  dontHaveAnAccount: {
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray_100,
  },
  signUp: {
    color: Color.colorDodgerblue_100,
  },
  text: {
    fontSize: FontSize.size_sm,
    textAlign: "center",
  },
  dontHaveAnContainer: {
    left: 31,
  },
  groupContainer: {
    height: "13.87%",
    top: "46.77%",
    bottom: "39.35%",
  },
  topParent: {
    left: 30,
    height: 620,
    width: 300,
  },
  signIn: {
    flex: 1,
    height: 800,
    overflow: "hidden",
    width: "100%",
    backgroundColor: Color.colorWhite,
  },
});

export default SignIn;
