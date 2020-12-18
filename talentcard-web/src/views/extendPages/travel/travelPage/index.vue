<template>
  <div>
    <qrcodeDownloader :dialogState="qrdialogVisible" :id="rowId.toString()" @closed="closed"></qrcodeDownloader>
    <div class="view-header-container">
      <section class="title">
        <div class="top-menu">
          <div class="top-title">免费旅游</div>
          <div class="btns">
            <el-button
              type="primary"
              @click="addTravel"
              class="top-button"
              v-permission="'tripCreate'"
            >新建景区</el-button>
            <el-button
              type="primary"
              class="top-button"
              @click="seeData"
              v-permission="'tripDataQuery'"
            >数据查看</el-button>
            <el-button
              type="primary"
              class="top-button"
              @click="setConfig"
              v-permission="'tripSetTripNumber'"
            >配置旅游数量</el-button>
            <el-button
              type="primary"
              class="top-button"
              @click="setAboutConfig"
              v-permission="'tripSetRelatedInfo'"
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
    <set-config v-if="dialogVisible" :dialogVisible="dialogVisible" @close="configClose" />
  </div>
</template>

<script>
import { travelStatus } from "../../config";
import { getScenicList, changeScenicStatusApi } from "@/api/api";
import event from "@/mixins/common";
import downLoadEvent from "@v/nav4/mixin";
import SetConfig from "./setConfig";
import { mapState, mapActions, mapGetters } from "vuex";
import qrcodeDownloader from "../../../../components/qrcodeDownloader";
export default {
  name: "ExtendPagesTravelPage",
  props: {},
  components: {
    SetConfig,
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
      id: "scenicId",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "景区名称", prop: "name" },
        { label: "景区ID", prop: "scenicId", width: 80 },
        // { label: "入园限制", prop: "limit" },
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
              show: (row) => this.jurisdiction.tripEdit == 1,
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
              show: (row) => this.jurisdiction.tripEdit == 1,
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
          label: "景区名称",
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
        const res = await getScenicList(params);
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
      this.$router.push({ path: "/extend/travel/addoredit" });
    },
    readTravel(row) {
      this.$router.push({
        path: "/extend/travel/read",
        query: {
          id: row.scenicId,
        },
      });
    },
    seeData() {
      this.$router.push("/extend/travel/dataview");
    },
    editTravel(row) {
      this.$router.push({
        path: "/extend/travel/addoredit",
        query: {
          id: row.scenicId,
        },
      });
    },
    async changeScenicStatus(row) {
      try {
        const params = {
          scenicId: row.scenicId,
          status: row.status == 1 ? 2 : 1,
        };
        const title = row.status == 1 ? "下架操作" : "上架操作";
        const tip = row.status == 1 ? "下架成功" : "上架成功";
        const message =
          row.status == 1
            ? "是否确定下架此景区？下架后用户将无法享受此景区的免费旅游福利。"
            : "是否确定上架此景区？上架后用户可领取免费旅游福利。";
        await this.$alert(message, title, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        await changeScenicStatusApi(params);
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
    setAboutConfig() {
      this.$router.push("/extend/travel/about");
    },
    configClose() {
      this.dialogVisible = false;
    },
    openQrDialog(row) {
      this.rowId = row.scenicId;
      this.qrdialogVisible = true;
    },
    closed() {
      this.qrdialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped></style>
