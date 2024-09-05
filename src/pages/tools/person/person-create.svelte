<script lang="ts">
  import {API_BASE_URL} from "../../../settings/api-settings.js";
  import MessagesStore from "../../../stores/messages-store.js";
  import PersonsStore from "../../../stores/persons-store.js";
  import {createEventDispatcher} from "svelte";
  import {type Person} from "../../../models/person";

  export let createdPerson = (created: Person): void => {
    console.log(`createdPerson: ${JSON.stringify(created)}`);
  }

  let first_name;
  let last_name;


  const dispatch = createEventDispatcher();

  $: canCreate =  first_name && first_name.length > 0 &&
                last_name && last_name.length > 0;
  async function createPerson() {
    if (canCreate) {
      const response = await fetch(`${API_BASE_URL}persons?first_name=${first_name}&last_name=${last_name}`, {
        method: 'GET'
      });
      const personsJson = await response.json();
      if (personsJson.length) {
        MessagesStore.update(old => {
          return {
            ...old,
            home: `person of first_name '${first_name}' and last_name ${last_name} already exists. try joining instead.`
          }
        });
      } else {
        const createResponse = await fetch(`${API_BASE_URL}persons`, {
          method: "POST",
          body: JSON.stringify({
            first_name,
            last_name
          })
        });
        const createdJson = await createResponse.json();
        const created = createdJson.created;
        debugger;
        if (created) {

          createdPerson(created)
          MessagesStore.update(old => {
            return {
              ...old,
              home: `person ${created.last_name}, ${created.first_name} created.`
            }
          });
          PersonsStore.update(old => {
            return {
              ...old,
              selected: created
            }
          });
          dispatch('createdPerson', created);
        } else {
          console.log(`could not create person`);
        }

      }
    }
  }
</script>
<main class="border-3 border-yellow-900 bg-white flex flex-col">
  <div class="flex flex-row mt-1 mb-1">
    <div class="pl-2 w-24 text-right pr-1">first_name</div>
    <div><input on:keyup={(e) => {first_name=e.target.value}} type="text" class="bg-white pl-1 text-black border-2 border-stone-900 mr-1"/></div>
  </div>
  <div class="flex flex-row mt-1 mb-1">
    <div class="pl-2 w-24 text-right pr-1">last_name</div>
    <div><input on:keyup={(e) => {last_name=e.target.value}} type="text" class="bg-white pl-1 text-black border-2 border-stone-900 mr-1"/></div>
  </div>
  {#if canCreate}
    <div class="flex content-end w-full mb-1"><button on:click={createPerson} class="pl-2 pr-2 bg-garden-600 hover:bg-garden-400 ml-auto mr-2 text-white font-bold">create person</button></div>
  {/if}
</main>