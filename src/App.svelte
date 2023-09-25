<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import TailwindCss from './lib/TailwindCSS.svelte';

  import Landing from './pages/landing.svelte';

</script>
<TailwindCss/>

<main class="flex items-center justify-center w-full p-0 m-0 h-full border-2 bg-powder-800">
  <Landing></Landing>
</main>

<style>
</style>
