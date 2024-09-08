<style>
  .new-meetup-template {
    width: 100%;
    text-align: left;
  }

</style>
<script lang="ts">
import MeetupTemplatesStore from "../../../stores/meetup-templates-store";
import store from "../../../stores/types";
import {type MeetupTemplate} from "../../../models/meetup-template";
import MeetupTemplateService from "../../../services/meetup-template-service";
import {type Org} from "../../../models/org";
import {onDestroy} from "svelte";
import OrgsStore from './../../../stores/orgs-store';
import ACTION_SELECTED from './../../../stores/orgs-store';
let newMeetupTemplate: Partial<MeetupTemplate> = {
  name: '',
  org_id: -1
};
let org: Org;
$: org
const unsubOrg = OrgsStore.subscribe((crud: any) => {
  if (crud && crud.type == store.READ) {
    org = crud.payload;
    // console.log(`org payload: ${org?.name}`)
  }
  else if (crud && crud.selected) {
    org = crud.selected;
    newMeetupTemplate.org_id = org.id;
    // console.log(`org selected: ${org?.name}`)
  }
  else {
    // console.log(`org store: ${JSON.stringify(crud)}`)
  }
});


export let createdMeetupTemplate = (next: MeetupTemplate): void => {
  console.log(`created ${JSON.stringify(next)}`);
};
let canCreate = false;
$: canCreate = newMeetupTemplate.name && newMeetupTemplate.name.trim().length > 0 && org;

const create = (): void => {
  MeetupTemplateService.create({
    ...newMeetupTemplate
  }).then((response) => {
    const created = response.data.created;
    MeetupTemplatesStore.set({
      type: store.CREATE,
      payload: created
    });
    createdMeetupTemplate(created)
  });
}

onDestroy(unsubOrg);
</script>
<div class="new-meetup-template flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">new meetup_template</div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div>org</div>
    <div>{org?.name}</div>
  </div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div>name</div>
    <div><input bind:value={newMeetupTemplate.name} placeholder="name" class="bg-white text-amber-950 pl-3"/></div>
  </div>
  {#if canCreate}
  <div on:click={create}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950"
      style="border-radius: 3px; min-width: 90px; max-width: 150px; margin-top:12px; cursor: pointer;"
  >create</div>
  {:else }
    {#if !org}
      <div>require org for new template, org = {org ? org.name : 'none'} </div>
    {/if}
    <div>require name for new template, name = {newMeetupTemplate?.name ? newMeetupTemplate.name : 'none'} </div>
  {/if}
</div>