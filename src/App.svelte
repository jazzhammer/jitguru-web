<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from './pages/home.svelte'
  import TailwindCss from './lib/TailwindCSS.svelte';
  import Landing from './pages/landing.svelte';
  export let url = "";
</script>

<TailwindCss/>
<main class="flex items-center justify-center w-full p-0 m-0 h-full border-2 bg-milden-800">
  <Router {url} >
    <div>
      <Route path="/home"><Home /></Route>
      <Route path="/"><Landing/></Route>
    </div>
  </Router>
</main>
<style>
</style>
