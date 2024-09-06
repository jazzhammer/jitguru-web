<style>
  .search-crew-template {
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
export let created = (next: CrewTemplate): void => {
  console.log(`created ${JSON.stringify(created)}`);
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
    created(created)
  });
}

export let found = (next: CrewTemplate[]): void => {
  console.log(`found ${JSON.stringify(next)}`);
}

let search_term = '';
let searchTimeout;
const search = (): void => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    CrewTemplateService.find({
      name: search_term
    }).then((response) => {
      const founds = response.data.matched;
      found(founds);
    });
  }, 450);
}
</script>
<div class="search flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2 text-left">browse crew-templates</div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div>search</div>
    <div>
      <input on:keyup={search}
             bind:value={search_term}
             placeholder="search term"
             class="bg-white text-amber-950 pl-3"/>
    </div>
  </div>
</div>