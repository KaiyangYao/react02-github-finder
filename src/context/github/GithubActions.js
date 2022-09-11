import axios from "axios";

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const github = axios.create({
  baseURL: GITHUB_URL,
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

// Get initial users (for testing purpose)  ((https://api.github.com/users)
export const fetchUsers = async () => {
  const response = await github.get(`/users`);
  return response.data;
};

// Search users by the username  (https://api.github.com/search/users?q=xxx)
export const searchUsers = async (username) => {
  const params = new URLSearchParams({
    q: username,
  });

  const response = await github.get(`/search/users?${params}`);
  return response.data.items;
};

// Get user and repos  (https://api.github.com/users/username, https://api.github.com/users/username/repos)
export const getUserAndRepos = async (username) => {
  const params = new URLSearchParams({
    sort: "created",
    per_page: 10,
  });

  const [user, repos] = await Promise.all([
    // Get two requests together
    github.get(`/users/${username}`),
    github.get(`/users/${username}/repos`), // Get the Latest repos: github.get(`/users/${username}/repos?${params}`),
  ]);

  return { user: user.data, repos: repos.data };
};