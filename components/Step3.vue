<template>
  <div>
    <div v-if="error" class="text-center pt-10">
      <base-failed />
      <div class="font-bold text-base mt-5 mb-2">Giao dịch lỗi</div>
      <div>{{ error }}</div>

      <ButtonReload />
    </div>
    <div v-else>
      <!-- Vietcombank, BIDV -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        autocomplete="off"
        v-if="type === SMS && method === INPUT"
      >
        <div class="font-semibold text-base mb-5 mt-11">
          Quý khách vui lòng nhập mã OTP đã được gửi về số điện thoại
        </div>
        <div
          class="font-semibold mb-5 text-base"
          v-if="processingResData?.otpKeys?.phoneNumber"
        >
          Số điện thoại:
          <strong>{{ processingResData.otpKeys.phoneNumber }}</strong>
        </div>
        <el-form-item prop="otp" class="w-full mt-24">
          <el-input
            v-model="form.otp"
            placeholder="Nhập OTP"
            clearable
            autocomplete="off"
          />
        </el-form-item>
        <div
          class="rounded flex items-center justify-center h-14 w-full text-white font-bold uppercase bg-[#005030] mt-10 cursor-pointer"
          @click="submitForm"
          v-loading="isLoading"
        >
          Xác nhận
        </div>
      </el-form>

      <!-- Vietcombank: nhập code từ response vào app interner banking để lấy OTP -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        autocomplete="off"
        v-if="type === APP && method === INPUT"
      >
        <div class="font-medium my-5 text-base">
          {{
            processingResData?.otpMsg
              ? processingResData.otpMsg
              : "Vui lòng nhập mã kiểm tra dưới đây vào ứng dụng để tạo mã OTP cho giao dịch"
          }}
        </div>
        <div class="font-medium">
          Mã kiểm tra:
          <strong>{{ processingResData?.otpKeys?.verifyCode }}</strong>
        </div>
        <el-form-item prop="otp" class="w-full mt-20">
          <el-input
            v-model="form.otp"
            placeholder="Nhập OTP"
            clearable
            autocomplete="off"
          />
        </el-form-item>
        <div
          class="rounded flex items-center justify-center h-14 w-full text-white font-bold uppercase bg-[#01A1DD] mt-10 cursor-pointer"
          @click="submitForm"
          v-loading="isLoading"
        >
          Xác nhận
        </div>
      </el-form>

      <!-- BIDV QR scan -->
      <div
        v-if="
          type === APP &&
          method === WAIT &&
          processingResData?.otpKeys?.qrImageData
        "
      >
        <div class="mt-10 text-base font-medium">
          Giao dịch đang chờ xác thực bằng phương thức Smart OTP trên ứng dụng
          SmartBanking kênh điện thoại của Quý khách.
        </div>
        <div>
          <img
            :src="processingResData?.otpKeys?.qrImageData"
            class="w-52 mx-auto mt-20"
          />
          <!-- <qrcode-vue
            :value="processingResData?.otpKeys?.qrImageData"
          ></qrcode-vue> -->
        </div>
      </div>

      <!-- Techcombank -->
      <div
        v-if="
          type === APP &&
          method === WAIT &&
          processingResData.otpKeys.deviceModel &&
          bank.code === 'TCB'
        "
      >
        <div class="mb-2 text-base font-medium">
          {{
            processingResData?.otpMsg
              ? processingResData.otpMsg
              : "Một yêu cầu xác thực đăng nhập đã được gửi đến thiết bị đã đăng ký Mobile Banking của bạn. Vui lòng kiểm tra tin nhắn trên thiết bị và nhấn “Cho phép đăng nhập” để xác thực đăng nhập."
          }}
        </div>

        <div class="flex items-center px-5 py-3 bg-[#F7F7F7] rounded mt-5">
          <img src="~/assets/images/banks/phone.png" class="h-10 mr-2" />
          <div>
            <div class="text-base font-bold">
              {{ processingResData.otpKeys.deviceName }}
            </div>
            <div>{{ processingResData.otpKeys.deviceModel }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { APP, WAIT, SMS, INPUT } from "~/constants/otp";
import QrcodeVue from "qrcode.vue";
import { rsaEncrypt } from "~/utils/crypto";
export default {
  name: "Step1",
  props: {
    processingResData: {
      type: Object,
      default: () => {},
    },
    bank: {
      type: Object,
      default: () => {},
    },
  },
  components: { QrcodeVue },
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
      method: null,
      APP,
      WAIT,
      SMS,
      INPUT,
    };
  },
  mounted() {
    if (this.processingResData) {
      this.type = this.processingResData.otpProcessType;
      this.method = this.processingResData.otpProcessMethod;
    }
    this.checkOtpType();
  },
  methods: {
    checkOtpType() {
      if (this.method === WAIT) {
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
          "internals/confirm-process",
          params
        );
        if (data && data.isSucceed) {
          if (this.interval) {
            clearInterval(this.interval);
          }
          this.$emit("onFinish", {
            status: "SUCCEED",
          });
          this.$nuxt.$emit("change-active-tab", 4);
        }
        this.isLoading = false;
      } catch (e) {
        if (this.interval) {
          clearInterval(this.interval);
        }
        if (e.response?.data?.message) {
          this.$emit("onFinish", {
            status: "ERROR",
            error: e.response.data.message,
          });
        }
        this.$nuxt.$emit("change-active-tab", 4);
        this.isLoading = false;
      }
    },
  },
};
</script>
