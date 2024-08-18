import * as React from "react";
import { Text, StyleSheet, View, Pressable, Image, TextInput } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border } from '@/components/GlobalStyles';
import { useState } from 'react';
import { FIREBASE_AUTH } from "../Firebase/FirebaseConfig"
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { CheckBox } from "react-native-elements";

const Registration = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    setLoading(true);
    try {
      if (!name || !email || !password || !isChecked) {
        alert("Please fill in all fields and agree to the terms.");
        return;
      }
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate("(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }

  }

  return (
    <View style={styles.registration}>
      <Text style={styles.signUp}>Sign Up</Text>
      <View style={styles.form}>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputBox} />
            <TextInput style={styles.inputText} placeholder="Enter your name" autoCapitalize="none" onChangeText={(text) => setName(text)}></TextInput>
            <Image
              style={styles.icon}
              source={require("../assets/icon--useroutline.png")}
            />
          </View>
          <View style={styles.inputWrapper}>
            <View style={styles.inputBox} />
            <TextInput style={styles.inputText} placeholder="Enter your email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
            <Image
              style={styles.icon}
              source={require("../assets/icon--useroutline1.png")}
            />
          </View>
          <View style={styles.inputWrapper}>
            <View style={styles.inputBox} />
            <TextInput style={styles.inputText} secureTextEntry={true} placeholder="Enter your password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>
            <Image
              style={styles.icon}
              source={require("../assets/icon--password.png")}
            />
            <Image
              style={styles.iconEye}
              source={require("../assets/icon--eye-slash.png")}
            />
          </View>
          <View style={styles.checkboxWrapper}>
            <CheckBox checked={isChecked} onPress={() => setIsChecked(!isChecked)} />
            <Text style={styles.checkboxText}>
              I agree to the healthcare <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
            </Text>

          </View>

          <Pressable
            style={[styles.button, (!name || !email || !password || !isChecked) && styles.buttonDisabled]}
            onPress={signUp}
            disabled={!name || !email || !password || !isChecked}
          >
             <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
            <Pressable
              style={styles.textButton}
              onPress={() => navigation.navigate("signin")}
            >
              <Text style={styles.signInText}>
                Have an account? <Text style={styles.signIn}>Sign In</Text>
              </Text>
            </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  registration: {
    flex: 1,
    backgroundColor: Color.colorWhite,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  signUp: {
    fontSize: FontSize.size_lg,
    fontWeight: "700",
    fontFamily: FontFamily.poppinsBold,
    textAlign: "center",
    color: Color.colorGray_100,
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  button: {
    backgroundColor: Color.colorDodgerblue_100,
    borderRadius: Border.br_13xl,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: Color.colorWhite,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
  },
  textButton: {
    marginBottom: 30,
    alignItems: "center",
  },
  signInText: {
    fontSize: FontSize.size_sm,
    color: Color.colorGray_100,
    fontFamily: FontFamily.poppinsRegular,
  },
  signIn: {
    color: Color.colorDodgerblue_100,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 15,
    position: "relative",
  },
  inputBox: {
    width: "100%",
    height: 40,
    borderRadius: Border.br_7xs,
    backgroundColor: Color.colorWhitesmoke,
    borderColor: Color.colorGray_500,
    borderWidth: 2,
  },
  inputText: {
    //position: "absolute",
    top: "-38%",
    left: "20%",
    color: Color.colorGray_300,
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.poppinsRegular,
    paddingLeft: 2,
  },
  icon: {
    position: "absolute",
    top: "18%",
    left: "5%",
    width: 20,
    height: 20,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    right: 25,
  },
  checkboxText: {
    fontSize: FontSize.size_2xs,
    color: Color.colorGray_100,
    fontFamily: FontFamily.poppinsRegular,
  },
  link: {
    color: Color.colorDodgerblue_100,
  },
  checkboxIcon: {
    marginLeft: 10,
    width: 24,
    height: 24,
  },
  iconEye: {
    position: "absolute",
    top: "25%",
    right: "5%",
    width: 20,
    height: 20,
  },
  buttonDisabled: {
    backgroundColor: Color.colorGray_300, 
  },
});

export default Registration;
