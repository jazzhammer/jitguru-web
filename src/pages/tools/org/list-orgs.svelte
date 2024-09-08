<style>
  .list-org {
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

  import {type Org} from "../../../models/org";

  export let orgs: Org[] = [];
  export let selected = (next: Org): void => {
    console.log(`selected ${JSON.stringify(next)}`);
  }
</script>
<div class="list-org">
  {#if orgs && orgs.length}
    <div class="text-center bg-amber-100 w-full">name</div>
    {#each orgs as org}
      <div on:click={() => selected(org)} class="item hover:bg-blue-200 cursor-pointer text-left">{org.name}</div>
    {/each}
  {/if}
</div>