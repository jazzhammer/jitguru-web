<script>
  import {API_BASE_URL} from "../../../settings/api-settings.js";
  import MessagesStore from "../../../stores/messages-store.js";
  import OrgsStore from "../../../stores/orgs-store.js";
  import {createEventDispatcher} from "svelte";

  let name;
  let description;


  const dispatch = createEventDispatcher();

  $: canCreate =  name && name.length > 0 &&
                description && description.length > 0;
  async function createOrg() {
    if (canCreate) {
      const response = await fetch(`${API_BASE_URL}orgs?name=${name}`, {
        method: 'GET'
      });
      // debugger;
      const orgsJson = await response.json();
      if (orgsJson.matched) {
        MessagesStore.update(old => {
          return {
            ...old,
            home: `org of name '${name}' already exists. try joining instead.`
          }
        });
      } else {
        const createResponse = await fetch(`${API_BASE_URL}orgs`, {
          method: "POST",
          body: JSON.stringify({
            name,
            description
          })
        });
        const createdJson = await createResponse.json();
        const createdOrg = createdJson.created;
        if (createdOrg) {
          MessagesStore.update(old => {
            return {
              ...old,
              home: `org of name ${createdOrg.name} created.`
            }
          });
          OrgsStore.update(old => {
            return {
              ...old,
              selected: createdOrg
            }
          });
          dispatch('createdOrg', createdOrg);
        }
      }
    }
  }
</script>
<main class="border-3 border-yellow-900 bg-white flex flex-col">
  <div class="flex flex-row mt-1 mb-1">
    <div class="pl-2 w-24 text-right pr-1">name</div>
    <div><input on:keyup={(e) => {name=e.target.value}} type="text" class="bg-white pl-1 text-black border-2 border-stone-900 mr-1"/></div>
  </div>
  <div class="flex flex-row mt-1 mb-1">
    <div class="pl-2 w-24 text-right pr-1">description</div>
    <div><input on:keyup={(e) => {description=e.target.value}} type="text" class="bg-white pl-1 text-black border-2 border-stone-900 mr-1"/></div>
  </div>
  {#if canCreate}
    <div class="flex content-end w-full mb-1"><button on:click={createOrg} class="pl-2 pr-2 bg-garden-600 hover:bg-garden-400 ml-auto mr-2 text-white font-bold">create org</button></div>
  {/if}
</main>