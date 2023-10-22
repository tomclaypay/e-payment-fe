<template>
  <lottie :options="defaultOptions" class="!w-80 m-auto" />
</template>

<script>
import Lottie from "vue-lottie/src/lottie.vue";
import successful from "~/assets/animation/successful.json";
export default {
  components: {
    lottie: Lottie,
  },
  data() {
    return {
      defaultOptions: {
        animationData: successful,
        loop: false,
      },
    };
  },
};
</script>
