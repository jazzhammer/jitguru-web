<style>
  .tool {
    width: 100%;
  }
</style>
<script lang="ts">


  export let toolName;
  $: toolName

</script>
<div class="tool text-amber-950 text-left flex flex-col" style="position: relative;">
  <div class="border-b-2 border-garden-100 mb-4"
       style="width: calc(100% - 5px); position: absolute; top: 24px;"
  >
<!--    <div class="border-garden-100"-->
<!--         style="width: 100%; position: absolute; top: 10px; left: 0px; border-bottom: 1px solid">-->
<!--      &nbsp;-->
<!--    </div>&nbsp;-->

  </div>
  <div class="bg-garden-200 text-amber-100 px-4"
       style="position: absolute; left: 10px; top: 12px"
  >{toolName}</div>
</div>