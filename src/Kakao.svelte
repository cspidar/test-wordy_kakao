<script>
  import { onMount } from "svelte";
  import "./kakao.js";

  onMount(() => {
    // kakao = Kakao;
    Kakao.init("6e437b23b2779fece18e6c86a9b86bb7");
    console.log(Kakao.isInitialized());
    console.log("mount!1");
  });
</script>
