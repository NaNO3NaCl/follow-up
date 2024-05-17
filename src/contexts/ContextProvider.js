import React, { createContext, useContext, useState } from "react";
import {collection} from 'firebase/firestore';
import {fireStore} from '../firebase'

const StateContext = createContext();

const initialState = {
  chat: false,
  userProfile: false,
  notification: false,
};

const initialMain = {
  profile: false,
  employees: false,
  priority: false,
  editor: false,
  calendar: false,
  lineChart: false,
};
// refactor into 2 contexts 1: for auth and 2: for application state

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);
  const [user, setUser] = useState(null);
  const [activeMain, setActiveMain] = useState(initialMain);

  const handleClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: true });
  };

  const setActiveUser = (userData) => {
    setUser(userData);
  };

  const handleMainVisible = (main) => {
    setActiveMain({ ...initialMain, [main]: true });
  };

  const getCollectionRef = ()=> {
    console.log("Actually called...");
    if (!user){
      console.log("null user");
      return null;//no user signed in, no reference
    }
    console.log("user not null");//making sure that uID is actually populating.
    return collection(fireStore, "users", user.uid, "notes" );
  }

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        setScreenSize,
        user,
        setActiveUser,
        activeMain,
        setActiveMain,
        handleMainVisible,
        getCollectionRef,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
