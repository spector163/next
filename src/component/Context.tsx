import {
  Children,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type View = "LOGIN" | "SIGNIN" | "CONTACT";
type LoginData = {
  email: string;
  password: string;
};
type SigninData = {
  name: string;
  email: string;
  password: string;
};
type Contact = {
  user_id: number;
};
type State = {
  view: View;
  data: LoginData | SigninData | Contact;
};
type Func = {
  hideModal: () => void;
  showModal: () => void;
  setModalData: (data: LoginData | SigninData | Contact) => void;
};

const ModalContext = createContext<State & Func>({
  view: "LOGIN",
  data: {
    email: "",
    password: "",
  },
  hideModal: () => {},
  showModal: () => {},
  setModalData: (data: LoginData | SigninData | Contact) => {},
});

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>({
    view: "LOGIN",
    data: {
      email: "",
      password: "",
    },
  });
  const hideModal = () => {};
  const showModal = () => {};
  const setModalData = (data: LoginData | SigninData | Contact) => {};
  const value = useMemo(
    () => ({
      ...state,
      hideModal,
      showModal,
      setModalData,
    }),
    [state]
  );
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw Error("Use in a parent");
  }
  return context;
};
