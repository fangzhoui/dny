<template>
  <div class="my-box">
    <ajax-form :formData="formData" />
    <div class="deep-line"></div>
    <ajax-table
      :tableData="tableData"
      :list="list"
      :isPager="true"
      :listState="listState"
      @currentChange="handleCurrentChange"
      @sizeChange="handleSizeChange"
      :loading="loading"
    />
    <el-dialog title="取消" :visible.sync="dialogVisible" :close-on-click-modal="false" width="500px">
      <p class="tip-content">是否确定取消该活动？当前活动报名人数为{{num}}人，请填写取消原因，取消后会微信通知已报名人才。</p>
      <el-form :model="form" ref="cancelForm" label-width="96px" class="demo-dynamic">
        <el-form-item
          :label="'取消原因'"
          prop="opinion"
          :rules="{
            required: true, message: '取消原因不能为空', trigger: 'blur'
          }"
        >
          <el-input
            type="textarea"
            v-model="form.opinion"
            placeholder="请输入取消原因"
            :rows="4"
            show-word-limit
            maxlength="200"
          ></el-input>
          <p class="tip">操作成功后将会通知已报名用户</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('cancelForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="取消"
      :visible.sync="xcxdialogVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <p class="tip-content">是否确定取消该活动？该活动为第三方发起，请填写取消原因，取消后会微信通知活动发起人。</p>
      <el-form :model="form" ref="xcxcancelForm" label-width="96px">
        <el-form-item
          :label="'取消原因'"
          prop="opinion"
          :rules="{
            required: true, message: '取消原因不能为空', trigger: 'blur'
          }"
        >
          <el-input
            type="textarea"
            v-model="form.opinion"
            placeholder="请输入取消原因"
            :rows="4"
            show-word-limit
            maxlength="200"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="xcxdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('xcxcancelForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import event from "@/mixins/common";
