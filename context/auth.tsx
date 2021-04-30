import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import Router from "next/router";
import firebase from "../firebase/clientApp";

type User = {
  uid: string;
  email: string;
  name: string;
  provider: string;
  photoUrl: string;
  token: string;
  expirationTime: string;
};

type EmailAndPassword = {
  redirect: string;
  email: string;
  password: string;
};

type Context = {
  user: null | User;
  loading: boolean;
  signInWithGoogle: (redirect: string) => Promise<void>;
  signInWithEmailAndPassword: ({
    redirect,
    email,
    password,
  }: EmailAndPassword) => Promise<void>;
  signUpWithEmailAndPassword: ({
    redirect,
    email,
    password,
  }: EmailAndPassword) => Promise<void>;
  signOut: () => Promise<false | User>;
  getFreshToken: () => Promise<string>;
};

const AuthContext = createContext<Context | null>(null);
export default function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

function useFirebaseAuth(): Context {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      const { token, ...userWithoutToken } = user;
      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set({ uid: user.uid, ...userWithoutToken }, { merge: true });
      setUser(user);

      setLoading(false);
      return user;
    } else {
      console.log(23);
      if (!["/signUp", "/login"].includes(Router.asPath)) {
        Router.push("/login");
      }
      setUser(false);
      setLoading(false);
      return false;
    }
  };

  const signInWithGoogle = (redirect: string) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user);
        if (redirect) {
          Router.push(redirect);
        }
      });
  };

  const signInWithEmailAndPassword = ({
    redirect,
    email,
    password,
  }: EmailAndPassword) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        handleUser(response.user);
        if (redirect) {
          Router.push(redirect);
        }
      });
  };

  const signUpWithEmailAndPassword = ({
    redirect,
    email,
    password,
  }: EmailAndPassword) => {
    setLoading(true);
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        handleUser(response.user);
        if (redirect) {
          Router.push(redirect);
        }
      });
  };

  const signOut = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser);
    return () => unsubscribe();
  }, []);

  const getFreshToken = async () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(false);
      return `${token}`;
    } else {
      return "";
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    signOut,
    getFreshToken,
  };
}
const formatUser = async (user: {
  getIdTokenResult: (arg0: boolean) => any;
  uid: any;
  email: any;
  displayName: any;
  providerData: { providerId: any }[];
  photoURL: any;
}): Promise<User> => {
  // const token = await user.getIdToken(/* forceRefresh */ true);
  const decodedToken = await user.getIdTokenResult(/*forceRefresh*/ true);
  const { token, expirationTime } = decodedToken;
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    token,
    expirationTime,
    // stripeRole: await getStripeRole(),
  };
};
