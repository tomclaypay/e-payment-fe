<template>
  <div class="pt-10">
    <div v-if="error" class="text-center">
      <base-failed />
      <div class="font-bold text-base mt-5 mb-2">Giao dịch lỗi</div>
      <div>{{ error }}</div>
      <ButtonReload />
    </div>
    <div v-else>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        autocomplete="off"
        v-if="type === SMS && bank.code === 'BIDV'"
      >
        <div class="font-medium text-base mb-32">
          Quý khách vui lòng nhập mã OTP đã được gửi tới số điện thoại của Quý
          khách để xác thực giao dịch
        </div>
        <el-form-item prop="otp" class="w-full">
          <el-input
            v-model="form.otp"
            placeholder="Nhập OTP"
            clearable
            autocomplete="off"
          />
        </el-form-item>
        <div
          class="rounded flex items-center justify-center h-14 w-full text-white font-bold uppercase bg-[#01A1DD] mt-12 cursor-pointer text-base"
          @click="submitForm"
          v-loading="isLoading"
        >
          Xác nhận
        </div>
      </el-form>

      <div v-if="type === APP">
        <div class="mb-22 text-base font-medium">
          Một yêu cầu xác thực đăng nhập đã được gửi đến thiết bị đã đăng ký
          Mobile Banking của bạn. Vui lòng kiểm tra tin nhắn trên thiết bị và
          nhấn “Cho phép đăng nhập” để xác thực đăng nhập.
        </div>
        <!-- <div class="mb-10">
          Số điện thoại:
          <strong>090*****112</strong>
          <strong>{{ loginResData.otpMsg }}</strong>
        </div> -->
        <div class="flex items-center px-5 py-3 bg-[#F7F7F7] rounded mt-20">
          <img src="~/assets/images/banks/phone.png" class="h-10 mr-2" />
          <div>
            <div class="text-base font-bold">
              {{ loginResData.otpKeys.deviceName }}
            </div>
            <div>{{ loginResData.otpKeys.deviceModel }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NONE, APP, WAIT, SMS, INPUT } from "~/constants/otp";
import { rsaEncrypt } from "~/utils/crypto";
export default {
  name: "Step1",
  props: {
    loginResData: {
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
      isLoading: false,
      form: {
        otp: null,
      },
      rules: {
        otp: { required: true, message: "OTP không được để trống!" },
      },
      error: null,
      interval: null,
      type: null,
      NONE,
      APP,
      WAIT,
      SMS,
      INPUT,
    };
  },
  mounted() {
    this.type = this.loginResData.otpLoginType;
    this.checkOtpType();
  },
  methods: {
    checkOtpType() {
      if (
        (this.type === APP && this.bank.code === "TCB") ||
        (this.type === NONE && this.bank.code === "VCB")
      ) {
        this.interval = setInterval(() => {
          this.confirm();
        }, 5000);
      }
    },
    submitForm() {
      if (!this.isLoading) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.isLoading = true;
            this.confirm();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    async confirm() {
      try {
        const params = {
          data: rsaEncrypt(process.env.publicKey, {
            ...this.form,
            orderId: this.$route.query.order,
          }),
        };
        const { data } = await this.$axios.post(
          "internals/confirm-login",
          params
        );
        if (data && data.isSucceed) {
          if (this.interval) {
            clearInterval(this.interval);
          }
          this.$nuxt.$emit("change-active-tab", 1);
        }
        this.isLoading = false;
      } catch (e) {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.isLoading = false;
        if (e.response?.data?.message) {
          this.error = e.response.data.message;
        }
      }
    },
  },
};
</script>
