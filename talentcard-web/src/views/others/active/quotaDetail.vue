<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <div class="top-menu">
          <div class="top-title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/other/active' }">人才活动</el-breadcrumb-item>
              <el-breadcrumb-item>查看报名信息</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="btns"></div>
        </div>
        <div class="homepageTitle"></div>
      </section>
      <ajax-form :formData="formData" />
      <div class="infos">
        <div>
          活动名称:
          <span>{{ details.name }}</span>
        </div>
        <div>
          活动编号:
          <span>{{ details.num }}</span>
        </div>
        <div>
          活动名额:
          <span v-if="details.ifQuota == 1">{{ details.maleQuota + details.femaleQuota }}</span>
          <span v-else>{{ details.eventQuota }}</span>人
        </div>
        <div>
          已报名人数:
          <span
            v-if="details.ifQuota == 1"
          >{{ details.currentNum }}(男{{details.currentMale || '0'}}人，女{{details.currentFemale || "0"}}人)</span>
          <span v-else>{{ details.currentNum || '0' }}人</span>
        </div>
      </div>
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
import {
  getTalentInfoQuery,
  getEventIdDetailsApi,
  talentInfoExport,
} from "@/api/api";
import event from "@/mixins/common";
import { sexConfig, talentStatus } from "./config";
export default {
  props: {},
  data() {
    return {
      rowId: "",
      details: {},
      sexConfig,
      talentStatus,
    };
  },
  created() {
    this.tableData = {
      id: "scenicId",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "姓名", prop: "name" },
        {
          label: "性别",
          prop: "sex",
          type: "status",
          statusMap: this.sexConfig,
        },
        { label: "工作单位", prop: "workLocation" },
        { label: "手机号码", prop: "phone" },
        { label: "人才卡", prop: "talentCard" },

        {
          label: "状态",
          prop: "status",
          type: "status",
          statusMap: this.talentStatus,
        },
        { label: "提交时间", prop: "createTime" },
        {
          label: "操作",
          type: "handle",
          width: "220",
          handles: [
            {
              fn: (index, row) => this.goDetail(row.openId),
              type: "text",
              text: "查看",
            },
          ],
        },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "姓名",
          type: "input",
          key: "name",
          placeholder: "请输入",
        },
        {
          label: "工作单位",
          type: "input",
          key: "workUnit",
          placeholder: "请输入",
        },
        {
          label: "性别",
          type: "select",
          key: "sex",
          placeholder: "请选择",
          option: this.sexConfig,
        },
        {
          label: "状态",
          type: "select",
          key: "status",
          placeholder: "请选择",
          option: this.talentStatus,
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
              type: "",
              text: "导出EXCEL",
              fn: (row) => {
                this.export(row);
              },
            },
          ],
        },
      ],
    };
    this.rowId = this.$route.params.id || "";
    if (this.rowId) {
      this.getEventIdDetails(this.rowId);
    }
    this.getTableList();
  },
  mounted() {},
  mixins: [event],
  methods: {
    async export() {
      try {
        const params = {
          eventId: this.rowId,
          ...this.searchForm,
        };
        await talentInfoExport('报名信息', params);
      } catch (e) {}
    },
    async getTableList() {
      const params = {
        ...this.searchForm,
        ...this.listState,
        eventId: this.rowId,
      };
      delete params.total;
      // 调用接口
      try {
        this.loading = true;
        const res = await getTalentInfoQuery(params);
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
    async getEventIdDetails(id) {
      try {
        const params = {
          eventId: id,
        };
        const res = await getEventIdDetailsApi(params);
        this.details = {
          ...res,
        };
      } catch (e) {}
    },
    goDetail(id) {
      if (id) {
        let origin = window.location.href.split('/#/')[0]
        let url = origin + '/#/ViewTalent?openId=' + id
        window.open(url);
      } else {
        this.$message.error("无效ID");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.infos {
  display: flex;
  justify-content: flex-start;
  margin: -20px 0 0;
  line-height: 3;
  & > div {
    margin-right: 20px;
    color: #666;
  }
}
</style>
