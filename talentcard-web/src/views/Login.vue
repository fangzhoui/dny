<template>
  <div class="login">
    <div  class="login-container">
      <!-- <h1 style="color:white">活力新衢州 美丽大家园</h1> -->
      <div class="logo-box"></div>
      <div class="title-box">衢江人才卡业务后台</div>
      <div class="login-box"></div>
      <el-form :model="ruleForm2" ref="ruleForm2" :rules="rules" class="form-box">
        <el-form-item class="form-item" prop="username">
          <el-input
            type="text"
            v-model="ruleForm2.username"
            prefix-icon="el-icon-user-solid"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="password">
          <el-input
            type="password"
            v-model="ruleForm2.password"
            prefix-icon="el-icon-lock"
            placeholder="密码"
            maxlength="15"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="checkCode">
          <el-input v-model="ruleForm2.checkCode" prefix-icon="el-icon-key" placeholder="验证码" @keyup.enter.native="handleSubmit2('ruleForm2')"></el-input>
          <img class="checkCodeWrapper" @click="createCode" :src="checkCodeUrl" />
        </el-form-item>
        <el-form-item class="form-item">
          <el-button type="primary" @click="handleSubmit2('ruleForm2')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { requestLogin, requestCheckcode } from "../api/api";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      checkCodeUrl: "",
      ruleForm2: {
        username: "",
        password: "",
        checkCode: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: ["change", "blur"] }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: ["change", "blur"] }
        ],
        checkCode: [
          { required: true, message: "验证码不能为空", trigger: ["change", "blur"] }
        ]
      }
    };
  },
  mounted() {
    this.createCode();
  },
  methods: {
      ...mapActions([
      "getJurisdiction",
    ]),
    async createCode() {
      try {
        const res = await requestCheckcode();
        this.checkCodeUrl = "data:image/png;base64," + res;
      } catch (e) {
        console.log(e);
      }
    },
    handleSubmit2(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const loginParams = {
              ...this.ruleForm2
            };
            const data = await requestLogin(loginParams);
            this.getJurisdiction(loginParams);
            sessionStorage.setItem("user", JSON.stringify(data));
            this.$router.push({ path: "/main" });
          } catch (e) {
            this.createCode();
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  background-image: url("../assets/bg.jpg");
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  text-align: center;
  position: relative;
}
.el-input {
  width: 270px;
  height: 38px;
}
.checkbar {
  position: relative;
}
.login-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // padding: 35px 35px 15px 35px;
  // width: 320px;
  // height: 320px;
  .logo-box {
    width: 69px;
    height: 77px;
    background: url('../assets/logo1.png') no-repeat;
    background-size: 100% 100%;
    margin: 0 auto 26px;
  }
  .title-box {
    color: #fff;
    line-height: 30px;
    font-size: 23px;
    margin-bottom: 50px;
  }
  .form-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .form-item {
      width: 270px;
      position: relative;
      .checkCodeWrapper {
        position: absolute;
        width: 78px;
        height: 34px;
        top: 3px;
        right: 3px;
        z-index: 100;
      }
    }
  }
}
.el-button {
  width: 270px;
}

.accountCheck,
.passCheck,
.checkCodeCheck {
  margin-top: -30px;
  margin-left: 100px;
}
</style>
