<style>
  .list-template-roles {
    width: 300px;
    display: grid;
    grid-template-columns: 3fr 2fr;
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

  import {type TemplateRole} from '../../../models/template-role';

  export let templateRoles: TemplateRole[] = [];
  export let selected = (next: TemplateRole): void => {
    console.log(`selected ${JSON.stringify(next)}`);
  }
</script>
<div class="list-template-roles">
  {#if templateRoles && templateRoles.length}
    <div class="text-center bg-white">name</div>
    <div class="text-center bg-white">max_count</div>
    {#each templateRoles as templateRole}
      <div on:click={() => selected(templateRole)} class="item hover:bg-blue-200 cursor-pointer">{templateRole.name}</div>
      <div on:click={() => selected(templateRole)} class="item hover:bg-blue-200 cursor-pointer text-center">{templateRole.max_count}</div>
    {/each}
  {/if}
</div>