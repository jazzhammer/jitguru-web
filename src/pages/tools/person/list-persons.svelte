<style>
  .list-persons {
    width: 200px;
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

  import {type Person} from "../../../models/person";

  export let persons: Person[] = [];
  export let selected = (next: Person): void => {
    console.log(`slected ${JSON.stringify(next)}`);
  }
</script>
<div class="list-persons">
  {#if persons && persons.length}
    <div class="text-center bg-white">name</div>
    {#each persons as person}
      <div on:click={() => selected(person)} class="item hover:bg-blue-200 cursor-pointer">{person.last_name.toUpperCase()}, {person.first_name.toLowerCase()}</div>
    {/each}
  {/if}
</div>