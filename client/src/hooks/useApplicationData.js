import { useState, useEffect } from "react";

export default function useApplicationData() {
  //Hook to store the state and update it
  const [state, setState] = useState({
    user: {},
    receiver: {},
  });
  //Function to update the state of the user
  const setUser = (user) => setState({ ...state, user });
  const setReceiver = (receiver) => setState({ ...state, receiver });


  //Gets the user information from localstorage each time there is a refresh and set the state at first load)
  useEffect(() => {
    const data = localStorage.getItem("userObj");
    if (data) {
      const user = JSON.parse(data);
      setState({ ...state, user });
    }
  }, []);
  //Stores the user information in localStorage so that we can use it to set the state again if a refresh happens
  useEffect(() => {
    localStorage.setItem("userObj", JSON.stringify(state.user));
  }, [state.user]);

  useEffect(() => {

    const receiver = { test: 'test' };
    setState({ ...state, receiver });

  }, []);


  return {
    state,
    setUser,
    setReceiver,
  };
}
