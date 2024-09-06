<style>
  .new-template-role {
    width: 100%;
    text-align: left;
  }
  .field-rows {}
  .field-rows > * {
    margin-bottom: 2px;
  }

</style>
<script lang="ts">
import store from "../../../stores/types";
import {type TemplateRole} from "../../../models/template-role";
import {type CrewTemplate} from "../../../models/crew-template";
import TemplateRoleService from "../../../services/template-role-service";
import TemplateRolesStore from "../../../stores/template-roles-store";

let newTemplateRole: Partial<TemplateRole> = {
  name: '',
  max_count: 0,
  crew_template_id: null
};
export let createdTemplateRole = (next: TemplateRole): void => {
  console.log(`created ${JSON.stringify(next)}`);
};

export let crewTemplate: CrewTemplate;
$: newTemplateRole.crew_template_id = crewTemplate?.id


let canCreate = false;
$: canCreate = newTemplateRole.name && newTemplateRole.name.trim().length > 0;

const create = (): void => {
  TemplateRoleService.create({
    ...newTemplateRole
  }).then((response) => {
    const created = response.data.created;
    TemplateRolesStore.set({
      type: store.CREATE,
      payload: created
    });
    createdTemplateRole(created)
  });
}
const keyupTemplateRoleName = (e: KeyboardEvent): void => {
  if (e.code === 'Enter') {
    create();
  }
}
</script>
<div class="new-template-role flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-5">new template_role</div>
  <div class="field-rows" style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div style="width: 90px;">name</div>
    <div>
      <input on:keyup={keyupTemplateRoleName} bind:value={newTemplateRole.name} placeholder="new template_role name"
             class="bg-white text-amber-950 pl-3"/>
    </div>
    <div style="width: 80px;">max_count</div>
    <div>
      <input bind:value={newTemplateRole.max_count} placeholder="new max_count"
             class="bg-white text-amber-950 pl-3"/>
    </div>
  </div>
  {#if canCreate}
  <div on:click={create}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950"
      style="border-radius: 3px; min-width: 90px; max-width: 250px; margin-top:12px;"
  >create templateRole</div>
  {/if}
</div>