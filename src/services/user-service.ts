import {API_BASE_URL} from'../settings/api-settings';
import {type User} from "../models/user";

const UserService = {
  authenticate: async (username: string, password: string): Promise<User> => {
    debugger;
    const response = await fetch(
      `${API_BASE_URL}users`
      , {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password
        })
      }
    );
    let responseJson = await response.json();
    let loggedInUser = responseJson.authenticated;
    return Promise.resolve(loggedInUser);
  }
}

export default UserService;