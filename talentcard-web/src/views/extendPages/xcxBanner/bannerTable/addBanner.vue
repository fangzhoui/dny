<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="100px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" class="input-width" placeholder="请输入名称" maxlength="10" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="picture">
      <is-one-upload
        action="/tcmgr/banner/upload"
        tip="只能上传1张，尺寸750*344，2M以内，支持扩展名：png .jpg"
        class="upload-single-img"
        :fileList="form.picture"
        :isReview="true"
        :limitSize="2"
        :isDel="true"
        projectName="banner"
        @input="avatarInput"
      ></is-one-upload>
    </el-form-item>
    <el-form-item label="跳转方式">
      <el-select v-model="form.type" clearable class="input-width" placeholder="请选择跳转方式">
        <el-option v-for="item in jumpStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="跳转地址" prop="jump">
      <el-input v-model="form.jump" class="input-width" placeholder="请输入跳转地址"></el-input>
      <p class="tips">注：链接不能随意填写，随便填写则无法跳转，只能填写小程序绑定的域名内的链接</p>
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        placeholder="请输入备注"
        v-model="form.extra"
        type="textarea"
        class="input-width"
        maxlength="200"
        rows="4"
        show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import IsOneUpload from "@c/upload/isOneUpload";
import { emptyArr } from "@/utils/validator";
import { insertBannerApi } from '@/api/api'
import { jumpStatus } from '../../config'
export default {
  name: "add-banner",
  props: {
    form: {
      require: true,
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'form.type' () {
      this.form.jump = ''
      this.$refs.form.validateField('jump')
    }
  },
  components: {
    IsOneUpload
  },
  data() {
    const checkType = (rule, value, callback) => {
      if (this.form.type) {
        if (value) {
          callback()
        } else {
          callback(new Error('请输入跳转地址'))
        }
      } else {
        callback()
      }
    }
    return {
      jumpStatus: jumpStatus,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: ['change', 'blur'] }],
        picture: [
          {
            required: true,
            validator: emptyArr,
            message: "请上传图片",
            trigger: ["blur", "change"]
          }
        ],
        jump: [{ validator: checkType, trigger: ['change', 'blur'] }]
      }
    };
  },
  methods: {
    avatarInput(val) {
      this.$set(this.form, "picture", val);
      this.$refs['form'].validateField('picture')
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.form,
            picture: this.form.picture.length > 0 ? this.form.picture[0].url : ''
          }
          try {
            await insertBannerApi(params)
            this.$message.success('新建成功')
            this.$emit("close", 'add');
          } catch (e) {}
        } else {
          return false;
        }
      });
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>


<style lang="less" scoped>
.tips {
  font-size: 12px;
  color: #606266;
}
</style>