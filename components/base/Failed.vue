<template>
  <lottie :options="defaultOptions" class="!w-80 m-auto" />
</template>

<script>
import Lottie from "vue-lottie/src/lottie.vue";
import failed from "~/assets/animation/failed.json";
export default {
  components: {
    lottie: Lottie,
  },
  data() {
    return {
      defaultOptions: {
        animationData: failed,
        loop: false,
      },
    };
  },
};
</script>
