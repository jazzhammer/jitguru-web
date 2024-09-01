<script>
  import {API_BASE_URL} from "../settings/api-settings.js";
  import MessagesStore from "../stores/messages-store.js";
  import MeetupSpotsStore from "../stores/facilitys-store.js";
  import {createEventDispatcher} from "svelte";

  let name;
  let description;


  const dispatch = createEventDispatcher();

  $: canCreate =  name && name.length > 0 &&
                description && description.length > 0;
  async function createMeetupSpot() {
    if (canCreate) {
      const response = await fetch(`${API_BASE_URL}meetup_spots?name=${name}`, {
        method: 'GET'
      });
      const meetupSpotsJson = await response.json();
      if (meetupSpotsJson.matched) {
        MessagesStore.update(old => {
          return {
            ...old,
            home: `meetupSpot of name '${name}' already exists.`
          }
        });
      } else {
        const createResponse = await fetch(`${API_BASE_URL}meetup_spots`, {
          method: "POST",
          body: JSON.stringify({
            name,
            description
          })
        });
        const createdJson = await createResponse.json();
        const createdMeetupSpot = createdJson.created;
        if (createdMeetupSpot) {
          MessagesStore.update(old => {
            return {
              ...old,
              home: `meetupSpot of name ${createdMeetupSpot.name} created.`
            }
          });
          MeetupSpotsStore.update(old => {
            return {
              ...old,
              selected: createdMeetupSpot
            }
          });
          dispatch('createdMeetupSpot', createdMeetupSpot);
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
    <div class="flex content-end w-full mb-1"><button on:click={createMeetupSpot} class="pl-2 pr-2 bg-garden-600 hover:bg-garden-400 ml-auto mr-2 text-white font-bold">create meetupSpot</button></div>
  {/if}
</main>