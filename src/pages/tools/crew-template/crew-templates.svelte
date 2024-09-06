<style>
  .crew-templates {
    width: 100%;
    text-align: left;
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
  import store from "../../../stores/types";
  import {type CrewTemplate} from "../../../models/crew-template";
  import CrewTemplatesStore from "../../../stores/crew-templates-store";
  import NewCrewTemplate from './new-crew-template.svelte';
  import SearchCrewTemplate from './search-crew-template.svelte';
  import ListCrewTemplates from './list-crew-templates.svelte';
  import EditCrewTemplate from './edit-crew-template.svelte';

  let mode = 'search';
  $: mode
  const setMode = (next: string): void => {
    mode = next;
  }

  let crewTemplate: CrewTemplate;
  $: crewTemplate
  const createdCrewTemplate = (next: CrewTemplate): void => {
    crewTemplate = next;
    mode = 'search';
  }

  const executeSearch = (): void => {

  }

  let timeoutSearch;
  const search = (): void => {
    if (timeoutSearch) {
      clearTimeout(timeoutSearch);
    }
    timeoutSearch = setTimeout(() => {
      executeSearch();
    }, 400);
  }

  let crewTemplates;
  $: crewTemplates
  const found = (founds: CrewTemplate[]): void => {
    crewTemplates = founds;
  }

  const selectedCrewTemplate = (next: CrewTemplate): void => {
    crewTemplate = next;
    mode = 'edit';
    CrewTemplatesStore.set({
      type: store.READ,
      payload: crewTemplate
    });
  }

  const updatedCrewTemplate = (next: CrewTemplate) => {
    crewTemplate = next;
  }

</script>
<div class="tool">
  <div class="menu ml-3">
    {#if mode !== 'new'}
      <div on:click={() => setMode('new')} class="menu-item border-2 border-amber-700 text-center hover:bg-blue-200 cursor-pointer"
        style="border-radius: 3px;"
      >
        new
      </div>
    {/if}
    {#if mode !== 'search'}
      <div on:click={() => setMode('search')} class="menu-item border-2 border-amber-700 text-center hover:bg-blue-200 cursor-pointer"
           style="border-radius: 3px;"
      >
        search
      </div>
    {/if}
  </div>
  <div class="ml-3 mt-3">
    {#if mode === 'new'}
      <NewCrewTemplate createdCrewTemplate="{createdCrewTemplate}"></NewCrewTemplate>
    {/if}
    {#if mode === 'search'}
      <SearchCrewTemplate found="{found}"></SearchCrewTemplate>
      {#if crewTemplates && crewTemplates.length > 0}
        <ListCrewTemplates crewTemplates={crewTemplates} selected={selectedCrewTemplate}></ListCrewTemplates>
      {/if}
    {/if}
    {#if mode === 'edit'}
      <EditCrewTemplate updatedCrewTemplate="{updatedCrewTemplate}"></EditCrewTemplate>
    {/if}
  </div>
</div>