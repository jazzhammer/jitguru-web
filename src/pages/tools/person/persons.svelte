<style>
  .persons {
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
  import {type Person} from "../../../models/person";
  import PersonsStore from "../../../stores/persons-store";
  import NewPerson from './person-create.svelte'
  import SearchPerson from './person-search.svelte';
  import ListPersons from './list-persons.svelte';
  // import EditPerson from './edit-person.svelte';

  let mode = 'search';
  $: mode
  const setMode = (next: string): void => {
    mode = next;
  }

  let person: Person;
  $: person
  const createdPerson = (next: Person): void => {
    person = next;
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

  let persons;
  $: persons
  const found = (founds: Person[]): void => {
    console.log(`found patients : ${founds?.length}`)
    persons = founds;
  }

  const selectedPerson = (next: Person): void => {
    person = next;
    mode = 'edit';
    PersonsStore.set({
      type: store.READ,
      payload: person
    });
  }

  const updatedPerson = (next: Person) => {
    person = next;
  }

</script>
<div class="persons">
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
      <NewPerson createdPerson="{createdPerson}"></NewPerson>
    {/if}
    {#if mode === 'search'}
      <SearchPerson foundPersons="{found}"></SearchPerson>
      {#if persons && persons.length > 0}
        <ListPersons persons={persons} selectPerson={selectedPerson}></ListPersons>
      {/if}
    {/if}
    <!--{#if mode === 'edit'}-->
    <!--  <EditPerson updatedPerson="{updatedPerson}"></EditPerson>-->
    <!--{/if}-->
  </div>
</div>