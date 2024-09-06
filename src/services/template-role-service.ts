
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";
import {type TemplateRole} from "../models/template-role";

export interface TemplateRoleSearchDto {
  id?: number;
  name ?: string;
  crew_template_id?: number;
}

const TemplateRoleService = {
  find: (searchDto: TemplateRoleSearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}template_roles`, {
      params: searchDto
    })
  },
  create: (templateRoleDto: Partial<TemplateRole>): Promise<any> => {
    return axios.post(`${API_BASE_URL}template_roles`, {
      ...templateRoleDto
    })
  },
  update: (templateRoleDto: Partial<TemplateRole>): Promise<any> => {
    return axios.put(`${API_BASE_URL}template_roles`, {
      ...templateRoleDto
    })
  }
}
export default TemplateRoleService;