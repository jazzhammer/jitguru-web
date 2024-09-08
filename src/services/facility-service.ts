
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";
import {type Facility} from "../models/facility";

export interface FacilitySearchDto {
  id?: number;
  name ?: string;
}

const FacilityService = {
  find: (searchDto: FacilitySearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}facilitys`, {
      params: searchDto
    })
  },
  create: (facilityDto: Partial<Facility>): Promise<any> => {
    return axios.post(`${API_BASE_URL}facilitys`, {
      ...facilityDto
    })
  },
  update: (facilityDto: Partial<Facility>): Promise<any> => {
    return axios.put(`${API_BASE_URL}facilitys`, {
      ...facilityDto
    })
  }
}
export default FacilityService;