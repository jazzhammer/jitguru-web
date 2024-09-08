import { writable } from 'svelte/store';
import store from "./types";
export interface SubjectsCrud {
  type: string;
  payload: any;
}
const SubjectsStore = writable<SubjectsCrud>({
  type: store.CREATE,
  payload: null
});
export default SubjectsStore;