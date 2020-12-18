<template>
  <div>
    <qrcodeDownloader
      :dialogState="qrdialogVisible"
      :id="rowId.toString()"
      @closed="closed"
      type="farmhouse"
    ></qrcodeDownloader>
    <div class="view-header-container">
      <section class="title">
        <div class="top-menu">
          <div class="top-title">农家乐</div>
          <div class="btns">
            <el-button
              type="primary"
              @click="addTravel"
              class="top-button"
              v-permission="'farmHouseCreate'"
            >新建农家乐</el-button>
            <el-button
              type="primary"
              class="top-button"
              @click="seeData"
              v-permission="'farmHouseDataQuery'"
            >数据查看</el-button>
            <el-button
              type="primary"
              class="top-button"
              @click="setAboutConfig"
              v-permission="'farmHouseSetRelatedInfo'"
            >配置关于信息</el-button>
          </div>
        </div>
        <div class="homepageTitle"></div>
      </section>
      <ajax-form :formData="formData" />
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
import { travelStatus } from "../../config";
import { getFarmhouseList, changeFarmhouseStatusApi } from "@/api/api";
import event from "@/mixins/common";
import downLoadEvent from "@v/nav4/mixin";
import { mapState, mapActions, mapGetters } from "vuex";
import qrcodeDownloader from "../../../../components/qrcodeDownloader";

export default {
  name: "ExtendPagesAgritainPage",
  props: {},
  components: {
    qrcodeDownloader,
  },
  data() {
    return {
      travelStatus: travelStatus,
      dialogVisible: false,
      qrdialogVisible: false,
      rowId: "",
    };
  },
  computed: {
    ...mapState({
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
  },
  created() {
    this.tableData = {
      id: "farmhouseId",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "农家乐名称", prop: "name" },
        { label: "农家乐ID", prop: "farmhouseId", width: 80 },
        { label: "优惠折扣", prop: "discount" },
        {
          label: "状态",
          prop: "status",
          type: "status",
          statusMap: this.travelStatus,
        },
        { label: "创建时间", prop: "ctime" },
        {
          label: "操作",
          type: "handle",
          width: "300",
          handles: [
            {
              fn: (index, row) => this.changeScenicStatus(row),
              type: "text",
              text: (row) => (row.status == 1 ? "下架" : "上架"),
              show: (row) => this.jurisdiction.farmHouseEdit == 1,
            },
            {
              fn: (index, row) => this.readTravel(row),
              type: "text",
              text: "查看",
            },
            {
              fn: (index, row) => this.editTravel(row),
              type: "text",
              show: (row) => row.status == 2,
              text: "编辑",
              show: (row) => this.jurisdiction.farmHouseEdit == 1,
            },
            {
              fn: (index, row) => this.openQrDialog(row),
              type: "text",
              text: "二维码下载",
            },
          ],
        },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "农家乐名称",
          type: "input",
          key: "name",
          placeholder: "请输入",
        },
        {
          label: "状态",
          type: "select",
          key: "status",
          option: this.travelStatus,
        },
        { label: "开始时间", type: "date-picker", key: "start" },
        { label: "结束时间", type: "date-picker", key: "end" },
        {
          label: "",
          type: "button",
          key: "",
          handles: [
            {
              type: "",
              text: "重置",
              event: "reset",
              fn: (row) => this.reset(row),
            },
            { type: "primary", text: "查询", fn: (row) => this.search(row) },
          ],
        },
      ],
    };
    this.getTableList();
  },
  mounted() {},
  mixins: [event, downLoadEvent],
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
        const res = await getFarmhouseList(params);
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
    addTravel() {
      this.$router.push({ path: "/extend/agritainment/addoredit" });
    },
    readTravel(row) {
      this.$router.push({
        path: "/extend/agritainment/read",
        query: {
          id: row.farmhouseId,
        },
      });
    },
    editTravel(row) {
      this.$router.push({
        path: "/extend/agritainment/addoredit",
        query: {
          id: row.farmhouseId,
        },
      });
    },
    setAboutConfig() {
      this.$router.push("/extend/agritainment/about");
    },
    seeData() {
      this.$router.push("/extend/agritainment/dataview");
    },
    async changeScenicStatus(row) {
      try {
        const params = {
          farmhouseId: row.farmhouseId,
          status: row.status == 1 ? 2 : 1,
        };
        const title = row.status == 1 ? "下架操作" : "上架操作";
        const tip = row.status == 1 ? "下架成功" : "上架成功";
        const message =
          row.status == 1
            ? "是否确定下架此农家乐？下架后用户将无法享受此农家乐的权益。"
            : "是否确定上架此农家乐？上架后用户可扫码享受权益。";
        await this.$alert(message, title, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        await changeFarmhouseStatusApi(params);
        await this.getTableList();
        this.$message.success(tip);
      } catch (e) {}
    },
    downLoad(url, name = "二维码") {
      this.downloadIamge(url, name);
    },
    setConfig() {
      this.dialogVisible = true;
    },
    configClose() {
      this.dialogVisible = false;
    },
    openQrDialog(row) {
      this.rowId = row.farmhouseId;
      this.qrdialogVisible = true;
    },
    closed() {
      this.qrdialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped></style>
