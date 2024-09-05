<script>
  import {API_BASE_URL} from "../../../settings/api-settings.js";
  import MessagesStore from "../../../stores/messages-store.js";
  import FacilitysStore from "../../../stores/facilitys-store.js";
  import OrgStore from "../../../stores/orgs-store.js";

  import {createEventDispatcher, onDestroy} from "svelte";

  let name;
  let description;
  let org;
  $: org

  const unsubOrg = OrgStore.subscribe((next) => {
    org = next['selected'];
  });

  onDestroy(unsubOrg);

  const dispatch = createEventDispatcher();

  $: canCreate =  name &&
                  name.length > 0 &&
                  description &&
                  description.length > 0 &&
                  org;

  async function createFacility() {
    if (canCreate) {
      const response = await fetch(`${API_BASE_URL}facilitys?name=${name}`, {
        method: 'GET'
      });
      debugger;
      const facilitysJson = await response.json();
      if (facilitysJson.matched && facilitysJson.matched.length > 0) {
        MessagesStore.update(old => {
          return {
            ...old,
            home: `facility of name '${name}' already exists.`
          }
        });
      } else {
        const createResponse = await fetch(`${API_BASE_URL}facilitys`, {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            org_id: org.id
          })
        });
        const createdJson = await createResponse.json();
        const createdFacility = createdJson.created;
        if (createdFacility) {
          MessagesStore.update(old => {
            return {
              ...old,
              home: `facility of name ${createdFacility.name} created.`
            }
          });
          FacilitysStore.update(old => {
            return {
              ...old,
              selected: createdFacility
            }
          });
          dispatch('createdFacility', createdFacility);
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
    <div class="flex content-end w-full mb-1"><button on:click={createFacility} class="pl-2 pr-2 bg-garden-600 hover:bg-garden-400 ml-auto mr-2 text-white font-bold">create facility</button></div>
  {/if}
</main>