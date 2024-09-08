<style>
  .list-crew-templates {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    margin-left: 0px;
    margin-top: 8px;
    border: solid 1px white;
  }

  .item {
    border: solid 1px white;
    padding-left: 3px;
  }
</style>
<script lang="ts">

  import {type CrewTemplate} from "../../../models/crew-template";

  export let crewTemplates: CrewTemplate[] = [];
  export let selected = (next: CrewTemplate): void => {
    console.log(`slected ${JSON.stringify(next)}`);
  }
</script>
<div class="list-crew-templates">
  {#if crewTemplates && crewTemplates.length}
    <div class="text-center bg-amber-100 w-full">name</div>
    {#each crewTemplates as crewTemplate}
      <div on:click={() => selected(crewTemplate)} class="item hover:bg-blue-200 cursor-pointer text-left">{crewTemplate.name}</div>
    {/each}
  {/if}
</div>