import firebase from "../firebase/clientApp";

export type Building = {
  id: string;
  createdAt: firebase.firestore.FieldValue;
  name: string;
  address: string;
  municipality: string;
  zipCode: number;
  active?: boolean;
};

export type Assignment = {
  id: string;
  createdAt: firebase.firestore.FieldValue;
  creator: string;
  title?: string;
  about?: string;
  place?: string;
  imageUrl?: string;
  done?: boolean;
};
