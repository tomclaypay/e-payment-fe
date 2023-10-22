<template>
  <lottie :options="defaultOptions" class="!w-24 m-auto" />
</template>

<script>
import Lottie from "vue-lottie/src/lottie.vue";
import loading from "~/assets/animation/loading.json";
export default {
  components: {
    lottie: Lottie,
  },
  data() {
    return {
      defaultOptions: { animationData: loading },
    };
  },
};
</script>
