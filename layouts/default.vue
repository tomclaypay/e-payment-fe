<template>
  <div
    class="h2p-container bg-slate-600 min-h-screen relative pt-28 pb-32 px-1 md:px-0 bg-cover bg-center bg-no-repeat bg-fixed flex items-center"
    :style="`background-image:url(${bgUrl})`"
  >
    <div class="absolute top-0 left-0 right-0 py-5">
      <div
        class="max-w-[1000px] mx-auto flex items-center h-[70px] px-5 md:px-0"
      >
        <img src="~/assets/images/front/logo.svg" class="w-40" />
      </div>
    </div>
    <Nuxt />
    <div class="absolute bottom-0 left-0 right-0">
      <div
        class="max-w-[1000px] mx-auto flex justify-between text-base text-white py-10"
      >
        <div class="font-bold">Điều khoản bảo mật</div>
        <div>© 2022 EaglePay</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    bgUrl() {
      return process.env.bgUrl
        ? process.env.bgUrl
        : require("~/assets/images/bg/bg.jpg");
    },
  },
};
</script>
