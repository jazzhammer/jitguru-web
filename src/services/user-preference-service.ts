
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";
import {type UserPreference} from "../models/user-preference";

export interface UserPreferenceSearchDto {
  last_name?: string;
  first_name?: string;
  id?: number;
  name ?: string;
  user_id?: number;
}

const UserPreferenceService = {
  find: (searchDto: UserPreferenceSearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}users/preference`, {
      params: searchDto
    })
  },
  create: (userPreferenceDto: Partial<UserPreference>): Promise<any> => {
    return axios.post(`${API_BASE_URL}users/preference`, {
      ...userPreferenceDto
    })
  }
}
export default UserPreferenceService;