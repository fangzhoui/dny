<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">操作日志</div>
        <div class="homepageTitle"></div>
      </section>
      <el-form
        ref="collection"
        :model="searchForm"
        label-width="80px"
        class="search-form-container"
      >
        <el-form-item label="操作人" prop="user_name">
          <el-input v-model="searchForm.user_name" placeholder="请输入" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="一级页面" prop="first_menu">
          <el-select
            v-model="searchForm.first_menu"
            placeholder="请选择"
            @change="onchange"
            clearable
            class="input-width"
          >
            <el-option
              v-for="item in pageType"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级页面" prop="second_menu">
          <el-select
            class="input-width"
            v-model="searchForm.second_menu"
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
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="searchForm.start_time"
            class="input-width"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="searchForm.end_time"
            class="input-width"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item class="item_button">
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
import { queryJournal } from "@/api/api";
import event from "@/mixins/common";
import { formatTime } from "@/utils";
import {
  pageType,
  EducationLevel,
  medicalCareLevel,
  familyLevel,
  houseLevel,
  extendLevel,
  pagLevel,
  others
} from "./roleConfig";
export default {
  data() {
    return {
      pageType,
      EducationLevel,
      medicalCareLevel,
      familyLevel,
      houseLevel,
      extendLevel,
      pagLevel,
      others,
      obj: {},
      val: 0,
      disabled: true,
      searchForm: {
        first_menu: "",
        second_menu: "",
        user_name: "",
        start_time: "",
        end_time: "",
      },
    };
  },
  created() {
    this.tableData = {
      id: "fid",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "操作人", prop: "user_name" },
        { label: "一级页面", prop: "first_menu" },
        { label: "二级页面", prop: "second_menu" },
        { label: "详情", prop: "detail", tips: true, },
        { label: "操作时间", prop: "create_time" },
      ],
    };
    this.getTableList();
  },
  mounted() {},
  mixins: [event],
  methods: {
    async getTableList() {
      const params = {
        ...this.searchForm,
        ...this.listState,
      };
      delete params.total;
      // 调用接口
      try {
        this.loading = true;
        const res = await queryJournal(params);
        console.log(res);
        this.list = res.data || [];
        this.listState = {
          ...this.listState,
          total: res.total,
        };
      } catch (e) {
        console.log(e, 111);
      } finally {
        this.loading = false;
      }
    },
    myReset(val) {
      this.$refs[val].resetFields();
      this.listState = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      this.getTableList();
    },
    onSubmit(e) {
      //先判断是否是时间格式 在对时间进行处理
      // enter el-form键阻止冒泡
      e.stopPropagation()
      e.preventDefault()
      this.listState = {
        ...this.listState,
        pageNum: 1,
      };
      this.getTableList();
    },
    onchange(val) {
      this.val = val;
    },
  },
  watch: {
    val(newVal) {
      newVal ? (this.disabled = false) : (this.disabled = true);
      if (newVal == "系统管理") {
        this.obj = this.EducationLevel;
        this.searchForm.second_menu = "";
      } else if (newVal == "卡片管理") {
        this.obj = this.medicalCareLevel;
        this.searchForm.second_menu = "";
      } else if (newVal == "人才管理") {
        this.obj = this.familyLevel;
        this.searchForm.second_menu = "";
      } else if (newVal == "人才政策管理") {
        this.obj = this.houseLevel;
        this.searchForm.second_menu = "";
      } else if (newVal == "扩展功能") {
        this.obj = this.extendLevel;
        this.searchForm.second_menu = "";
      } else if (newVal == "人才标签管理") {
        this.obj = this.pagLevel;
        this.searchForm.second_menu = "";
      } else if (newVal == "其他服务") {
        this.obj = this.others;
        this.searchForm.second_menu = "";
      } else {
        this.searchForm.second_menu = "";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search-form-container {
  background-color: #fff;
  padding-top: 15px;
}
.input-width {
  width: 202px !important;
  box-sizing: border-box;
}
.el-form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.item_button /deep/ .el-form-item__content {
  margin-left: 0 !important;
}
</style>
