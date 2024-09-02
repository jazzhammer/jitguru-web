import { writable } from 'svelte/store';
import store from "./types";
export interface UserPreferencesCrud {
  type: string;
  payload: any;
}
const UserPreferencesStore = writable<UserPreferencesCrud>({
  type: store.CREATE,
  payload: null
});
export default UserPreferencesStore;