import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';


import { format, addDays, isWeekend } from 'date-fns';

import { getAuth } from '@firebase/auth'; // Import getAuth for Firebase Authentication

//import saveAppointment from '../Firebase/SaveAppointment'; // Import saveAppointment function
import saveAppointment, {Appointment} from './Data/SaveAppointment';
import { Color } from '@/GlobalStyles';

const getNextWeekdays = () => {
  const weekdays = [];
  let currentDate = new Date();

  while (weekdays.length < 5) {
    currentDate = addDays(currentDate, 1);
    if (!isWeekend(currentDate)) {
      weekdays.push(currentDate);
    }
  }

  return weekdays;
};

const BookingScreen = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);  // <--- Add this line
  const [appointments, setAppointments] = useState<Appointment[]>([]); // Maintain state for appointments
  const nextWeekdays = getNextWeekdays();
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const route = useRoute();
  const { vaccinationShot } = route.params as { vaccinationShot: string }; // Get the vaccine type from navigation params


  const slots = [
    '08:30 AM', '09:00 AM', '09:30 AM',
    '10:00 AM', '11:30 AM', '12:00 PM',
    '12:30 PM', '01:30 PM'
  ];

  console.log("Component Rendered");


  const handleSlotPress = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleBookPress = async () => {
    if (!selectedSlot || !selectedDate) {
      Alert.alert("Error", "Please select a date and time slot.");
      return;
    }
  
    const appointment: Appointment = {
      date: selectedDate.toISOString(), // Save date as string
      time: selectedSlot,
      place: 'Finest Health Medical Centre',
      vaccinationShot: vaccinationShot
    };
  
    try {
      await saveAppointment(appointment, (updatedAppointments:Appointment[]) => {
        setAppointments(updatedAppointments); // Update state with the new appointments list
        // Alert.alert("Success", "Appointment booked successfully!");
      });
      Alert.alert("Success", "Appointment booked successfully!");
      navigation.navigate("index")
    } catch (error) {
      Alert.alert("Error", "Failed to book appointment.");
      console.error("Error booking appointment: ", error);
    }
  };
  return (
    <ScrollView style={styles.safeArea}>
      <Text style={styles.title}>Book your Influenza shot</Text>
      <View style={styles.medicalCentreInfo}>
        <Text style={styles.centreName}>Finest Health Medical Centre</Text>
        <Text style={styles.address}>19 Lorong 7 Toa Payoh, #01-268 Kim Keat Palm, Singapore 310019</Text>
        <Text style={styles.distance}>800m away</Text>
        <Text style={styles.phone}>+ 65 6264 0852</Text>
        <Text style={styles.hours}>Opening Hours</Text>
        <Text style={styles.hoursDetail}>Weekdays: 8 AM-2 PM</Text>
        <Text style={styles.hoursDetail}>Saturday: 9 AM-1 PM</Text>
      </View>
      <Pressable style={styles.calendarIcon} onPress={showDatePicker}>
        <Text style={styles.datePickerText}>Select Date</Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDate || new Date()}
      />
      <Text style={styles.selectedDateText}>Selected Date: {selectedDate ? format(selectedDate, 'PPP') : 'None'}</Text>

      <View style={styles.datePicker}>
        {nextWeekdays.map((date, index) => (
          <Pressable
            key={index}
            style={[styles.dateButton, selectedDate && format(selectedDate, 'PPP') === format(date, 'PPP') ? styles.selectedDate : undefined]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={styles.dateText}>{format(date, 'EEE dd')}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.slotsContainer}>
        {slots.map((slot: any, index: any) => (
          <Pressable
            key={index}
            style={[styles.slotButton, selectedSlot === slot && styles.selectedSlot]}
            onPress={() => handleSlotPress(slot)}
          >
            <Text style={styles.slotText}>{slot}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Appointment Summary</Text>
        <Text style={styles.summaryDetail}>Location: Finest Health Medical Centre</Text>
        <Text style={styles.summaryDetail}>Vaccine: Influenza</Text>
        <Text style={styles.summaryDetail}>Date: {selectedDate ? format(selectedDate, "PPP") : "N/A"}</Text>
        <Text style={styles.summaryDetail}>Time: {selectedSlot || "N/A"}</Text>
      </View>

      <Pressable style={styles.bookButton}  onPress={handleBookPress}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    paddingTop:40,
    paddingBottom:20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor:'#e0f7fa',
  },
  medicalCentreInfo: {
    marginBottom: 16,
    paddingHorizontal:20,
  },
  centreName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarIcon: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginBottom: 10,
    marginLeft:20,

  },
  datePickerText: {
    color: '#fff',
    fontSize: 14,
    //paddingLeft:20,
    justifyContent:"center"
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  hours: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  hoursDetail: {
    fontSize: 14,
    color: '#666',
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal:20,
    paddingLeft:20,

  },
  dateButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  dateText: {
    fontSize: 14,
  },
  selectedDate: {
    backgroundColor: '#007bff',
    paddingHorizontal:20,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal:20,
  },
  slotButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    width: '48%',
    alignItems: 'center',
    paddingHorizontal:20,
  },
  selectedSlot: {
    backgroundColor: '#007bff',
    paddingHorizontal:20,
  },
  slotText: {
    fontSize: 14,
  },
  summary: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal:20,
    marginBottom: 8,
  },
  summaryDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    paddingHorizontal:20,
  },
  bookButton: {
    padding: 16,
    borderRadius: 0,
    backgroundColor: '#007bff',
    alignItems: 'center',
    paddingHorizontal:20,

  },
  bookButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal:40,
  },
  selectedDateText: {
    marginLeft: 16, // Add margin to the left
    marginRight: 16, // Add margin to the right to prevent it from being too close to the edge
    marginTop: 10, // Add margin to the top for spacing above
    marginBottom: 10, // Add margin to the bottom for spacing below
    fontSize: 16, // Adjust font size as needed
    color: '#000', // Optional: Set the color of the text
},
});

export default BookingScreen;
