<script>
  import NewUser from './new-user.svelte';
  import SearchUser from './search-user.svelte';
  let mode = '';
  function setMode(next) {
    mode = next;
  }
</script>

<main class="text-sm w-full flex flex-col">
  <div class="flex flex-row bg-powder-600">
    <div class="ml-1 mr-1 cursor-pointer hover:font-bold w-16 {mode === 'search' ? 'font-bold bg-powder-700' : ''}" on:click={() => setMode('search')}>search</div>
    <div class="ml-1 mr-1 cursor-pointer hover:font-bold w-16 {mode === 'new' ? 'font-bold bg-powder-700' : ''}" on:click={() => setMode('new')}>new</div>
  </div>
  <div class="h-full w-full pl-1 pr-1">
    {#if mode === 'search'}
      <SearchUser></SearchUser>
    {/if}
    {#if mode === 'new'}
      <NewUser></NewUser>
    {/if}
  </div>
</main>