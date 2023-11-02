<script>
  import AdminUsers from './admin/admin-users.svelte';
  let mode = '';
  function setMode(next) {
    mode = next;
  }
</script>


<main class="flex flex-col text-black w-screen m-0 h-full">
  <div class="text-left font-bold pl-1 bg-garden-100 text-white mr-1">
    admin tools
  </div>
  <div class="flex flex-row h-full">
    <div class="w-1/12 flex flex-col text-left pl-1 bg-powder-600 h-full">
      <div class="cursor-pointer hover:font-bold text-sm {mode === 'users' ? 'font-bold bg-powder-400' : ''}" on:click={()=>setMode('users')}>users</div>
      <div class="cursor-pointer hover:font-bold text-sm {mode === 'groups' ? 'font-bold bg-powder-400' : ''}" on:click={()=>setMode('groups')}>groups</div>
      <div class="cursor-pointer hover:font-bold text-sm {mode === 'orgs' ? 'font-bold bg-powder-400' : ''}" on:click={()=>setMode('orgs')}>orgs</div>
      <div class="cursor-pointer hover:font-bold text-sm {mode === 'facilities' ? 'font-bold bg-powder-400' : ''}" on:click={()=>setMode('facilities')}>facilities</div>
      <div class="cursor-pointer hover:font-bold text-sm {mode === 'spots' ? 'font-bold bg-powder-400' : ''}" on:click={()=>setMode('spots')}>spots</div>
    </div>
    <div class="w-11/12">
      <div class="w-full h-full pr-1">
        {#if mode==='users'}
          <AdminUsers></AdminUsers>
        {/if}
      </div>
    </div>
  </div>
</main>