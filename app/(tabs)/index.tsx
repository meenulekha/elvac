import * as React from "react";
import { StyleSheet, View, Text, Image, FlatList, Pressable, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase, useFocusEffect } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border } from "@/components/GlobalStyles";
import { FIREBASE_AUTH } from "@/Firebase/FirebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeAppointment } from "../Data/SaveAppointment";
import { color } from "react-native-elements/dist/helpers";

const { height } = Dimensions.get('window');

interface Appointment {
  date: string;
  time: string;
  place: string;
  vaccinationShot: string;
}

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

 

  const handleLogout = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        navigation.navigate("signin");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const fetchLocalAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];
      setAppointments(appointments);
    } catch (error) {
      console.error("Error reading appointments from AsyncStorage: ", error);
    }
  };
  // React.useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
  //     if (user) {
  //       setUserEmail(user.email);
  //       fetchLocalAppointments();
  //     } else {
  //       setUserEmail(null);
  //     }
  //   });

  //   return unsubscribe;
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
          setUserEmail(user.email);
          fetchLocalAppointments();
        } else {
          setUserEmail(null);
        }
      });

      // Return unsubscribe function to clean up the listener when the screen loses focus
      return unsubscribe;
    }, []) // Empty dependency array to ensure this only runs when the screen is focused
  );

  //appointments.filter(appointment => appointment.vaccinationShot === type).length;

  const InlfuenzaNumber = appointments.filter(appointment => appointment.vaccinationShot === "Influenza").length;
  const PneumococcalNumber = appointments.filter(appointment => (appointment.vaccinationShot === "PCV13" ||appointment.vaccinationShot === "PPSV23" )).length;

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentContainer}>
      <Text style={styles.appointmentDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.appointmentEvent}>{item.vaccinationShot}</Text>
      <Text style={styles.appointmentTime}>{item.time}</Text>
      <Pressable onPress={() => handleDeleteAppointment(item)}>
        <Text style={styles.deleteText}>Cancel</Text>
      </Pressable>
    </View>
  );
  const username = userEmail?.split('@', 1)[0]

  //deleteing appointments
  // const handleDeleteAppointment = (appointment: Appointment) => {
  //   removeAppointment(appointment);
  // };
  const handleDeleteAppointment = async (appointment: Appointment) => {
    await removeAppointment(appointment, (updatedAppointments: Appointment[]) => {
      setAppointments(updatedAppointments);
    });
  };

  return (
    <View style={styles.home}>
      <View style={[styles.roundedRectangle, styles.roundedBorder]} />
      <View style={styles.headerContainer}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
        <Image
            style={styles.logo}
            source={require("../../assets/images/logo.png")}
          />
        <Text style={styles.welcome}>Welcome!</Text>
        <Text style={styles.userName}>{username || "User"}</Text>
        
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.upcomingEvents}>Upcoming events</Text>
        <View style={styles.eventDetails}>
          <Text style={styles.eventDetailText}>Date</Text>
          <Text style={styles.eventDetailText}>Vaccine</Text>
          <Text style={styles.eventDetailText}>Time</Text>
        </View>
        {appointments.length > 0 ? (
          <FlatList
            data={appointments}
            renderItem={renderAppointment}
            keyExtractor={(item, index) => index.toString()}
            style={styles.appointmentList}
          />
        ) : (
          <Text style={styles.noAppointmentsText}>No upcoming appointments.</Text>
        )}
      </View>

      <View style={styles.shotsContainer}>
        <View style={styles.shotBox}>
          <Image
            style={styles.shotIcon}
            source={require("../../assets/chill-1.png")} // Update with the correct path to the influenza icon
          />
          <Text style={styles.shotText}>Influenza shots</Text>
          <Text style={styles.shotCount}>{InlfuenzaNumber}</Text>
        </View>
        <View style={styles.shotBox}>
          <Image
            style={styles.shotIcon}
            source={require("../../assets/breathing-1.png")}// Update with the correct path to the pneumococcal icon
          />
          <Text style={styles.shotText}>Pneumococcal shots</Text>
          <Text style={styles.shotCount}>{PneumococcalNumber}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  roundedRectangle: {
    top: "46.38%",
    right: "8.61%",
    bottom: "46.63%",
    left: "8.06%",
    backgroundColor: Color.colorWhitesmoke,
    borderColor: "rgba(156, 60, 60, 0.1)",
    borderRadius: Border.br_7xs,
    width: "83.33%",
    height: "7%",
    borderStyle: "solid",
  },
  roundedBorder: {
    borderWidth: 1,
    borderStyle: "solid",
    position: "absolute",
  },
  logo: {
    width: 80, // Make the logo smaller
    height: 80, // Make the logo smaller
    marginBottom: 10,
    position: "absolute",
    top: 50, // Position the logo at the top
  },
  roundedRectangle1: {
    top: "38%",
    right: "7.5%",
    bottom: "55%",
    left: "9.17%",
    backgroundColor: "#c2d8fb",
    borderColor: Color.colorGray_400,
    borderRadius: Border.br_7xs,
    width: "83.33%",
    height: "7%",
    borderStyle: "solid",
  },
  appointmentList: {
    height: height*0.15,
    marginTop: 10,
  },
  groupPosition: {
    width: 360,
    left: 0,
    position: "absolute",
  },
  groupChild: {
    top: 274,
    height: 424,
  },
  home: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  headerContainer: {
    height: height * 0.35,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#e0f7fa", // Adjust color as needed
    position: "relative"
  },
  welcome: {
    paddingTop: 110,
    fontSize: 35,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorBlack,
  },
  deleteText: {
    paddingTop: 2.5,
    fontSize: 11,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorRosybrown,
  },
  userName: {
    fontSize: 17,
    paddingBottom:10,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray_100,
  },
  eventsContainer: {
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: Border.br_7xs,
    marginHorizontal: 20,
    marginTop: -30,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  upcomingEvents: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorBlack,
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#bbdefb",
    paddingVertical: 10,
    borderRadius: Border.br_7xs,
  },
  eventDetails: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "flex-start",
    paddingRight:10,
    paddingLeft:15,
    marginBottom: 10,
  },
  eventDetailText: {
    flexDirection:'row',
    //justifyContent:"space-between",
    flex:1,
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorGray_100,
  },
  appointmentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  appointmentDate: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.poppinsBold,
    color: Color.colorBlack,
    flex: 2,
  },
  appointmentEvent: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray_100,
    textAlign: 'center',
    flex:1, // Flex value to manage space distribution
  },
  appointmentTime: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray_100,
    flex: 2, // Flex value to manage space distribution
    textAlign: 'center', // Align the time to the right
  },
  noAppointmentsText: {
    textAlign: "center",
    color: Color.colorBlack,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.poppinsRegular,
  },
  shotsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 20,
  },
  shotBox: {
    alignItems: "center",
    backgroundColor: "#f8bbd0", // Adjust the background color as needed
    borderRadius: Border.br_7xs,
    //padding: 20,
    paddingVertical: 20, // Adjust vertical padding for consistency
    paddingHorizontal: 10, 
    width: "45%",
    justifyContent: "space-between", // Center the content vertically
    flexDirection: "column", 
    height:170,
  },
  shotIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  shotText: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorBlack,
    textAlign:"center",
  },
  shotCount: {
    fontSize: FontSize.size_11xl,
    fontFamily: FontFamily.poppinsBold,
    color: Color.colorBlack,
    textAlign:"center",
    marginBottom:10,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    top: 20,
    //transform: [{ translateX: "-50%" }],
    padding: 15,
    width: 100,
    height: 10,
    backgroundColor: Color.colorDodgerblue_200,
    borderRadius: Border.br_7xs,
    justifyContent:"center"
  },
  logoutText: {
    color: Color.colorDimgray,
    fontSize: 12,
    textAlign: 'center',
    fontFamily:FontFamily.poppinsSemiBold,
    position: 'absolute',
    top: 5,
    left: 30,
    bottom: 4,
    justifyContent:"center",

  },
});

export default Home;
