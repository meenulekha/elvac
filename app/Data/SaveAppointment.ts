import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Appointment {
  date: string;
  time: string;
  place: string;
  vaccinationShot: string;
}

const saveAppointment = async (
  appointment: Appointment, 
  callback: (appointments: Appointment[]) => void = () => {} // Callback to update the state
): Promise<void> => {
  try {
    //const existingAppointments = await AsyncStorage.getItem('appointments');
    const existingAppointments = await AsyncStorage.getItem('appointments');
    let appointments: Appointment[] = existingAppointments ? JSON.parse(existingAppointments) : [];

    appointments.push(appointment);

    await AsyncStorage.setItem('appointments', JSON.stringify(appointments));
    callback(appointments);
    console.log('Appointment saved successfully');
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw error;
  }
};

export const removeAppointment = async (appointmentToRemove: Appointment, 
  callback: (appointments: Appointment[]) => void= () => {} // Callback to update the state
): Promise<void> => {
  try {
    const existingAppointments = await AsyncStorage.getItem('appointments');
    let appointments: Appointment[] = existingAppointments ? JSON.parse(existingAppointments) : [];

    // Filter out the appointment you want to remove
    const updatedAppointments = appointments.filter(appointment => 
      appointment.date !== appointmentToRemove.date || 
      appointment.time !== appointmentToRemove.time ||
      appointment.place !== appointmentToRemove.place ||
      appointment.vaccinationShot !== appointmentToRemove.vaccinationShot
    );

    // Save the updated array back to AsyncStorage
    await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    callback(updatedAppointments);
    console.log('Appointment removed successfully');
  } catch (error) {
    console.error('Error removing appointment:', error);
  }
};

export default saveAppointment;
 