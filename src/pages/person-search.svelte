<style>
  .person-search {

  }
  .search-input {
    width: 100%;
    height: 20px;
    font-size: 12pt;
    padding-left: 3px;
    background-color: white;
  }
</style>
<script lang="ts">
  import {type Person} from "../models/person";
  import PersonService from "../services/person-service";

  export let foundPersons = (next: Person[]): void => {
    console.log(`foundPersons(${JSON.stringify(next)})`);
  }

  const searchPersons = (): void => {
    PersonService.find({name: search}).then((response: any) => {
      const founds = response.data;
      foundPersons(founds);
    });
  }


  let searchTimeout;
  const keyupSearch = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      searchPersons();
    }
    else {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      searchTimeout = setTimeout(() => {
        searchPersons();
      }, 350);
    }
  }

  let search = '';
  $: search

</script>
<main class="person-search border-3 border-yellow-900 bg-white">
  <div>
    <input on:keyup={keyupSearch} bind:value={search} class="search-input" placeholder="search for..."/>
  </div>
</main>