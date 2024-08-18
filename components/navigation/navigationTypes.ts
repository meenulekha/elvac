import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  initial: undefined;
  signin: undefined;
  signup: undefined;
  "(tabs)": undefined;
  bookAppointment: undefined;
  bookingPage: { vaccineName: string };
};


export type BookingPageRouteProp = RouteProp<RootStackParamList, 'bookingPage'>;

export type NavigationProps = StackNavigationProp<RootStackParamList>;
