
import {API_BASE_URL} from'../settings/api-settings';
import axios from "axios";
import {type Topic} from "../models/topic";

export interface TopicSearchDto {
  id?: number;
  name ?: string;
  subject_id?: number;
}

const TopicService = {
  find: (searchDto: TopicSearchDto): Promise<any> => {
    return axios.get(`${API_BASE_URL}topics`, {
      params: searchDto
    })
  },
  create: (topicDto: Partial<Topic>): Promise<any> => {
    return axios.post(`${API_BASE_URL}topics`, {
      ...topicDto
    })
  },
  update: (topicDto: Partial<Topic>): Promise<any> => {
    return axios.put(`${API_BASE_URL}topics`, {
      ...topicDto
    })
  }
}
export default TopicService;