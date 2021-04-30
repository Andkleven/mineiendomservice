import firebase from "../firebase/clientApp";

export const getCard = async () => {
  const data = [];
  await firebase
    .firestore()
    .collection("card")
    .orderBy("time")
    .limit(5)
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
    })
    .catch((e) => {
      console.log(e);
    });
  return data;
};
