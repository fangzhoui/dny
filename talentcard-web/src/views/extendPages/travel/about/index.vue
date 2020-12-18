<template>
  <div class="form-container">
    <div class="form-container-header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumb-self">
        <el-breadcrumb-item :to="{ path: '/extend/travel' }">免费旅游</el-breadcrumb-item>
        <el-breadcrumb-item>关于信息</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider class="divider-self"></el-divider>
    </div>
    <div class="form-container-content">
      <div class="box">
        <div class="label">
          <span style="color: red; padding-right: 7px">*</span>关于信息
        </div>
        <div class="content">
          <my-editor
            :isCard="false"
            ref="desc"
            placeholder="请输入关于信息"
            id="desc"
          />
        </div>
      </div>
      <div class="form-btns">
        <el-button @click="close">返 回</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import MyEditor from "@c/editor";
import { getConfig, setConfig } from "@/api/api";
export default {
  name: "about-config",
  components: {
    MyEditor
  },
  data() {
    return {
      showEd: false
    };
  },
  methods: {
    async getDesc() {
      const params = {
        key: "SCENIC_INFO"
      };
      try {
        const res = await getConfig(params);
        this.$refs["desc"].content = res
        this.desc = res;
      } catch (e) {}
    },
    close() {
      this.$router.go(-1);
    },
    async submit() {
      const content = this.$refs["desc"].content;
      if (!content) {
        this.$message.error("请输入关于信息");
        return;
      }
      try {
        await this.$alert("是否确定保存信息？", "保存操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true
        });
        const params = {
          key: "SCENIC_INFO",
          value: content
        };
        await setConfig(params);
        this.$message.success("保存成功");
        this.close();
      } catch (e) {}
    }
  },
  mounted() {
    this.getDesc();
  }
};
</script>

<style lang="less" scoped>
.box {
  display: flex;
  .label {
    width: 100px;
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 30px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
}
.form-btns {
  box-sizing: border-box;
  width: 680px;
  padding: 10px;
  text-align: center;
  margin-left: 90px;
}
</style>