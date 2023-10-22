<template>
  <div v-if="order" class="mx-auto max-w-[1000px] w-full pb-20">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-5">
      <div class="md:col-span-3 order-2 md:order-1">
        <div
          class="bg-white rounded-[10px] min-h-[500px] pb-5 px-5 md:px-8 lg:px-10"
        >
          <div v-if="order.status === 'PENDING'">
            <div
              class="border-b border-solid border-[#005030]/20 flex h-16 items-center justify-between mb-5"
            >
              <div class="text-black text-xl font-bold flex-1">
                Thanh toán bằng thẻ quốc tế
              </div>
            </div>

            <div class="text-base font-bold mb-3">
              Chọn loại thẻ được hỗ trợ sau đây:
            </div>
            <div class="grid grid-cols-4 gap-3 mb-5">
              <img
                v-for="method in methods"
                class="w-full cursor-pointer border border-solid rounded-md"
                :class="`${
                  method.name === form.paymentMethodCode
                    ? 'shadow-lg rounded-md border-[#01A1DD] opacity-100'
                    : 'filter grayscale border-[#DDDDDD] opacity-20'
                }`"
                :key="method.name"
                :src="method.logo"
                @click="form.paymentMethodCode = method.name"
              />
            </div>
            <div class="text-base font-bold mb-3">Nhập thông tin:</div>

            <el-form ref="form" :model="form" :rules="rules" autocomplete="off">
              <el-form-item
                prop="fullname"
                class="w-full relative fullname-input"
              >
                <el-input
                  v-model="form.fullname"
                  clearable
                  autocomplete="off"
                  class="bg-transparen"
                />
                <div
                  class="text-sm absolute top-0 left-0 right-0 bottom-0 flex items-center pl-4 pointer-events-none"
                  :class="fullnamePlaceholderVisible ? 'block' : 'hidden'"
                >
                  <span class="text-[#BABEC7] mr-1">Tên đầy đủ</span>
                  <span class="text-[#FF7A00]">(Nhập đúng tên trên thẻ)</span>
                </div>
              </el-form-item>
              <el-form-item prop="mobile" class="w-full">
                <el-input
                  v-model="form.mobile"
                  placeholder="Số điện thoại"
                  type="mobile"
                  autocomplete="off"
                  clearable
                />
              </el-form-item>
              <el-form-item prop="email" class="w-full">
                <el-input
                  v-model="form.email"
                  placeholder="Email"
                  type="email"
                  autocomplete="off"
                  clearable
                />
              </el-form-item>
              <el-form-item prop="address" class="w-full">
                <el-input
                  v-model="form.address"
                  placeholder="Địa chỉ"
                  type="address"
                  autocomplete="off"
                  clearable
                />
              </el-form-item>
              <div
                class="rounded flex items-center justify-center h-14 w-full text-white font-bold uppercase bg-[#01A1DD] mt-12 cursor-pointer text-base"
                @click="beforeSubmit"
                v-loading="isLoading"
              >
                Thanh toán
              </div>
            </el-form>
          </div>
          <div v-else class="md:col-span-3 order-2 md:order-1">
            <Step4 :result="order" />
          </div>
        </div>
        <div
          class="bg-[#FFE5CD] rounded-[10px] p-5 mt-[10px] flex items-center"
          v-if="order.status === 'PENDING'"
        >
          <img src="~/assets/images/front/warning.svg" class="w-6" />
          <div class="text-sm pl-5 flex-1">
            Vui lòng nhập đúng thông tin với thông tin thẻ thanh toán
          </div>
        </div>
      </div>

      <div class="md:col-span-2 order-1 md:order-2">
        <OrderInfo :order="order" />
      </div>
    </div>
  </div>
</template>

<script>
import Step4 from "../components/Step4.vue";
import { rsaEncrypt } from "~/utils/crypto";
import { methods } from "~/constants";

export default {
  components: { Step4 },
  data() {
    const patternPhone = /([0-9. -+]{8,15})/;

    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Số điện thoại không được để trống!"));
      } else if (!patternPhone.test(value)) {
        callback(new Error("Số điện thoại không đúng định dạng!"));
      } else {
        callback();
      }
    };

    const patternEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Email không được để trống!"));
      } else if (!patternEmail.test(value)) {
        callback(new Error("Email không đúng định dạng!"));
      } else {
        callback();
      }
    };
    return {
      order: null,
      isLoading: false,
      fullnamePlaceholderVisible: true,
      form: {
        fullname: null,
        mobile: null,
        email: null,
        address: null,
        paymentMethodCode: methods[0].name,
      },
      rules: {
        fullname: {
          required: true,
          message: "Tên đầy đủ không được để trống!",
        },
        mobile: [{ validator: validatePhone, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }],
        address: {
          required: true,
          message: "Địa chỉ không được để trống!",
        },
      },
    };
  },
  computed: {
    methods() {
      return methods;
    },
  },
  watch: {
    form: {
      deep: true,
      handler(newVal) {
        this.fullnamePlaceholderVisible = !newVal.fullname;
      },
    },
  },
  mounted() {
    this.loadOrder();
  },
  methods: {
    async loadOrder() {
      const params = {
        data: rsaEncrypt(process.env.publicKey, {
          orderId: this.$route.query.order,
        }),
      };
      try {
        const { data } = await this.$axios.post(
          "internals/card/deposit/order-info/",
          params
        );
        if (data) {
          this.order = data;
          if (data?.visaTx?.checkoutUrl)
            window.location = data?.visaTx?.checkoutUrl;

          if (data?.visaTx?.paymentMethodCode)
            this.form.paymentMethodCode = data.visaTx.paymentMethodCode;
        }
        this.isReady = true;
      } catch (e) {
        if (e.response?.data?.message) {
          this.error = e.response.data.message;
          this.$notify.error({
            title: "Thông báo!",
            message: e.response.data.message,
            duration: 3000,
          });
        }
      }
    },
    beforeSubmit() {
      if (!this.isLoading) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.isLoading = true;
            this.onSubmit();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    async onSubmit() {
      try {
        const params = {
          data: rsaEncrypt(process.env.publicKey, {
            ...this.form,
            orderId: this.$route.query.order,
          }),
        };
        const { data } = await this.$axios.post(
          "internals/card/deposit/create-visa-order",
          params
        );
        if (data && data.checkoutUrl) {
          window.location = data.checkoutUrl;
        }
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        if (e.response?.data?.message) {
          this.error = e.response.data.message;
          this.$notify.error({
            title: "Thông báo!",
            message: e.response.data.message,
            duration: 3000,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.qr-notification {
  .el-notification__content {
    margin-top: 0px;
  }
}

.fullname-input {
  input {
    background: transparent !important;
  }
}
</style>
