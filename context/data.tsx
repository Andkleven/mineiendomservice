import {
  useReducer,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import firebase from "../firebase/clientApp";
import { getCard } from "../fetchData/getCardData";

type Fields = {
  id: string;
  done?: boolean;
  imageUrl?: string;
  title?: string;
  about?: string;
  time?: firebase.firestore.FieldValue;
};

type Data = (Fields | undefined)[];
const DataContext = createContext<{
  data: Data;
  dispatchData: any;
} | null>(null);

type Action =
  | { id: string; type: "delete" }
  | { id: string; type: "update"; fields: Fields }
  | { type: "add"; fields: Fields }
  | { type: "setNewState"; newState: Data };

async function reducer(state: Data, action: Action): Promise<Data> {
  let index: number;
  switch (action.type) {
    case "add":
      await firebase
        .firestore()
        .collection("card")
        .add(action.fields)
        .then((doc) => {
          state.push({ id: doc.id, ...action.fields });
          console.log(state);
          return state;
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    case "update":
      index = state.findIndex((x) => x.id === action.id);
      await firebase
        .firestore()
        .collection("card")
        .doc(action.id)
        .set(action.fields, { merge: true })
        .then(() => {
          state.splice(index, 0, {
            ...state[index],
            ...action.fields,
          });
          return state;
        })
        .catch((error) => {
          console.error(error);
        });
      break;
    case "delete":
      index = state.findIndex((x) => x.id === action.id);
      console.log(index);
      await firebase
        .firestore()
        .collection("card")
        .doc(action.id)
        .delete()
        .then(() => {
          state.splice(index, 1);
          return state;
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
      break;
    case "setNewState":
      return action.newState;
    default:
      throw new Error();
  }
}

export default function DataProvider({ children }: { children: ReactNode }) {
  const [data, dispatchData] = useReducer(reducer, []);
  useEffect(() => {
    async function fetchMyAPI() {
      let data = await getCard();
      dispatchData({ type: "setNewState", newState: data });
    }
    fetchMyAPI();
  }, [getCard, dispatchData]);
  return (
    <DataContext.Provider value={{ data, dispatchData }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
