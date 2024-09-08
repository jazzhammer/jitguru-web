
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";
import {type Org} from "../models/org";

export interface OrgSearchDto {
  id?: number;
  name ?: string;
  description?: string;
}

const OrgService = {
  find: (searchDto: OrgSearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}orgs`, {
      params: searchDto
    })
  },
  create: (orgDto: Partial<Org>): Promise<any> => {
    return axios.post(`${API_BASE_URL}orgs`, {
      ...orgDto
    })
  },
  update: (orgDto: Partial<Org>): Promise<any> => {
    return axios.put(`${API_BASE_URL}orgs`, {
      ...orgDto
    })
  }
}
export default OrgService;