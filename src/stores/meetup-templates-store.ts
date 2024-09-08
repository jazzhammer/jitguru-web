import { writable } from 'svelte/store';
import store from "./types";
export interface MeetupTemplatesCrud {
  type: string;
  payload: any;
}
const MeetupTemplatesStore = writable<MeetupTemplatesCrud>({
  type: store.CREATE,
  payload: null
});
export default MeetupTemplatesStore;