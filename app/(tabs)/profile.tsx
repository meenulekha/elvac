import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp, ParamListBase } from "@react-navigation/native";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/Firebase/FirebaseConfig";
import { get, set, ref } from "firebase/database";
import { CheckBox } from "react-native-elements";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Color } from "@/components/GlobalStyles";
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const conditionsList = [
  "Asthma",
  "Diabetes",
  "Heart Disease",
  "Chronic Lung Disease",
];

const allergiesList = [
  "Penicillin",
  "Sulfa Drugs",
  "Aspirin",
  "None",
];

interface Dose {
  date: Date | undefined;
  remarks?: string;
}

const Profile = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [userInfo, setUserInfo] = useState({
    name: "",
    age: "",
    existingConditions: [] as string[],
    drugAllergies: [] as string[],
    pneumococcalDoses: [] as Dose[],
    influenzaDoses: [] as Dose[],
    isPneumococcalGiven: false,
    isInfluenzaGiven: false,
  });
  // const [isPneumococcalDatePickerVisible, setPneumococcalDatePickerVisible] = useState<{ [key: number]: boolean }>({});
  // const [isInfluenzaDatePickerVisible, setInfluenzaDatePickerVisible] = useState<{ [key: number]: boolean }>({});
  // const [isNewDoseDatePickerVisible, setNewDoseDatePickerVisible] = useState<{ vaccineType: 'pneumococcal' | 'influenza'; index: number; visible: boolean } | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDose, setSelectedDose] = useState<{ vaccineType: 'pneumococcal' | 'influenza'; index: number } | null>(null);

  const userId = FIREBASE_AUTH.currentUser?.uid;
  //firebase
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (userId) {
  //       const userRef = ref(FIREBASE_DB, "users" + userId);
  //       const snapshot = await get(userRef);
  //       if (snapshot.exists()) {
  //         setUserInfo(snapshot.val());
  //       }
  //     }
  //   };
  //   fetchUserData();
  // }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }
      } catch (error) {
        console.error("Error fetching user data from AsyncStorage:", error);
      }
    };
    fetchUserData();
  }, []);


  const handleSave = async () => {
    // if (userId) {
    //   const userRef = ref(FIREBASE_DB, `users/${userId}`);
    //   console.log("userRef:", userRef); // Log userRef
    //   console.log("userInfo:", userInfo); // Log userInfo
    //   set(userRef, { ...userInfo })
    //   .catch((error) => {
    //     console.error("Error saving user data: ", error);})
      
    //   console.log("User data saved successfully!");
    
    // } else {
    //   console.error("No user ID found. User might not be logged in.");
    // }
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log("User data saved to AsyncStorage successfully!");

      navigation.navigate("bookAppointment");
    } catch (error) {
      console.error("Error saving user data to AsyncStorage: ", error);
    }
  };
  

  const handleConditionChange = (condition: string) => {
    setUserInfo(prevState => ({
      ...prevState,
      existingConditions: prevState.existingConditions.includes(condition)
        ? prevState.existingConditions.filter(c => c !== condition)
        : [...prevState.existingConditions, condition],
    }));
  };

  const handleAllergyChange = (allergy: string) => {
    setUserInfo(prevState => ({
      ...prevState,
      drugAllergies: prevState.drugAllergies.includes(allergy)
        ? prevState.drugAllergies.filter(a => a !== allergy)
        : [...prevState.drugAllergies, allergy],
    }));
  };

  const handleDoseChange = (vaccineType: 'pneumococcal' | 'influenza', index: number, dose: Dose) => {
    const key = vaccineType === 'pneumococcal' ? 'pneumococcalDoses' : 'influenzaDoses';
    setUserInfo(prevState => {
      const doses = [...prevState[key]];
      doses[index] = { ...dose };
      return { ...prevState, [key]: doses };
    });
  };



  // const addDose = (vaccineType: 'pneumococcal' | 'influenza') => {
  //   const key = vaccineType === 'pneumococcal' ? 'pneumococcalDoses' : 'influenzaDoses';
  //   setUserInfo(prevState => {
  //     const newDoses = [...prevState[key], { date: null, remarks: '' }];
  //     setNewDoseDatePickerVisible({ vaccineType, index: newDoses.length - 1, visible: true });
  //     return { ...prevState, [key]: newDoses };
  //   });
  // };
  

  const showDatePicker = (vaccineType: 'pneumococcal' | 'influenza', index: number) => {
  const key = vaccineType === 'pneumococcal' ? 'pneumococcalDoses' : 'influenzaDoses';
  if (userInfo[key] && userInfo[key][index]) {
    setSelectedDose({ vaccineType, index });
    setSelectedDate(userInfo[key][index].date || new Date());
    setDatePickerVisible(true);
  }
  };

  const handleConfirm = (date: Date) => {
    if (selectedDose) {
      handleDoseChange(
        selectedDose.vaccineType,
        selectedDose.index,
        { date, remarks: userInfo[selectedDose.vaccineType === 'pneumococcal' ? 'pneumococcalDoses' : 'influenzaDoses'][selectedDose.index].remarks }
      );
    }
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    setSelectedDose(null);
  };

  const addDose = (vaccineType: 'pneumococcal' | 'influenza') => {
    const key = vaccineType === 'pneumococcal' ? 'pneumococcalDoses' : 'influenzaDoses';
    setUserInfo(prevState => {
      const newDoses = [...prevState[key], { date: null, remarks: '' }];
      return { ...prevState, [key]: newDoses };
    });
    showDatePicker(vaccineType, userInfo[key].length); // Show date picker for the newly added dose
  };
  

  const removeDose = (vaccineType: 'pneumococcal' | 'influenza', index: number) => {
    const key = vaccineType === 'pneumococcal' ? 'pneumococcalDoses' : 'influenzaDoses';
    setUserInfo(prevState => {
      const doses = [...prevState[key]];
      doses.splice(index, 1);
      return { ...prevState, [key]: doses };
    });
  };

  const pneumococcalDoseCount = userInfo.pneumococcalDoses.length;
  const influenzaDoseCount = userInfo.influenzaDoses.length;

  return (
    <ScrollView style={styles.profile}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={userInfo.name}
          onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          keyboardType="numeric"
          value={userInfo.age}
          onChangeText={(text) => setUserInfo({ ...userInfo, age: text })}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Existing Conditions</Text>
        {conditionsList.map((condition, index) => (
          <View key={index} style={styles.checkboxContainer}>
            <CheckBox
              checked={userInfo.existingConditions.includes(condition)}
              onPress={() => handleConditionChange(condition)}
            />
            <Text style={styles.checkboxLabel}>{condition}</Text>
          </View>
        ))}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Drug Allergies</Text>
        {allergiesList.map((allergy, index) => (
          <View key={index} style={styles.checkboxContainer}>
            <CheckBox
              checked={userInfo.drugAllergies.includes(allergy)}
              onPress={() => handleAllergyChange(allergy)}
            />
            <Text style={styles.checkboxLabel}>{allergy}</Text>
          </View>
        ))}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Vaccination Records</Text>
        <View style={styles.vaccineGroup}>
          <Text style={styles.countLabel}>Pneumococcal Doses: {pneumococcalDoseCount}</Text>
          <Text style={styles.vaccineLabel}>Pneumococcal Vaccine</Text>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={userInfo.isPneumococcalGiven}
              onPress={() => setUserInfo(prevState => ({ ...prevState, isPneumococcalGiven: !prevState.isPneumococcalGiven }))}
            />
            <Text style={styles.checkboxLabel}>Given</Text>
          </View>
          {userInfo.isPneumococcalGiven && userInfo.pneumococcalDoses.map((dose, index) => (
            <View key={index} style={styles.doseContainer}>
              <View style={styles.doseContent}>
                <Text style={styles.doseLabel}>Dose {index + 1}</Text>
                <Pressable
                  //onPress={() => setPneumococcalDatePickerVisible(prev => ({ ...prev, [index]: true }))}
                  onPress={() => showDatePicker('pneumococcal', index)}
                >
                  {/* //<Text>{dose.date ? dose.date.toDateString() : 'Select Date'}</Text> */}
                  <Text>{dose.date ? new Date(dose.date).toDateString() : 'Select Date'}</Text>

                </Pressable>
                {/* {isPneumococcalDatePickerVisible[index] && (
                  <DateTimePicker
                    value={dose.date || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event: any, selectedDate?: Date) => {
                      const currentDate = selectedDate || dose.date || new Date();
                      handleDoseChange('pneumococcal', index, { date: currentDate, remarks: dose.remarks });
                      setPneumococcalDatePickerVisible(prev => ({ ...prev, [index]: false }));
                    }}
                  />
                )} */}
              </View>
              <TextInput
                style={styles.remarksInput}
                placeholder="Remarks"
                value={dose.remarks}
                onChangeText={(text) => handleDoseChange('pneumococcal', index, { ...dose, remarks: text })}
              />
              <View style={styles.removeButtonContainer}>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeDose('pneumococcal', index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          ))}
          <Pressable
            style={styles.addButton}
            onPress={() => addDose('pneumococcal')}
            disabled={!userInfo.isPneumococcalGiven}
          >
            <Text style={styles.addButtonText}>Add Dose</Text>
          </Pressable>
        </View>
        <Text style={styles.countLabel}>Influenza Doses: {influenzaDoseCount}</Text>
        <View style={styles.vaccineGroup}>
          <Text style={styles.vaccineLabel}>Influenza Vaccine</Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={userInfo.isInfluenzaGiven}
              onPress={() => setUserInfo(prevState => ({ ...prevState, isInfluenzaGiven: !prevState.isInfluenzaGiven }))}
            />
            <Text style={styles.checkboxLabel}>Given</Text>
          </View>
          {userInfo.isInfluenzaGiven && userInfo.influenzaDoses.map((dose, index) => (
            <View key={index} style={styles.doseContainer}>
              <View style={styles.doseContent}>

                <Text style={styles.doseLabel}>Dose {index +1}</Text>
                <Pressable
                  //onPress={() => setInfluenzaDatePickerVisible(prev => ({ ...prev, [index]: true }))}
                  onPress={() => showDatePicker('influenza', index)}
                >
                  {/* <Text>{dose.date ? dose.date.toDateString() : 'Select Date'}</Text> */}
                  <Text>{dose.date ? new Date(dose.date).toDateString() : 'Select Date'}</Text>

                </Pressable>
                {/* {isInfluenzaDatePickerVisible[index] && (
                  <DateTimePicker
                    value={dose.date || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event: any, selectedDate?: Date) => {
                      const currentDate = selectedDate || dose.date || new Date();
                      handleDoseChange('influenza', index, { date: currentDate, remarks: dose.remarks });
                      setInfluenzaDatePickerVisible(prev => ({ ...prev, [index]: false }));
                    }}
                  />
                )} */}
              </View>
              <TextInput
                style={styles.remarksInput}
                placeholder="Remarks"
                value={dose.remarks}
                onChangeText={(text) => handleDoseChange('influenza', index, { ...dose, remarks: text })}
              />
              <View style={styles.removeButtonContainer}>

                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeDose('influenza', index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          ))}
          <Pressable
            style={styles.addButton}
            onPress={() => addDose('influenza')}
            disabled={!userInfo.isInfluenzaGiven}
          >
            <Text style={styles.addButtonText}>Add Dose</Text>
          </Pressable>
        </View>
      </View>
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
      {/* {isNewDoseDatePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event: any, selectedDate?: Date | undefined) => {
            if (isNewDoseDatePickerVisible) {
              const { vaccineType, index } = isNewDoseDatePickerVisible;
              const remarks = userInfo[vaccineType === 'pneumococcal' ? 'pneumococcalDoses' : 'influenzaDoses'][index].remarks;
              handleDoseChange(vaccineType, index, { date: selectedDate, remarks });
              setNewDoseDatePickerVisible(null);
            }
          }}
        />
      )} */}
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDate || new Date()}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profile: {
    padding: 20,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  vaccineGroup: {
    marginBottom: 20,
  },
  vaccineLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  doseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: 'relative',
  },
  doseLabel: {
    marginRight: 10,
  },
  doseContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: Color.colorDarkgray,
    padding: 5,
    borderRadius: 5,
    marginLeft: 15,
    right: 0,
    top: 0,
  },
  removeButtonText: {
    color: "white",
  },
  saveButton: {
    backgroundColor: Color.colorDarkgray,
    padding: 10,
    borderRadius: 2,
    alignItems: "center",
    marginTop: -10,
    bottom: 15,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  remarksInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    right: -10,
  },
  removeButtonContainer: {
    alignSelf: "auto",
    marginTop: 10,
  },
  countLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },

});

export default Profile;
