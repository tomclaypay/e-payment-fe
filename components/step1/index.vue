<template>
  <div>
    <step-1-confirm
      v-if="loginResData"
      :loginResData="loginResData"
      :bank="bank"
    />
    <step1Login @onSuccess="onLoginSuccess" v-else />
  </div>
</template>

<script>
export default {
  name: "Step1",
  props: {
    bank: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loginResData: null,
      // loginResData: {
      //   otpMsg: "Lorem ipsum dolor",
      //   otpConfirmType: "input",
      //   device: {
      //     deviceModel: "iphone",
      //     deviceName: "iphone 11",
      //   },
      // },
    };
  },
  methods: {
    onLoginSuccess(data) {
      this.loginResData = data;
    },
  },
};
</script>
