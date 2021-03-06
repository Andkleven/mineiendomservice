import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import Router from "next/router";
import firebase from "../firebase/clientApp";

type Claims = { admin: boolean } & (
  | { janitor: boolean; residentId?: boolean }
  | { janitor?: boolean; residentId: boolean }
);

type User = {
  uid: string;
  email: string;
  name: string;
  provider: string;
  photoUrl: string;
  token: string;
  expirationTime: string;
  claims: Claims;
  residentId?: string;
};

type EmailAndPassword = {
  redirect: string;
  email: string;
  password: string;
};

type SignUpEmailAndPassword = EmailAndPassword & {
  claims: Claims;
  residentId?: string;
};

type UpdateProfile = {
  name: string;
  photoURL?: any;
  email?: string;
  password?: string;
};

type Context = {
  user: null | User;
  loading: boolean;
  signInWithEmailAndPassword: ({
    redirect,
    email,
    password,
  }: EmailAndPassword) => Promise<void>;
  signUpWithEmailAndPassword: ({
    redirect,
    email,
    password,
    claims,
  }: SignUpEmailAndPassword) => Promise<void>;
  signOut: () => Promise<false | User>;
  getFreshToken: () => Promise<string>;
  updateProfile: ({
    name,
    photoURL,
    email,
    password,
  }: UpdateProfile) => Promise<void>;
};

const AuthContext = createContext<Context | null>(null);
export default function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

async function format(rawUser: firebase.User | boolean) {
  if (rawUser) {
    const user = await formatUser(rawUser as firebase.User);
    return user;
  } else {
    if (!["/login"].includes(Router.asPath)) {
      Router.push("/login");
    }
    return false;
  }
}

function useFirebaseAuth(): Context {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleUser = async (rawUser: firebase.User | boolean) => {
    if (rawUser) {
      const userData = await formatUser(rawUser as firebase.User);
      setUser(userData);
      setLoading(false);
      return user;
    } else {
      if (!["/login"].includes(Router.asPath)) {
        Router.push("/login");
      }
      setUser(false);
      setLoading(false);
      return false;
    }
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
        if (response.additionalUserInfo.isNewUser === false) {
          Router.push("/newUserInfo");
        }
        if (redirect) {
          Router.push(redirect);
        }
      });
  };
  const signUpWithEmailAndPassword = ({
    redirect,
    email,
    password,
    claims,
    residentId = undefined,
  }: SignUpEmailAndPassword) => {
    setLoading(true);
    if (claims.janitor && residentId)
      console.log("Vaktmester kan ikke v??re knyttet til residentId");
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        response.user.getIdTokenResult();
        handleUser(response.user);
        if (redirect) {
          Router.push(redirect);
        }
        firebase
          .firestore()
          .collection("accounts")
          .doc(response.user.uid)
          .set({ residentId });
      });
  };
  const updateProfile = async ({
    name,
    photoURL,
    email,
    password,
  }: UpdateProfile) => {
    if (photoURL) {
      const uploadTask = firebase
        .storage()
        .ref(`profile/${photoURL.name}${name}`)
        .put(photoURL);
      uploadTask.on(
        null,
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            firebase
              .auth()
              .currentUser.updateProfile({ displayName: name, photoURL: url })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      );
    } else {
      await firebase.auth().currentUser.updateProfile({ displayName: name });
    }
    if (email) await firebase.auth().currentUser.updateEmail(email);
    if (password) await firebase.auth().currentUser.updatePassword(password);
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
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    signOut,
    getFreshToken,
    updateProfile,
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
  const { token, expirationTime, claims } = decodedToken;
  firebase
    .firestore()
    .collection("accounts")
    .doc(user.uid)
    .get()
    .then((doc) => {
      const { residentId } = doc.data();
      return {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        provider: user.providerData[0].providerId,
        photoUrl: user.photoURL,
        claims,
        token,
        expirationTime,
        residentId,
      };
    })
    .catch((e) => {
      Error(e);
    });
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    claims,
    token,
    expirationTime,
    residentId: null,
  };
};
