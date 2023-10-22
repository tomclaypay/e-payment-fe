<template>
  <div class="bg-white rounded-[10px] min-h-[500px] pb-5 px-5 md:px-8 lg:px-10">
    <div
      class="border-b border-solid border-[#005030]/20 flex h-16 items-center"
    >
      <img :src="bank.logo" class="h-12" />
      <div class="text-[#122E38] text-base font-bold text-center flex-1">
        {{ bank.name }}
      </div>
    </div>
    <div class="md:px-5 py-5">
      <Step1 v-if="active === 0" :bank="bank" />
      <Step2 v-if="active === 1" @onSuccess="onProcessSuccess" />
      <Step3
        v-if="active === 2"
        :processingResData="processingResData"
        :bank="bank"
        @onFinish="onFinish"
      />
      <Step4 v-if="active >= 3" :result="result" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => {},
    },
    bank: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      active: 0,
      processingResData: null,
      result: null,
      // processingResData: {
      //   otpMsg: "Lorem ipsum dolor",
      //   otpType: "qr",
      //   device: {
      //     deviceModel: "iphone",
      //     deviceName: "iphone 11",
      //   },
      // },
    };
  },
  mounted() {
    this.$nuxt.$on("change-active-tab", (order) => {
      this.active = order;
    });

    if (this.order.status === "SUCCEED" || this.order.status === "CANCELED") {
      this.active = 3;
      this.result = {
        status: this.order.status,
      };
    }
  },
  methods: {
    onProcessSuccess(data) {
      this.processingResData = data;
    },
    onFinish(data) {
      this.result = data;
    },
  },
};
</script>

<style lang="scss">
.step-container {
  .el-step__head.is-success,
  .el-step__head.is-process {
    color: #0c6d6a;
    border-color: #0c6d6a;
  }

  .el-step__title.is-success,
  .el-step__title.is-process {
    color: #0c6d6a;
  }
}
</style>
