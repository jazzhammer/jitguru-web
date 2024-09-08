
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";
import {type Subject} from "../models/subject";

export interface SubjectSearchDto {
  id?: number;
  name ?: string;
}

const SubjectService = {
  find: (searchDto: SubjectSearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}subjects`, {
      params: searchDto
    })
  },
  create: (subjectDto: Partial<Subject>): Promise<any> => {
    return axios.post(`${API_BASE_URL}subjects`, {
      ...subjectDto
    })
  },
  update: (subjectDto: Partial<Subject>): Promise<any> => {
    return axios.put(`${API_BASE_URL}subjects`, {
      ...subjectDto
    })
  }
}
export default SubjectService;