
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";

export interface PersonSearchDto {
  last_name?: string;
  first_name?: string;
  id?: number;
  name ?: string;
}

const PersonService = {
  find: (searchDto: PersonSearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}persons`, {
      params: searchDto
    })
  }
}
export default PersonService;