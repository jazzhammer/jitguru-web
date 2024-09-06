<style>
  .edit-template-role {
    width: 100%;
    text-align: left;
  }
  .template-roles-panel {
    display: grid;
    grid-template-columns: 1fr 5fr;
  }
  .menu {
    display: flex;
    flex-direction: row;
  }
  .menu-item {
    min-width: 100px;
    margin-right: 8px;
  }
  .field-rows {}
  .field-rows > * {
    margin-bottom: 2px;
  }
</style>
<script lang="ts">
import store from '../../../stores/types';
import {type TemplateRole} from '../../../models/template-role';
import TemplateRolesStore from '../../../stores/template-roles-store';
import TemplateRoleService from "../../../services/template-role-service";

export let templateRole: TemplateRole;
$: templateRole

let nextTemplateRole: Partial<TemplateRole> = {
  id: templateRole.id,
  name: templateRole.name,
  max_count: 0,
  subject_id: templateRole.subject_id
};


let canUpdate = false;
$: canUpdate = nextTemplateRole.name && nextTemplateRole.name.trim().length > 0;

const update = (): void => {
  TemplateRoleService.update({
    ...nextTemplateRole
  }).then((response) => {
    const updated = response.data.updated;
    TemplateRolesStore.set({
      type: store.UPDATE,
      payload: updated
    });
    updatedTemplateRole(updated);
    templateRole = updated;
  });
}

export let updatedTemplateRole = (next: TemplateRole): void => {
  console.log(`updatedTemplateRole(${JSON.stringify(next)})`);
}

const keyupTemplateRoleName = (e: KeyboardEvent): void => {
  if (e.code === 'Enter') {
    update();
  }
}
</script>
<div class="edit-topic flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">update template_role</div>
  <div class="field-rows" style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div style="width: 90px;">name</div>
    <div>
      <input on:keyup={keyupTemplateRoleName} bind:value={nextTemplateRole.name}
             class="bg-white text-amber-950 pl-3"/>
    </div>
    <div style="width: 80px;">max_count</div>
    <div>
      <input bind:value={nextTemplateRole.max_count}
             class="bg-white text-amber-950 pl-3"/>
    </div>
  </div>
  {#if canUpdate}
  <div on:click={update}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950"
      style="border-radius: 3px; min-width: 90px; max-width: 250px; margin-top:12px;"
  >update template_role</div>
  {/if}
</div>