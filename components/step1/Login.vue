<template>
  <div>
    <div v-if="error" class="text-center pt-10">
      <base-failed />
      <div class="font-bold text-base mt-5 mb-2">Giao dịch lỗi</div>
      <div>{{ error }}</div>
      <ButtonReload />
    </div>
    <el-form ref="form" :model="form" :rules="rules" autocomplete="off" v-else>
      <div class="text-base font-medium mt-12 mb-11">
        Vui lòng nhập thông tin đăng nhập đã đăng ký tài khoản internet banking
        của bạn.
      </div>
      <el-form-item prop="username" class="w-full">
        <el-input
          v-model="form.username"
          placeholder="Tên đăng nhập"
          clearable
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="password" class="w-full">
        <el-input
          v-model="form.password"
          placeholder="Mật khẩu"
          type="password"
          autocomplete="off"
          show-password
          clearable
        />
      </el-form-item>
      <div
        class="rounded flex items-center justify-center h-14 w-full text-white font-bold uppercase bg-[#01A1DD] mt-12 cursor-pointer text-base"
        @click="submitForm"
        v-loading="isLoading"
      >
        Đăng nhập
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Step1",
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
      error: null,
      isLoading: false,
      otpMsg: null,
      form: {
        username: null,
        password: null,
      },
      rules: {
        username: {
          required: true,
          message: "Tên đăng nhập không được để trống!",
        },
        password: { required: true, message: "Mật khẩu không được để trống!" },
      },
    };
  },
  methods: {
    submitForm() {
      if (!this.isLoading) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.isLoading = true;
            this.onLogin(this.form);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    async onLogin() {
      try {
        const params = {
          data: rsaEncrypt(process.env.publicKey, {
            ...this.form,
            orderId: this.$route.query.order,
          }),
        };
        const { data } = await this.$axios.post("internals/login", params);
        if (data && data.otpLoginType) {
          this.$emit("onSuccess", data);
        }
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        if (e.response?.data?.message) {
          this.error = e.response.data.message;
        }
      }
    },
  },
};
</script>
