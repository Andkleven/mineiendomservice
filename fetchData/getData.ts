import firebase from "../firebase/clientApp";

export const assignmentRef = (buildingId: string) =>
  firebase
    .firestore()
    .collection("firm")
    .doc()
    .collection("building")
    .doc(buildingId)
    .collection("assignment");
export const assignmentQuery = (buildingId: string) =>
  assignmentRef(buildingId).orderBy("createdAt");

export const buildingRef = firebase
  .firestore()
  .collection("firm")
  .doc()
  .collection("building");
export const buildingQuery = buildingRef.orderBy("createdAt");

export const assignmentChatRef = (buildingId: string, assignmentId: string) =>
  assignmentRef(buildingId).doc(assignmentId).collection("chat");

export const assignmentChatQuery = (buildingId: string, assignmentId: string) =>
  assignmentChatRef(buildingId, assignmentId).orderBy("createdAt");

export const chatRef = (chatId: string) =>
  firebase.firestore().collection("chats").doc(chatId).collection("chat");

export const chatQuery = (chatId: string) =>
  chatRef(chatId).orderBy("createdAt");

export const chatsRef = firebase.firestore().collection("chats");
export const chatsQuery = chatsRef.orderBy("createdAt");
