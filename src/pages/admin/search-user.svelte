<script>
  import {API_BASE_URL} from "../../settings/api-settings.js";
  import UsersList from './users-list.svelte';
  let search = '';
  let usersJson = [];
  async function updateSearch(keyEvent) {
    keyEvent.preventDefault();
    search = keyEvent.target.value;
    if (keyEvent.code === 'Enter') {
      if (search && search.trim().length > 0) {
        const response = await fetch(`${API_BASE_URL}users?search=${search}`, {
          method: 'GET'
        });
        usersJson = await response.json();
      }
    }
  }

</script>
<main class="w-full h-full text-left pt-1">
  <input class="bg-white text-black pl-1" placeholder="search for..." on:keyup={updateSearch}>
  <UsersList users={usersJson}></UsersList>
</main>