<template>
  <div>
    <div class="titlewrapper">
      <section class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumb-self">
          <el-breadcrumb-item :to="{ path: '/extend/travel' }">免费旅游</el-breadcrumb-item>
          <el-breadcrumb-item>数据查看</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="homepageTitle"></div>
      </section>
    </div>
    <div class="total-container">
      <span>本月总旅游数量：{{ total.totalNumbers || 0 }}</span>
      <span>已核销：{{ total.usedNumbers || 0 }}</span>
      <span>已领取未使用：{{ total.usingNumbers || 0 }}</span>
      <span>未领取：{{ total.unreceived || 0 }}</span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="实时数据" name="first">
        <first />
      </el-tab-pane>
      <el-tab-pane label="日统计" name="second">
        <second />
      </el-tab-pane>
      <el-tab-pane label="月统计" name="third">
        <third />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import First from "./first";
import Second from "./second";
import Third from "./third";
import { travelHeaderData } from "@/api/api";
export default {
  name: "ExtendPagesDataView",
  components: { First, Second, Third },
  props: {},
  data() {
    return {
      activeName: "first",
      total: {
        totalNumbers: 0,
        usedNumbers: 0,
        usingNumbers: 0,
        unreceived: 0
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    handleClick(tab, event) {},
    async init() {
      try {
        const res = await travelHeaderData();
        this.total = {
          ...res
        }
      } catch (e) {
      }
    }
  }
};
</script>

<style lang="less" scoped>
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
.total-container {
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 10px 20px;
  border-radius: 3px;
  background: #fff;
  font-size: 14px;
  line-height: 18px;
  & > span {
    margin-right: 20px;
    color: #303133;
  }
}
</style>
