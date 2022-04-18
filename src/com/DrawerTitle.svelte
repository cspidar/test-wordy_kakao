<script>
</script>

<div class="grid-cols-2">
  <div class="absolute left-8 top-5 font-light text-3xl border-b-2 mb-4">
    <slot name="title" />
  </div>

  <button
    class="ml-2 mr-4 rotate-90 hover:rotate-180 active:scale-110 active:rotate-180 transition-all ease-in-out duration-300 absolute right-2 top-6 "
  >
    <slot name="btn" />
  </button>
</div>
