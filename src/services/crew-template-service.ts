
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";
import {type CrewTemplate} from "../models/crew-template";

export interface CrewTemplateSearchDto {
  id?: number;
  name ?: string;
}

const CrewTemplateService = {
  find: (searchDto: CrewTemplateSearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}crew_templates`, {
      params: searchDto
    })
  },
  create: (crewTemplateDto: Partial<CrewTemplate>): Promise<any> => {
    return axios.post(`${API_BASE_URL}crew_templates`, {
      ...crewTemplateDto
    })
  },
  update: (crewTemplateDto: Partial<CrewTemplate>): Promise<any> => {
    return axios.put(`${API_BASE_URL}crew_templates`, {
      ...crewTemplateDto
    })
  }
}
export default CrewTemplateService;