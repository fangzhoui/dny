<template>
  <div class="wrapper">
    <el-row class="subtitlerow">
      <span class="subtitle">当前拥有的政策权益</span>
    </el-row>
    <el-divider></el-divider>
    <template v-for="(item, index) in policyList">
      <el-tag :key="index" >{{ item.name }}</el-tag>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    policyList: {
      type: Array,
      default: [],
    },
    tabs: { type: String, default: "1" },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},

  filters: {},
  created() {},
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  position: relative;
}
.subtitlerow {
  width: 100%;
}
.subtitle {
  font-size: 15px;
  margin-top: 16px;
  font-weight: bold;
  float: left;
}
.el-tag {
  margin-left: 8px;
  margin-bottom: 10px;
}
</style>
