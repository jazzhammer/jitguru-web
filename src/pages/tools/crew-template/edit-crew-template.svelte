<style>
  .edit-crew-template {
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
</style>
<script lang="ts">
import store from '../../../stores/types';
import {type CrewTemplate} from '../../../models/crew-template';

import {type TemplateRole} from '../../../models/template-role';
import TemplateRolesStore from '../../../stores/template-roles-store';
import {onDestroy} from "svelte";
import TemplateRoleService from "../../../services/template-role-service";
import CrewTemplateService from "../../../services/crew-template-service";
import CrewTemplatesStore from "../../../stores/crew-templates-store";
import EditTemplateRole from './edit-template-role.svelte';
import NewTemplateRole from './new-template-role.svelte';
import ListTemplateRoles from './list-template-roles.svelte';
let nextCrewTemplate: Partial<CrewTemplate> = {
  name: ''
};

let crewTemplate: CrewTemplate;
$: crewTemplate

export let updatedCrewTemplate = (updated: CrewTemplate): void => {
  console.log(`updated ${JSON.stringify(updated)}`);
};
let canUpdate = false;
$: canUpdate = nextCrewTemplate.name && nextCrewTemplate.name.trim().length > 0;

const update = (): void => {
  CrewTemplateService.update({
    ...nextCrewTemplate
  }).then((response) => {
    const updated = response.data.updated;
    CrewTemplatesStore.set({
      type: store.UPDATE,
      payload: updated
    });
    updatedCrewTemplate(updated);
    crewTemplate = updated;
  });
}
let mode = 'new';
const setMode = (next: string): void => {
  mode = next;
}
let templateRole: TemplateRole;
$: templateRole
const selectedTemplateRole = (next: TemplateRole): void => {
  templateRole = next;
  setMode('edit');
  TemplateRolesStore.set({
    type: store.READ,
    payload: next
  });
}

const refreshTemplateRoles = (crewTemplate: CrewTemplate): void => {
  if (crewTemplate) {
    TemplateRoleService.find({
      crew_template_id: crewTemplate.id
    }).then((response) => {
      templateRoles = response.data.matched;
    });
  }

}

let templateRoles: TemplateRole[]
$: templateRoles
let unsubCrewTemplate = CrewTemplatesStore.subscribe((scrud) => {
  if (scrud.type == store.READ) {
    nextCrewTemplate = scrud.payload;
    crewTemplate = scrud.payload;
    refreshTemplateRoles(crewTemplate);
  }
});
onDestroy(unsubCrewTemplate);



const createdTemplateRole =(next: TemplateRole): void => {
  TemplateRolesStore.set({
    type: store.CREATE,
    payload: next
  });
  refreshTemplateRoles(crewTemplate);
}
const updatedTemplateRole = (next: TemplateRole): void => {
  TemplateRolesStore.set({
    type: store.UPDATE,
    payload: next
  });
  refreshTemplateRoles(crewTemplate);
}

</script>
<div class="edit-crew-template flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">crewTemplate details: <b>{nextCrewTemplate.name}</b></div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div>name</div>
    <div><input bind:value={nextCrewTemplate.name}
                placeholder="name"
                class="bg-white text-amber-950 pl-3"/>
    </div>
  </div>
  {#if canUpdate}
  <div on:click={update}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950"
      style="border-radius: 3px; min-width: 90px; max-width: 250px; margin-top:12px;"
  >update crew_template</div>
  {/if}
  <div class="tool text-amber-950 text-left flex flex-col mb-10" style="position: relative;">
    <div class="border-b-2 border-garden-100 mb-4"
         style="width: calc(100% - 5px); position: absolute; top: 0px; left: -8px;"
    >
      <!--    <div class="border-garden-100"-->
      <!--         style="width: 100%; position: absolute; top: 10px; left: 0px; border-bottom: 1px solid">-->
            &nbsp;
      <!--    </div>&nbsp;-->

    </div>
    <div class="bg-garden-200 text-amber-100 px-4"
         style="position: absolute; left: 2px; top: 12px"
    >
      template_roles for {crewTemplate.name}
    </div>
  </div>

  <div class="">
      <div class="menu ml-2">
        {#if mode !== 'new'}
          <div on:click={() => setMode('new')} class="menu-item border-2 border-amber-700 text-center hover:bg-blue-200 cursor-pointer"
               style="border-radius: 3px; width: 170px;"
          >
            new template_role
          </div>
        {/if}
      </div>
      <div class="template-roles-panel mt-3">
        <div class="">
          {#if mode === 'new'}
            <NewTemplateRole crewTemplate={crewTemplate} createdTemplateRole={createdTemplateRole}></NewTemplateRole>
          {/if}
          {#if mode === 'edit'}
            <EditTemplateRole templateRole={templateRole} updatedTemplateRole={updatedTemplateRole}></EditTemplateRole>
          {/if}
        </div>
        <div class="ml-2 h-full">
          {#if !templateRoles || templateRoles.length === 0}
            <div>no templateRoles for crewTemplate: {nextCrewTemplate.name}</div>
          {:else}
            <div class="bg-amber-100 text-amber-950 px-2">assigned templateRoles</div>
            <ListTemplateRoles templateRoles={templateRoles} selected={selectedTemplateRole}></ListTemplateRoles>
          {/if}
        </div>
      </div>
  </div>
</div>