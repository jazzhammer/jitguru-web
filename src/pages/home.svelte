<script>
  import SecurityStore from "../store.js";
  import {onDestroy} from "svelte";

  let security;
  const unsub = SecurityStore.subscribe(stored => {
    security = stored;
  });
  onDestroy(()=>{unsub()});
</script>
<main>
  home with {security?.loggedInUser?.last_name}
</main>