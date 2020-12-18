<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">问题收集</div>
        <div class="homepageTitle"></div>
      </section>
      <el-form
        ref="collection"
        :model="searchForm"
        label-width="80px"
        class="search-form-container"
      >
        <el-form-item label="页面" prop="pageType">
          <el-select v-model="searchForm.pageType" placeholder="请选择" @change="onchange" clearable>
            <el-option
              v-for="item in pageType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择项" prop="chooseItem">
          <el-select
            v-model="searchForm.chooseItem"
            placeholder="请选择"
            :disabled="disabled"
            clearable
          >
            <el-option
              v-for="item in obj"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="myReset('collection')">重置</el-button>
          <el-button type="primary" native-type='submit' @click="(e) => onSubmit(e)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-container">
      <ajax-table
        :tableData="tableData"
        :list="list"
        :isPager="true"
        :listState="listState"
        @currentChange="handleCurrentChange"
        @sizeChange="handleSizeChange"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script>
import { travelStatus } from "../config";
import { questionCollection } from "@/api/api";
import event from "@/mixins/common";
export default {
  name: "ExtendPagesCollection",
  data() {
    return {
      travelStatus: travelStatus,
      pageType: {
        1: { label: "子女教育", value: 1 },
        2: { label: "医疗保健", value: 2 },
        3: { label: "家属安居", value: 3 },
        4: { label: "人才公寓", value: 4 }
      },
      EducationLevel: {
        1: { label: "未入学", value: 1 },
        2: { label: "幼儿园", value: 2 },
        3: { label: "小学", value: 3 },
        4: { label: "初中", value: 4 },
        5: { label: "高中", value: 5 },
        6: { label: "大学本科", value: 6 },
        7: { label: "硕士", value: 7 },
        8: { label: "博士", value: 8 }
      },
      medicalCareLevel: {
        1: { label: "公费医疗", value: 1 },
        2: { label: "劳保医疗", value: 2 },
        3: { label: "合作医疗", value: 3 },
        4: { label: "医疗保险", value: 4 },
        5: { label: "自费医疗", value: 5 }
      },
      familyLevel: {
        1: { label: "1人", value: 1 },
        2: { label: "2人", value: 2 },
        3: { label: "3人", value: 3 },
        4: { label: "3人以上", value: 4 }
      },
      houseLevel: {
        1: { label: "单身公寓55平方米", value: 1 },
        2: { label: "居家式80平方米", value: 2 },
        3: { label: "居家式125平方米", value: 3 }
      },
      obj: {},
      val: 0,
      disabled: true,
      searchForm: {
        pageType: "",
        chooseItem: ""
      }
    };
  },
  created() {
    this.tableData = {
      id: "fid",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        {
          label: "页面",
          prop: "pageType",
          type: "status",
          statusMap: this.pageType
        },
        { label: "对应项", prop: "relateItem" },
        { label: "选择项", prop: "chooseItem" },
        { label: "问题描述", prop: "proDescribe", tips: true },
        { label: "提交人", prop: "name" },
        { label: "提交时间", prop: "submitDate" }
      ]
    };
    this.getTableList();
  },
  mounted() {},
  mixins: [event],
  methods: {
    async getTableList() {
      const params = {
        ...this.searchForm,
        ...this.listState
      };
      delete params.total;
      // 调用接口
      try {
        this.loading = true;
        const res = await questionCollection(params);
        this.list = res.data || [];
        this.listState = {
          ...this.listState,
          total: res.total
        };
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    myReset(val) {
      this.$refs[val].resetFields();
      this.listState = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      };
      this.getTableList();
    },
    onSubmit(e) {
      // enter el-form键阻止冒泡
      e.stopPropagation()
      e.preventDefault()
      this.listState = {
        ...this.listState,
        pageNum: 1
      };
      this.getTableList();
    },
    onchange(val) {
      this.val = val;
    }
  },
  watch: {
    val(newVal) {
      newVal ? (this.disabled = false) : (this.disabled = true);
      if (newVal == 1) {
        this.obj = this.EducationLevel;
        this.searchForm.chooseItem = "";
      } else if (newVal == 2) {
        this.obj = this.medicalCareLevel;
        this.searchForm.chooseItem = "";
      } else if (newVal == 3) {
        this.obj = this.familyLevel;
        this.searchForm.chooseItem = "";
      } else if (newVal == 4) {
        this.obj = this.houseLevel;
        this.searchForm.chooseItem = "";
      }else{
        this.searchForm.chooseItem = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.search-form-container {
  display: flex;
  background-color: #fff;
  padding: 10px;
}
</style>
