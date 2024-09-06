import { writable } from 'svelte/store';
import store from "./types";
export interface TemplateRolesCrud {
  type: string;
  payload: any;
}
const TemplateRolesStore = writable<TemplateRolesCrud>({
  type: store.CREATE,
  payload: null
});
export default TemplateRolesStore;