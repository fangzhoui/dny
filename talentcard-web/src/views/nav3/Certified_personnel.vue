<template>
  <div>
    <div class="titlewrapper">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">
          认证审批
        </div>
        <div class="homepageTitle"></div>
      </section>
    </div>
    <el-tabs :value="activeName" @tab-click="handleClick">
      <el-tab-pane label="提交认证" name="first">
        <SubmitCert></SubmitCert>
      </el-tab-pane>
      <el-tab-pane label="添加认证" name="second">
        <AddCert></AddCert>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AddCert from "./AddCert.vue";
import SubmitCert from "./SubmitCert.vue";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {};
  },

  components: {
    AddCert,
    SubmitCert,
  },
  computed: {
    ...mapState({
      activeName: (state) => state.CertifiedPersonnel.activeName,
    }),
  },
  created() {},
  methods: {
    ...mapActions(["getActiveTag"]),
    handleClick(tab, event) {
      this.getActiveTag(tab.name);
    },
  },
};
</script>

<style scoped>
.titlewrapper {
  background-color: white;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
}
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}
/deep/ .el-tabs__nav-wrap {
  padding-left: 20px;
  background: white;
}
</style>
