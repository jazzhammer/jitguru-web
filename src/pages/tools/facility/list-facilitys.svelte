<style>
  .list-facility {
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

  import {type Facility} from "../../../models/facility";

  export let facilitys: Facility[] = [];
  export let selected = (next: Facility): void => {
    console.log(`selected ${JSON.stringify(next)}`);
  }
</script>
<div class="list-facility">
  {#if facilitys && facilitys.length}
    <div class="text-center bg-amber-100 w-full">name</div>
    {#each facilitys as facility}
      <div on:click={() => selected(facility)} class="item hover:bg-blue-200 cursor-pointer text-left">{facility.name}</div>
    {/each}
  {/if}
</div>