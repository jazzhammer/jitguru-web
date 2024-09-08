
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";
import {type MeetupSpot} from "../models/meetup_spot";

export interface MeetupSpotSearchDto {
  id?: number;
  name ?: string;
  description?: string;
  spot_type_id?: number;
  facility_id?: number;
}

const MeetupSpotService = {
  find: (searchDto: MeetupSpotSearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}meetup_spots`, {
      params: searchDto
    })
  },
  create: (meetup_spotDto: Partial<MeetupSpot>): Promise<any> => {
    return axios.post(`${API_BASE_URL}meetup_spots`, {
      ...meetup_spotDto
    })
  },
  update: (meetup_spotDto: Partial<MeetupSpot>): Promise<any> => {
    return axios.put(`${API_BASE_URL}meetup_spots`, {
      ...meetup_spotDto
    })
  }
}
export default MeetupSpotService;