import {
  activityStatus,
  approvalStatus,
  activityType,
  getTimesArr,
} from "../config";
import {
  getActivityList,
  getNumByEventId,
  othersActivityUpDown,
  othersActivityCancel,
} from "@/api/api";
import { mapState, mapActions, mapGetters } from "vuex";
import { Loading } from "element-ui";
export default {
  mixins: [event],
  data() {
    return {
      dialogVisible: false,
      xcxdialogVisible: false,
      statusMap: Object.assign({}, activityStatus, approvalStatus),
      form: {
        opinion: "",
        eventId: "",
        type: "",
      },
      num: 0,
    };
  },
  computed: {
    ...mapState({
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
  },
  created() {
    const formatActivityStatus = this.formatStatus();
    this.tableData = {
      id: "eqId",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        {
          label: "活动名称",
          prop: "name",
          type: "event",
          style: { color: "#409eff" },
          fn: (index, row) =>
            this.goDetail({
              type: 1,
              xcx: row.type == 1 ? 1 : 0,
              id: row.eventId,
            }),
          tips: true,
        },
        {
          label: "活动时间",
          prop: "eventTime",
          text: (row) => this.forTime(row),
          tips: false,
        },
        {
          label: "活动类型",
          prop: "type",
          type: "status",
          statusMap: activityType,
        },
        {
          label: "状态",
          prop: "actualStatus",
          type: "status",
          statusMap: this.statusMap,
          style: (row) => {
            if (
              row.actualStatus == 6 ||
              row.actualStatus == 2 ||
              row.actualStatus == 9
            ) {
              return {
                color: "#008000a5",
              };
            }
            if (row.actualStatus == 4 || row.actualStatus == 5) {
              return {
                color: "#ff0000a5",
              };
            }
            return {};
          },
        },
        { label: "提交时间", prop: "createTime" },
        {
          label: "操作",
          type: "handle",

          handles: [
            {
              fn: (index, row) => this.activityFlag(row, 0),
              type: "text",
              show: (row) =>
                row.type == 2 &&
                (row.actualStatus == 6 ||
                  row.actualStatus == 7 ||
                  row.actualStatus == 4) &&
                this.jurisdiction.eventEdit == 1,
              text: "下架",
            },
            {
              fn: (index, row) => this.activityFlag(row, 1),
              type: "text",
              show: (row) =>
                row.actualStatus == 8 && this.jurisdiction.eventEdit == 1,
              text: "上架",
            },
            {
              fn: async (index, row) => this.showCancel(row),
              type: "text",
              show: (row) =>
                (row.actualStatus == 6 || row.actualStatus == 2) &&
                this.jurisdiction.eventEdit == 1,
              text: "取消",
            },
            {
              fn: (index, row) => this.goDetail({ type: 2, id: row.eventId }),
              type: "text",
              show: (row) =>
                row.actualStatus == 8 && this.jurisdiction.eventEdit == 1,
              text: "编辑",
            },
          ],
        },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "活动名称",
          type: "input",
          key: "name",
          placeholder: "请输入",
          tips: true,
        },
        {
          label: "活动类型",
          type: "select",
          key: "type",
          placeholder: "请输入",
          option: activityType,
        },
        {
          label: "状态",
          type: "select",
          key: "status",
          placeholder: "请输入",
          option: formatActivityStatus,
        },
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
              text: "+ 新增加人才活动",
              fn: (row) =>
                this.goDetail({
                  type: 0,
                }),
              show: this.jurisdiction.eventAdd == 1,
            },
          ],
        },
      ],
    };
    this.getTableList();
  },
  methods: {
    formatStatus() {
      return [
        { label: "报名中", value: 6 },
        { label: "活动进行中", value: 10 },
        { label: "已通过", value: 2 },
        { label: "已结束", value: 7 },
        { label: "管理员取消", value: 4 },
        { label: "用户取消", value: 5 },
        { label: "已下架", value: 8 },
      ];
    },
    async getTableList() {
      const params = {
        ...this.searchForm,
        ...this.listState,
      };
      delete params.total;
      // 调用接口
      try {
        this.loading = true;
        const res = await getActivityList(params);
        const { data = [] } = res;
        this.list = data;
        this.listState = {
          ...this.listState,
          total: res.total,
        };
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    forTime({ eventTime = "", date = "" }) {
      if (!eventTime) {
        return "-";
      }
      let nDate = date.split(" ")[0];
      let timeArr = eventTime.split(",") || [];
      const timeStr = getTimesArr(timeArr);
      return `${nDate}  ${timeStr}`;
    },
    goDetail(row) {
      this.$router.push({
        path: "/other/active/detail",
        query: {
          ...row,
        }
      });
    },
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const params = {
              ...this.form,
            };
            await othersActivityCancel(params);
            this.dialogVisible = false;
            this.xcxdialogVisible = false;
            this.getTableList();
            this.$message.success("取消成功");
          } catch (e) {}
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    activityFlag(row, flag) {
      const h = this.$createElement;
      const message = !flag
        ? h("div", null, [
            h(
              "p",
              null,
              "是否确定下架该活动？下架后用户将无法查看并报名，已经报名的用户不受影响。"
            ),
            h(
              "p",
              { style: "color: #FF9900" },
              "注意：如果该活动将会如期举行，请下架编辑后及时上架。"
            ),
          ])
        : h("p", null, "是否确定上架该活动？上架后用户可查看并报名。");
      this.$msgbox({
        title: !flag ? "下架" : "上架",
        message: message,
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            await othersActivityUpDown({
              eventId: row.eventId,
              upDown: !flag ? 2 : 1,
            });
            this.getTableList();
            done();
            instance.confirmButtonLoading = false;
          } else {
            done();
          }
        },
      }).then(() => {});
    },
    async getNum(row) {
      let loadingInstance = Loading.service({
        fullscreen: true,
        customClass: "zZindex",
      });
      try {
        this.num = await getNumByEventId({
          eventId: row.eventId,
        });
        this.dialogVisible = true;
        this.$refs.cancelForm && this.$refs.cancelForm.resetFields();
        this.$set(this.form, "eventId", row.eventId);
        this.$set(this.form, "type", row.type);
      } catch (e) {
      } finally {
        loadingInstance.close();
      }
    },
    async showCancel(row) {
      if (row.type == 1) {
        this.xcxdialogVisible = true;
        this.$refs.cancelForm && this.$refs.xcxcancelForm.resetFields();
        this.$set(this.form, "eventId", row.eventId);
        this.$set(this.form, "type", row.type);
      } else {
        await this.getNum(row);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tip-content {
  font-size: 14px;
  color: #333;
  line-height: 22px;
  margin-top: -22px;
  margin-bottom: 22px;
}
.tip {
  font-size: 10px;
  color: #999;
  line-height: 22px;
}
</style>