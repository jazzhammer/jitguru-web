import { writable } from 'svelte/store';
import store from "./types";
export interface CrewTemplatesCrud {
  type: string;
  payload: any;
}
const CrewTemplatesStore = writable<CrewTemplatesCrud>({
  type: store.CREATE,
  payload: null
});
export default CrewTemplatesStore;