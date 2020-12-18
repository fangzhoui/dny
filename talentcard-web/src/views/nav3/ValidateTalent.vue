<template>
  <div>
    <!--title-->
    <div class="titlewrapper">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">认证人才</div>
        <div class="homepageTitle"></div>
      </section>
      <ajax-form :formData="formData" />
    </div>
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
</template>

<script>
import { queryCertTalent, peopleExporExcel } from "../../api/api";
import { titles, qualities, educations, sexs } from "../../utils/config";
import { mapState, mapGetters, mapActions } from "vuex";
import { filterData } from "../../utils/config";
import event from "@/mixins/common";
export default {
  data() {
    return {
      titles,
      qualities,
      educations,
      sexs,
    };
  },
  mixins: [event],
  computed: {
    ...mapGetters([
      "canUserCategories",
      "canUserHonours",
      "sortCategories",
      "sortHonours",
    ]),
    ...mapState({
      honours: (state) => state.options.honours,
      categories: (state) => state.options.categories,
    }),
  },
  created() {
    (this.tableData = {
      id: "validateTalent",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "姓名", prop: "name" },
        { label: "性别", prop: "sex", type: "status", statusMap: this.sexs },
        {
          label: "学历",
          prop: "educ",
          text: (row) => this.educfilter(row),
          tips: true,
        },
        {
          label: "人才荣誉",
          prop: "honour",
          text: (row) => this.honourfilter(row),
          tips: true,
        },
        {
          label: "职称",
          prop: "title",
          text: (row) => this.titlefilter(row),
          tips: true,
        },
        {
          label: "职业资格",
          prop: "quality",
          text: (row) => this.qualityfilter(row),
          tips: true,
        },
        {
          label: "人才卡",
          text: (row) => row.ctitle + "/" + row.cinitialWord,
          minWidth: 100,
        },
        {
          label: "人才类别",
          prop: "category",
          text: (row) => this.categoryfilter(row),
          tips: true,
        },
        { label: "注册时间", prop: "ctime", minWidth: 100 },
        {
          label: "操作",
          type: "handle",
          width: "300",
          handles: [
            {
              fn: (index, row) => this.handleView(row),
              type: "text",
              text: "查看",
            },
          ],
        },
      ],
    }),
      (this.formData = {
        id: "searchForm",
        arr: [
          { label: "姓名", type: "input", key: "name", placeholder: "请输入" },
          { label: "性别", type: "select", key: "sex", option: this.sexs },
          {
            label: "学历",
            type: "select",
            key: "educ",
            option: this.educations,
          },
          {
            label: "人才荣誉",
            type: "select",
            key: "honour",
            option: this.sortHonours,
          },
          { label: "职称", type: "select", key: "title", option: this.titles },
          {
            label: "职业资格",
            type: "select",
            key: "quality",
            option: this.qualities,
          },
          {
            label: "人才卡",
            type: "input",
            key: "card",
            placeholder: "请输入",
          },
          {
            label: "人才类别",
            type: "select",
            key: "category",
            option: this.sortCategories,
          },
          { label: "开始时间", type: "date-picker", key: "start" },
          { label: "结束时间", type: "date-picker", key: "end" },
          {
            label: "",
            type: "button",
            key: "",
            handles: [
              { type: "primary", text: "查询", fn: (row) => this.search(row) },
              {
                type: "",
                text: "重置",
                event: "reset",
                fn: (row) => this.reset(row),
              },
              {
                type: "primary",
                text: "导出",
                fn: (row) => this.exportPeople(row),
              },
            ],
          },
        ],
      });
    this.getTableList();
  },
  methods: {
    ...mapActions(["getHonours", "getCategories"]),
    async getTableList() {
      let para = {
        ...this.searchForm,
        ...this.listState,
      };
      delete para.total;
      try {
        this.loading = true;
        const res = await queryCertTalent(para);
        this.list = res.data;
        this.listState = {
          ...this.listState,
          total: res.total,
        };
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    handleView(row) {
      let origin = window.location.href.split(/\/(.)?\#\//)[0];
      let url = origin + "/#/ViewTalent?openId=" + row.openId;
      window.open(url);
    },
    cardfilter(row) {
      if (row.ctitle && row.cinitialWord) {
        return `${row.ctitle}/${row.cinitialWord}`;
      }
      if (row.ctitle) {
        return row.ctitle;
      }
      return "无";
    },
    categoryfilter(row) {
      if (!row.category) {
        return "无";
      } else {
        let arr = [];
        row.category.split(",").forEach((item) => {
          for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].value == item) {
              arr.push(this.categories[i].label);
            }
          }
        });
        return arr + "";
      }
    },
    educfilter(row) {
      if (row.educ) {
        let educList = row.educ.split(",");
        let output = educList.reduce(function (total, currentValue) {
          return total + "," + filterData("educations", currentValue);
        }, "");
        output = output.substr(1);
        return output;
      } else {
        return "无";
      }
    },
    qualityfilter(row) {
      if (row.quality) {
        let qualityList = row.quality.split(",");
        let output = qualityList.reduce(function (total, currentValue) {
          return total + "," + filterData("qualities", currentValue);
        }, "");
        output = output.substr(1);
        return output;
      } else {
        return "无";
      }
    },
    titlefilter(row) {
      if (row.title) {
        let titleList = row.title.split(",");
        let output = titleList.reduce(function (total, currentValue) {
          return total + "," + filterData("titles", currentValue);
        }, "");
        output = output.substr(1);
        return output;
      } else {
        return "无";
      }
    },
    honourfilter(row) {
      if (!row.honour || row.honour == 0) {
        return "无";
      } else {
        let arr = [];
        row.honour.split(",").forEach((item) => {
          for (let i = 0; i < this.honours.length; i++) {
            if (this.honours[i].value == item) {
              arr.push(this.honours[i].label);
            }
          }
        });
        return arr + "";
      }
    },
    async exportPeople() {
      let myDate = new Date();
      let name = "认证人才信息" + myDate.toLocaleDateString();
      await peopleExporExcel(name);
    },
  },
};
</script>

<style scoped>
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}
.dialogDivider {
  margin-top: -20px;
}

.titlewrapper {
  background-color: white;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
}
.title {
  padding: 0px;
}
.pagination {
  background-color: white;
  padding: 0;
  margin: 0;
}
.dialogwrapper {
  display: block;
  clear: both;
  width: 100%;
  background: red;
}
</style>
