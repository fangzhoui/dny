<template>
  <div style="width:100%">
    <el-row class="subtitleRow">
      <div class="blue"></div>
      <span class="subtitle">审批记录</span>
    </el-row>
    <el-table :data="applyRecord" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="50px" />
      <el-table-column prop="type" label="类型" align="center" :formatter="keytostring" />
      <el-table-column prop="createTime" label="提交时间" align="center" />
      <el-table-column prop="name" label="审批人" align="center" :formatter="nullFormatter" />
      <el-table-column prop="cardName" label="人才卡" align="center" :formatter="cardFormatter" />
      <el-table-column
        prop="category"
        label="人才类别"
        :show-overflow-tooltip="true"
        align="center"
        :formatter="categoryFormatter"
      />
      <el-table-column prop="result" label="审批结果" align="center" :formatter="keytostring" />
      <el-table-column prop="opinion" label="审批意见" align="center" :formatter="nullFormatter" />
    </el-table>
  </div>
</template>

<script>
import { tableFormater } from "../../../utils/config";
import { talenttypes, categoryFormatterFn } from "../format";
import { mapState, mapActions,mapGetters } from "vuex";
export default {
  props: {
    applyRecord: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      categories: (state) => state.options.categories,
    }),
  },
  methods: {
    keytostring(row, column, cellValue) {
      if (!cellValue) {
        return "无";
      } else {
        if (column.property == "type") {
          return tableFormater(cellValue, "recordTypes");
        }
        if (column.property == "result") {
          return tableFormater(cellValue, "states");
        }
      }
    },
    nullFormatter(row, column, cellValue) {
      if (!cellValue) {
        return "无";
      } else {
        return cellValue;
      }
    },
    cardFormatter(row, column, cellValue) {
      if (row.cardName) {
        return row.cardName;
      }
      if (row.cinitialWord && row.ctitle) {
        return row.ctitle + "/" + row.cinitialWord;
      } else {
        return "无";
      }
    },
    categoryFormatter(row, column, cellValue) {
      console.log(row.category);
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
  },

  filters: {},
  created() {},
};
</script>

<style scoped>
.subtitle {
  font-size: 14px;
  margin-bottom: 15px;
}
.blue {
  content: "";
  display: inline-block;
  width: 4px;
  height: 18px;
  vertical-align: bottom;
  margin-right: 10px;
  background: rgba(0, 145, 231, 1);
  border-radius: 4px;
}
</style>
