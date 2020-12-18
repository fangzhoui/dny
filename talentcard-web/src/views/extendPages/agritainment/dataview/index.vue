<template>
  <div>
    <div class="titlewrapper">
      <section class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumb-self">
        <el-breadcrumb-item :to="{ path: '/extend/agritainment' }">农家乐</el-breadcrumb-item>
        <el-breadcrumb-item>数据查看</el-breadcrumb-item>
      </el-breadcrumb>
        <div class="homepageTitle"></div>
      </section>
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
import First from './first'
import Second from './second'
import Third from './third'
export default {
  name: "ExtendPagesDataView",
  components: { First, Second, Third },
  props: {},
  data() {
    return {
      activeName: 'first'
    };
  },
  created() {},
  methods: {
    handleClick(tab, event) {}
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
 .total_box{
    padding: 20px 26px ;
   background-color: #fff;
   font-size: 20px;
   color: #606266;
   span{
     margin-right: 50px;
   }
  }
</style>
