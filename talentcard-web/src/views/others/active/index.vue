<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">人才活动</div>
        <div class="homepageTitle"></div>
      </section>
    </div>
    <div class="search-container">
      <el-tabs :value="activeName" @tab-click="handleClick">
        <el-tab-pane label="人才活动" name="first">
          <activity />
        </el-tab-pane>
        <el-tab-pane :label="`活动审批(${num})`" name="second" v-permission="'eventApproval'">
          <approval></approval>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Activity from "./component/activity";
import Approval from "./component/approval";
import { mapState, mapActions } from "vuex";
export default {
  name: "otherActive",
  components: {
    Approval,
    Activity,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      num: (state) => state.common.approvalNum,
      activeName: (state) => state.others.activeName,
    }),
  },
  created() {
    this.getEventFields();
  },
  mounted() {},
  methods: {
    ...mapActions(["getEventFields", "setActiveName", 'getOtherApprovalNum']),
    handleClick(tab, event) {
      console.log(tab.name)
      if (tab.name == 'second') {
        this.getOtherApprovalNum()
      }
      this.setActiveName(tab.name);
    },
  },
};
</script>

<style lang="less" scoped>
.search-container {
  background: #fff;
  padding: 0 20px;
}
</style>

