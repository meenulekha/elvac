import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Linking } from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format, differenceInYears, differenceInDays } from 'date-fns';

const BookAppointment = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [eligibility, setEligibility] = React.useState({
    influenza: true,
    pneumococcal1: true,
    pneumococcal2: true,
  });

  // React.useEffect(() => {
  //   const checkEligibility = async () => {
  //     try {
  //       const storedUserInfo = await AsyncStorage.getItem('userInfo');
  //       if (storedUserInfo) {
  //         const userInfo = JSON.parse(storedUserInfo);
  //         let influenzaEligible = true;
  //         let pneumococcal1Eligible = true;
  //         let pneumococcal2Eligible = true;

  //         const today = new Date();

  //         // Check for influenza eligibility
  //         if (userInfo.influenzaDoses.length > 0) {
  //           const lastInfluenzaDose = new Date(userInfo.influenzaDoses[userInfo.influenzaDoses.length - 1].date);
  //           if (differenceInDays(today, lastInfluenzaDose) < 365) {
  //             influenzaEligible = false;
  //           }
  //         }
  //         const pneumococcalDosesTaken = userInfo.pneumococcalDoses.length;

  //         // Check for pneumococcal eligibility
  //         if (pneumococcalDosesTaken >= 1) {
  //           pneumococcal1Eligible = false; // First dose has been taken
  //           pneumococcal2Eligible = true;
  //         }
  //         if (pneumococcalDosesTaken >= 2) {
  //           pneumococcal1Eligible = false;
  //           pneumococcal2Eligible = false; // Both doses have been taken
  //         }

  //         // Set the eligibility state
  //         setEligibility({
  //           influenza: influenzaEligible,
  //           pneumococcal1: pneumococcal1Eligible,
  //           pneumococcal2: pneumococcal2Eligible,
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error checking eligibility:', error);
  //     }
  //   };

  //   checkEligibility();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkEligibility = async () => {
        try {
          const storedUserInfo = await AsyncStorage.getItem('userInfo');
          if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo);
            let influenzaEligible = true;
            let pneumococcal1Eligible = true;
            let pneumococcal2Eligible = true;

            const today = new Date();

            // Check for influenza eligibility
            if (userInfo.influenzaDoses.length > 0) {
              const lastInfluenzaDose = new Date(userInfo.influenzaDoses[userInfo.influenzaDoses.length - 1].date);
              if (differenceInDays(today, lastInfluenzaDose) < 365) {
                influenzaEligible = false;
              }
            }
            const pneumococcalDosesTaken = userInfo.pneumococcalDoses.length;

            // Check for pneumococcal eligibility
            if (pneumococcalDosesTaken >= 1) {
              pneumococcal1Eligible = false; // First dose has been taken
              pneumococcal2Eligible = true;
            }
            if (pneumococcalDosesTaken >= 2) {
              pneumococcal1Eligible = false;
              pneumococcal2Eligible = false; // Both doses have been taken
            }

            // Set the eligibility state
            setEligibility({
              influenza: influenzaEligible,
              pneumococcal1: pneumococcal1Eligible,
              pneumococcal2: pneumococcal2Eligible,
            });
          }
        } catch (error) {
          console.error('Error checking eligibility:', error);
        }
      };

      checkEligibility();
    }, [])
  );

  const vaccines = [
    {
      name: 'Influenza',
      info: 'Taken once a year',
      icon: require("../../assets/influenza-1.png"),
      eligibility: eligibility.influenza,
      url:'https://www.healthhub.sg/a-z/medications/influenza-vaccine'
    },
    {
      name: 'Pneumococcal 1',
      info: 'Taken once in a lifetime',
      icon: require("../../assets/hand-1.png"),
      eligibility: eligibility.pneumococcal1,
      url: 'https://www.healthhub.sg/a-z/medications/pneumococcal-vaccine'
    },
    {
      name: 'Pneumococcal 2',
      info: 'Taken once in a lifetime',
      icon: require("../../assets/hand-1.png"),
      eligibility: eligibility.pneumococcal2,
      url:'https://www.healthhub.sg/a-z/medications/pneumococcal-vaccine'
    },
  ];

  const handlePress = (vaccine: { name?: string; info?: string; icon?: any; eligibility: any; }) => {
    if (vaccine.eligibility) {
      let vaccineType = vaccine.name; // Default to the name in the vaccines array

    // Map the name to specific vaccine types
      if (vaccine.name === 'Pneumococcal 1') {
        vaccineType = 'PCV13';
      } else if (vaccine.name === 'Pneumococcal 2') {
        vaccineType = 'PPSV23';
    }
      navigation.navigate("bookingPage",{
        vaccinationShot: vaccineType, // Pass the vaccine name as a parameter
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.vaccinations}>Vaccinations</Text>
      {vaccines.map((vaccine, index) => (
        <Pressable
          key={index}
          style={[styles.vaccineContainer, !vaccine.eligibility && styles.disabled]}
          onPress={() => handlePress(vaccine)}
          disabled={!vaccine.eligibility}
        >
          <Image style={styles.icon} source={vaccine.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.vaccineName}>{vaccine.name}</Text>
            <Text style={styles.vaccineInfo}>{vaccine.info}</Text>
            <Text style={vaccine.eligibility ? styles.eligibility : styles.notEligible}>
              {vaccine.eligibility ? 'You are eligible to take this' : 'You are not eligible to take this'}
            </Text>
            <Pressable onPress={() => Linking.openURL(vaccine.url)}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </Pressable>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    top: 80,
  },
  vaccinations: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  vaccineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  vaccineInfo: {
    fontSize: 14,
    color: '#666',
  },
  eligibility: {
    fontSize: 14,
    color: '#4caf50',
  },
  notEligible: {
    fontSize: 14,
    color: '#f44336',
  },
  disabled: {
    opacity: 0.6,
  },
  learnMoreText: {
    color: '#1E90FF', // A blue color to indicate a link
    textDecorationLine: 'underline', // Underline to indicate it's a link
    marginTop: 5, // Space above the link
    fontSize: 14, // Adjust the size as needed
  },
});

export default BookAppointment;
