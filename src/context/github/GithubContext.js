import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    loading: false,
    user: {},
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  const setLoading = () => dispatch({ type: "SET_LOADING" });

  // Get initial users (for testing purpose)
  const fetchUsers = async () => {
    setLoading();

    const response = await fetch(`${GITHUB_URL}/users`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });
    const data = await response.json();

    dispatch({
      type: "GET_USERS",
      payload: data,
    });
  };

  // Search users by the username
  const searchUsers = async (username) => {
    setLoading();

    const params = new URLSearchParams({
      q: username,
    });

    // https://api.github.com/search/users?q=xxx
    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });
    const { items } = await response.json();

    dispatch({
      type: "GET_USERS",
      payload: items, // can change name to users, but payload is the convention
    });
  };

  // Clean up the search result
  const clearUsers = () => {
    dispatch({
      type: "CLEAR_USERS",
    });
  };

  // Get a single user
  const getUser = async (username) => {
    setLoading();

    const response = await fetch(`${GITHUB_URL}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json();
      dispatch({
        type: "GET_USER",
        payload: data, // can change name to users, but payload is the convention
      });
    }
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        fetchUsers,
        searchUsers,
        getUser,
        clearUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
