<style>
  .new-crew-template {
    width: 100%;
    text-align: left;
  }

</style>
<script lang="ts">
import store from "../../../stores/types";
import {type CrewTemplate} from "../../../models/crew-template";
import CrewTemplateService from "../../../services/crew-template-service";
import CrewTemplatesStore from "../../../stores/crew-templates-store";

let newCrewTemplate: Partial<CrewTemplate> = {
  name: ''
};
export let createdCrewTemplate = (next: CrewTemplate): void => {
  console.log(`created ${JSON.stringify(next)}`);
};
let canCreate = false;
$: canCreate = newCrewTemplate.name && newCrewTemplate.name.trim().length > 0;

const create = (): void => {
  CrewTemplateService.create({
    ...newCrewTemplate
  }).then((response) => {
    const created = response.data.created;
    CrewTemplatesStore.set({
      type: store.CREATE,
      payload: created
    });
    createdCrewTemplate(created)
  });
}

</script>
<div class="new-crew-template flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">new crew-template</div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div>name</div><div><input bind:value={newCrewTemplate.name} placeholder="name" class="bg-white text-amber-950 pl-3"/></div>
  </div>
  {#if canCreate}
  <div on:click={create}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950"
      style="border-radius: 3px; min-width: 90px; max-width: 150px; margin-top:12px;"
  >create</div>
  {/if}
</div>