<style>
  .list-subjects {
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

  import {type Subject} from "../../../models/subject";

  export let subjects: Subject[] = [];
  export let selected = (next: Subject): void => {
    console.log(`slected ${JSON.stringify(next)}`);
  }
</script>
<div class="list-subjects">
  {#if subjects && subjects.length}
    <div class="text-center bg-white">name</div>
    {#each subjects as subject}
      <div on:click={() => selected(subject)} class="item hover:bg-blue-200 cursor-pointer">{subject.name}</div>
    {/each}
  {/if}
</div>