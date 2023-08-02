import React, { createContext, useState } from 'react'

// Declaring UserContext to undefined
export const UserContext = createContext("")

// Declaring Default users and Current User Function
export function UserProvider({ children }) {
  const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userToken, setUserToken] = useState("");
  const [userBalance, setUserBalance] = useState("");

  const updateUserName = (name) => {
		setUserName(name);
	};

	const updateUserEmail = (email) => {
		setUserEmail(email);
	};

const updateUserToken = (token) => {
	setUserToken(token);
};

const updateUserBalance = (balance) => {
	setUserBalance(balance);
};

	return (
		<UserContext.Provider value={{ userEmail, updateUserEmail, userToken, updateUserToken, 
    setUserEmail, userName, setUserName, updateUserName, setUserBalance, userBalance, updateUserBalance  }}>
			{children}
		</UserContext.Provider>
	)
}


//UserContext = global state
// useContext hook takes value from global state

//https://react.dev/reference/react/useContext
//https://react.dev/learn/conditional-rendering
//https://firebase.google.com/docs/firestore/quickstart#node.js