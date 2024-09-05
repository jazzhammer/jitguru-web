import { writable } from 'svelte/store';
import store from "./types";
export interface TopicsCrud {
  type: string;
  payload: any;
}
const TopicsStore = writable<TopicsCrud>({
  type: store.CREATE,
  payload: null
});
export default TopicsStore;