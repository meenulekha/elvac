// saveAppointment.ts
import { db } from './FirebaseConfig';
import { doc, collection, setDoc, serverTimestamp } from 'firebase/firestore';

interface Appointment {
  date: Date;
  time: string;
  place: string;
  vaccinationShot: string;
}

const saveAppointment = async (userId: string, appointment: Appointment): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const appointmentRef = doc(collection(userRef, 'appointments'));
    
    await setDoc(appointmentRef, {
      ...appointment,
      createdAt: serverTimestamp()
    });

    console.log("Appointment saved successfully!");
  } catch (error) {
    console.error("Error saving appointment: ", error);
  }
};

export default saveAppointment;
