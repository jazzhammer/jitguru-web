
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";
import {type MeetupTemplate} from "../models/meetup-template";

export interface MeetupTemplateSearchDto {
  id?: number;
  name?: string;
  org_id?: number;
  facility_id?: number;
  meetup_spot_id?: number;
  crew_template_id?: number;
}

const MeetupTemplateService = {
  find: (searchDto: MeetupTemplateSearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}meetup_templates`, {
      params: searchDto
    })
  },
  create: (subjectDto: Partial<MeetupTemplate>): Promise<any> => {
    return axios.post(`${API_BASE_URL}meetup_templates`, {
      ...subjectDto
    })
  },
  update: (subjectDto: Partial<MeetupTemplate>): Promise<any> => {
    return axios.put(`${API_BASE_URL}meetup_templates`, {
      ...subjectDto
    })
  }
}
export default MeetupTemplateService;