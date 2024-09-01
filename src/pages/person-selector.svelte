<script lang="ts">
  import {API_BASE_URL} from "../settings/api-settings.js";
  import {PREF_SELECTED_FACILITY_ID} from "../models/user-preference.js"
  import {createEventDispatcher, onDestroy} from "svelte";
  import PermissionsStore from "../stores/permissions-store.js";
  import SecurityStore from "../stores/security-store.js";
  import PersonsStore from "../stores/persons-store.js";
  import PersonSearch from "./person-search.svelte";
  import PersonCreate from "./person-create.svelte";
  import {type Person} from "../models/person";

  let mode = 'search_person';

  let permissions;
  const unsubPermissions = PermissionsStore.subscribe(stored => {
    permissions = stored;
  });

  const dispatch = createEventDispatcher();

  let persons;
  $: persons
  const unsubPersons = PersonsStore.subscribe(stored => {
    persons = stored;
    if (!persons['selected']) {
      if (persons['persons']?.length > 0) {
        persons['selected'] = persons['persons'][0];
      }
    }
  });

  const foundPersons = (next: Person[]): void => {
    const nextPersons = {
      ...persons
    }
    nextPersons.persons = next;
    persons = nextPersons;
  }


  let security;
  const unsubSecurity = SecurityStore.subscribe(old => {
    security = old;
  });

  const selectPerson = (person: Person) => {

    PersonsStore.update(old => {
      return {
        ...old,
        selected: person
      }
    });
    if (security.loggedInUser) {
      fetch(`${API_BASE_URL}users/preference`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: security.loggedInUser.id,
          name: PREF_SELECTED_FACILITY_ID,
          value: person.id
        })
      });
    }
    dispatch('selectedPerson', person);
    const nextPersons = {
      ...persons,
      persons: null
    };
    persons = nextPersons;
  }

  onDestroy(()=>{
    unsubSecurity();
    unsubPersons();
    unsubPermissions();
  })

  function createdPerson(created: Person) {
    selectPerson(created);
    mode = '';
  }

  function setMode(next) {
    mode = next;
  }

</script>
<main class="flex flex-col w-64 text-black text-left">
  <div>
    {#if mode === 'search_person'}
      <PersonSearch foundPersons={foundPersons}></PersonSearch>
      <div on:click={()=>{setMode('new_person')}}
           class="cursor-pointer hover:underline border border-amber-700 px-2"
      >new person...</div>
      {#if persons.persons?.length > 0}
        {#each persons.persons as person}
          <div on:click={selectPerson(person)} class="px-2 hover:bg-blue-300 hover:text-amber-950">
            {person.last_name.toUpperCase()}, {person.first_name.toLowerCase()}
          </div>
        {/each}
      {/if}
    {/if}
    {#if mode === 'new_person'}
      <PersonCreate createdPerson={createdPerson}></PersonCreate>
      <div on:click={()=>{setMode('search_person')}}
           class="cursor-pointer hover:underline border border-amber-700"
      >search person...</div>
    {/if}
  </div>
  {#if persons && persons.persons?.length > 0}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      <!--{#if mode!=='select_person'}-->
      <!--  <div on:click={()=>mode='select_person'} class="cursor-pointer rounded-xl bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>-->
      <!--{:else}-->
      <!--  <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>-->
      <!--{/if}-->
      <!--{#if mode!=='select_person'}-->
      <!--  <div on:click={() => mode = 'select_person'} class="cursor-pointer hover:text-garden-400">go to another person:</div>-->
      <!--{:else}-->
      <!--  <div class="">go to another person:</div>-->
      <!--{/if}-->
    </div>
    {#if mode==='select_person'}
      {#each persons.persons as person}
        {#if !persons.selected || person.id !== persons.selected.id}
          <div class="flex flex-row">
            <div on:click={() => selectPerson(person)} class="pl-2 w-11/12 bg-{persons.selected?.id === person.id ? 'garden-800':'white'} hover:bg-garden-900 cursor-pointer">{person.name}</div>
            <div class="w-2 pl-2 pr-3 cursor-pointer hover:bg-cocoa-200 hover:text-white font-bold">-</div>
          </div>
        {/if}
      {/each}
    {/if}
  {/if}
  <!--{#if permissions.add_facility_person}-->
  <!--  <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">-->
  <!--    {#if mode!=='join_person'}-->
  <!--      <div on:click={()=>mode='join_person'} class="cursor-pointer rounded-xl  bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>-->
  <!--    {:else}-->
  <!--      <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>-->
  <!--    {/if}-->
  <!--    {#if mode!=='include_person'}-->
  <!--      <div on:click={() => mode = 'join_person'} class="cursor-pointer hover:text-garden-400">include a person:</div>-->
  <!--    {:else}-->
  <!--      <div class="">include a person:</div>-->
  <!--    {/if}-->
  <!--  </div>-->
  <!--  {#if mode==='join_person'}-->
  <!--    <div>-->
  <!--      <PersonSearch></PersonSearch>-->
  <!--    </div>-->
  <!--  {/if}-->
  <!--{/if}-->
  <!--{#if permissions.add_person}-->
  <!--  <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">-->
  <!--    {#if mode!=='create_person'}-->
  <!--      <div on:click={()=>mode='create_person'} class="cursor-pointer rounded-xl  bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>-->
  <!--    {:else}-->
  <!--      <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>-->
  <!--    {/if}-->
  <!--    {#if mode!=='create_person'}-->
  <!--      <div on:click={() => mode = 'create_person'} class="cursor-pointer hover:text-garden-400">create a person:</div>-->
  <!--    {:else}-->
  <!--      <div class="">create a person:</div>-->
  <!--    {/if}-->
  <!--  </div>-->
  <!--  {#if mode==='create_person'}-->
  <!--    <div>-->
  <!--      <PersonCreate on:createdPerson={(created) => createdPerson(created)}></PersonCreate>-->
  <!--    </div>-->
  <!--  {/if}-->
  <!--{/if}-->
</main>