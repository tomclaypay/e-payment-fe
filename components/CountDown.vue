<template>
  <div class="mt-5">
    <div class="bg-white rounded-[10px] p-5">
      <div
        class="text-center border-b border-solid border-[#005030]/20 font-bold text-base pb-5"
      >
        Giao dịch kết thúc sau
      </div>
      <div class="flex items-center mx-auto w-fit mt-5" v-if="timer">
        <div
          class="w-12 h-12 flex items-center justify-center font-bold text-base rounded"
          :class="bgTimer"
        >
          {{ minutes }}
        </div>
        <div class="font-bold text-base mx-5">:</div>
        <div
          class="w-12 h-12 flex items-center justify-center font-bold text-base rounded"
          :class="bgTimer"
        >
          {{ seconds }}
        </div>
      </div>
      <div v-else class="py-5 text-center italic text-red-500">
        Đã hết thời gian giao dịch, vui lòng thử lại
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: 300,
      bgTimer: "bg-[#3554D1]/20",
    };
  },
  computed: {
    minutes() {
      const minutes = Math.floor(this.timer / 60);
      return minutes > 9 ? minutes : "0" + minutes;
    },
    seconds() {
      const seconds = this.timer % 60;
      return seconds > 9 ? seconds : "0" + seconds;
    },
  },
  mounted() {
    const interval = setInterval(() => {
      if (this.timer <= 1) {
        clearInterval(interval);
      }
      if (this.timer <= 121) {
        this.bgTimer = "bg-yellow-500 text-white";
      }
      if (this.timer <= 61) {
        this.bgTimer = "bg-red-500 text-white";
      }
      this.timer--;
    }, 1000);
  },
};
</script>
