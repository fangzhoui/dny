<template>
  <div style="width:100%">
    <el-row class="subtitleRow">
      <div class="blue"></div>
      <span class="subtitle">操作记录</span>
    </el-row>
    <el-table :data="applyRecord" style="width: 100%" @cell-click="cellClick">
      <el-table-column type="index" label="序号" align="center" width="50px" />
      <el-table-column prop="cert_type" label="操作类型" align="center" width="180px" />
      <el-table-column prop="operation_content" label="操作前" align="center" width="320px">
        <template slot-scope="props">
          <span
            v-if="props.row.operation_content == 5 || props.row.operation_content == 7 || props.row.operation_content == 8"
          >{{ cardFormatter(props.row) }}</span>
          <span class="blue_column" v-else>{{ cardFormatter(props.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation_content" label="操作后" align="center" width="320px">
        <template slot-scope="props">
          <span
            v-if="props.row.operation_content == 5 || props.row.operation_content == 7 || props.row.operation_content == 8"
          >{{ categoryFormatter(props.row) }}</span>
          <span class="blue_column" v-else>{{ categoryFormatter(props.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="comment"
        label="操作原因"
        align="center"
        :formatter="nullFormatter"
        show-overflow-tooltip
        width="320px"
      />
      <el-table-column
        prop="user_name"
        label="操作人"
        align="center"
        :formatter="nullFormatter"
        width="150px"
      />
      <el-table-column prop="create_time" label="操作时间" align="center" width="200px" />
    </el-table>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <edu-dialog
        :detailform.sync="detailform"
        :dialogVisible="dialogVisible"
        @closeDialogVisible="closeDialogVisible"
        v-if="content ==1"
      ></edu-dialog>
      <honour-dialog
        :detailform.sync="detailform"
        :dialogVisible="dialogVisible"
        @closeDialogVisible="closeDialogVisible"
        v-if="content ==4"
      ></honour-dialog>
      <title-dialog
        :detailform.sync="detailform"
        :dialogVisible="dialogVisible"
        @closeDialogVisible="closeDialogVisible"
        v-if="content ==2"
      ></title-dialog>
      <quality-dialog
        :detailform.sync="detailform"
        :dialogVisible="dialogVisible"
        @closeDialogVisible="closeDialogVisible"
        v-if="content ==3"
      ></quality-dialog>
      <basic-dialog
        :detailform.sync="detailform"
        :dialogVisible="dialogVisible"
        @closeDialogVisible="closeDialogVisible"
        v-if="content ==6"
      ></basic-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { tableFormater } from "../../utils/config";
import { talenttypes, categoryFormatterFn } from "../../views/nav3/format";
import EduDialog from "./edu";
import HonourDialog from "./honour";
import TitleDialog from "./title";
import QualityDialog from "./quality";
import BasicDialog from "./basic";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  components: {
    EduDialog,
    HonourDialog,
    TitleDialog,
    QualityDialog,
    BasicDialog,
  },
  props: {
    applyRecord: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      operationContent: [
        "学历",
        "职称类型",
        "职业资格",
        "人才荣誉",
        "人才类别",
        "基本信息",
        "人才卡",
      ],
      operationType: ["新增", "删除", "修改"],
      dialogVisible: false,
      detailform: {}, //操作前对象
      dialogTitle: "", // 弹出框标题
      content: 0, // 弹框类型
    };
  },
  computed: {
    ...mapState({
      categories: (state) => state.options.categories,
    }),
    closeDialogVisible: function () {
      let that = this;
      return function (val) {
        that.dialogVisible = val;
      };
    },
  },
  methods: {
    nullFormatter(row, column, cellValue) {
      if (!cellValue) {
        return "无";
      } else {
        return cellValue;
      }
    },
    cardFormatter(row) {
      console.log("rowbef", row);
      if (row.operation_content == 7) {
        return row.before_json.title + "/ " + row.before_json.initialWord;
      }
      if (row.operation_content == 5) {
        if (!row.before_json.category) {
          return "无";
        }
        var arr = [];
        row.before_json.category.split(",").forEach((item) => {
          for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].value == item) {
              arr.push(this.categories[i].label);
            }
          }
        });
        return arr.join();
      }
      if (row.operation_type == 2) {
        return (
          this.operationType[row.operation_type - 1] +
          this.operationContent[row.operation_content - 1]
        );
      } else if (row.operation_type == 3) {
        return "原" + this.operationContent[row.operation_content - 1];
      }
      if (row.operation_content == 8) {
        return `现工作单位：${row.before_json.workUnit}`;
      }
      return "--";
    },
    categoryFormatter(row) {
      console.log("rowafter", row);
      if (row.operation_content == 7) {
        return row.after_json.title + "/ " + row.after_json.initialWord;
      }
      if (row.operation_content == 5) {
        if (!row.after_json.category) {
          return "无";
        }
        var arr = [];
        row.after_json.category.split(",").forEach((item) => {
          for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].value == item) {
              arr.push(this.categories[i].label);
            }
          }
        });
        return arr.join();
      }
      if (row.operation_type == 3) {
        return "新" + this.operationContent[row.operation_content - 1];
      } else if (row.operation_type == 1) {
        return (
          this.operationType[row.operation_type - 1] +
          this.operationContent[row.operation_content - 1]
        );
      }
      if (row.operation_content == 8) {
        return `现工作单位：${row.after_json.workUnit}`;
      }
      return "--";
    },
    cellClick(row, column, cell, event) {
      if (column.label == "操作前") {
        if (row.operation_content == 7) {
          return;
        }
        if (row.operation_type == 3 || row.operation_type == 2) {
          this.getDialogTitle(row);
          this.detailform = row.before_json;
          this.dialogTitle = this.cardFormatter(row);
        }
      }
      if (column.label == "操作后") {
        if (row.operation_content == 7) {
          return;
        }
        if (row.operation_type == 3 || row.operation_type == 1) {
          this.getDialogTitle(row);
          this.detailform = row.after_json;
          this.dialogTitle = this.categoryFormatter(row);
        }
      }
    },
    getDialogTitle(row) {
      if (row.operation_content != 5) {
        this.dialogVisible = true;
      }
      this.content = row.operation_content;
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
.blue_column {
  color: blue;
}
</style>
<style>
.el-tooltip__popper {
  max-width: 80%;
}
</style>
