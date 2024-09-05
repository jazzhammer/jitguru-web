<script>
  import { Router, Link, Route } from "svelte-routing";
  import AdminTools from './pages/tools/admin-tools.svelte';
  import Home from './pages/home.svelte';
  import TailwindCss from './lib/TailwindCSS.svelte';
  import Landing from './pages/landing.svelte';
  export let url = "";
</script>

<TailwindCss/>
<main class="flex p-0 h-full w-full border-2 bg-milden-800 m-0">
  <Router {url} >
    <div>
      <Route path="/"><Landing/></Route>
      <Route path="/home"><Home/></Route>
      <Route path="/admin_tools"><AdminTools/></Route>
    </div>
  </Router>
</main>
<style>
</style>
