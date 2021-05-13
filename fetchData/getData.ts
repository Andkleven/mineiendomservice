import firebase from "../firebase/clientApp";

export const assignmentRef = (residentId: string) => {
  if (!residentId) return null;
  else
    return firebase
      .firestore()
      .collection("resident")
      .doc(residentId)
      .collection("assignment");
};

export const assignmentQuery = (residentId: string) =>
  assignmentRef(residentId)?.orderBy("createdAt");

export const residentRef = firebase.firestore().collection("resident");

export const residentQuery = residentRef.orderBy("createdAt");

export const assignmentChatRef = (residentId: string, assignmentId: string) =>
  assignmentRef(residentId)?.doc(assignmentId).collection("chat");

export const assignmentChatQuery = (residentId: string, assignmentId: string) =>
  assignmentChatRef(residentId, assignmentId)?.orderBy("createdAt");

export const chatRef = (chatId: string) =>
  firebase.firestore().collection("chats").doc(chatId).collection("chat");

export const chatQuery = (chatId: string) =>
  chatRef(chatId).orderBy("createdAt");

export const chatsRef = firebase.firestore().collection("chats");

export const chatsQuery = chatsRef.orderBy("createdAt");
