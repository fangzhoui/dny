<template>
  <section>
    <!--title-->
    <div class="titlewrapper">
      <section class="title">
        <div class="top-menu">
          <div class="top-title">普通用户</div>
          <div class="btns">
            <el-button type="primary" @click="bacthAuth" class="top-button">批量认证</el-button>
            <el-button class="top-button" @click="goBatchHistory">认证记录</el-button>
          </div>
        </div>
        <div class="homepageTitle"></div>
      </section>
      <!--列表-->
      <ajax-form :formData="formData" />
    </div>
    <!--列表-->
    <ajax-table
      :tableData="tableData"
      :list="list"
      :isPager="true"
      :listState="listState"
      @currentChange="handleCurrentChange"
      @sizeChange="handleSizeChange"
      :loading="loading"
    />

    <batch-upload :show="batchShow" @close="closeBatch" />
    <!--view detaildialog-->
    <el-dialog
      title="普通用户详情"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <el-form :model="detailform" class="demo-form-inline" style="padding-left:40px">
        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">姓名：</el-col>
            <el-col :span="18">{{ detailform.name }}</el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">性别：</el-col>
            <el-col :span="18">{{ detailform.sex | sexFilter }}</el-col>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">政治面貌：</el-col>
            <el-col :span="18">
              {{
              detailform.political | politicalFormat
              }}
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">证件类型：</el-col>
            <el-col :span="18">
              {{ detailform.cardType | cardTypeFormat }}({{
              detailform.idCard ||
              detailform.passport ||
              detailform.driverCard
              }})
            </el-col>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">卡片编号：</el-col>
            <el-col :span="18">{{ detailform.cnum }}</el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">联系电话：</el-col>
            <el-col :span="18">{{ detailform.phone }}</el-col>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">人才来源：</el-col>
            <el-col :span="18">
              {{
              detailform.talentSource | talentSourceFormat
              }}
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">人才荣誉：</el-col>
            <el-col :span="18">{{ honourIdFilter(detailform.honour) }}</el-col>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">学历：</el-col>
            <el-col :span="18">{{ detailform.educ | educationFilter }}</el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">学校：</el-col>
            <el-col :span="18">
              {{ detailform.school ? detailform.school : "无"
              }}{{
              detailform.first == 1
              ? "/学校为“双一流”高校（原985/211高校）"
              : ""
              }}{{ detailform.first == 2 ? "/留学归国" : "" }}
            </el-col>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">专业：</el-col>
            <el-col :span="18">
              {{
              detailform.major ? detailform.major : "无"
              }}
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">毕业时间:</el-col>
            <el-col :span="18">
              {{
              detailform.graduateTime ? detailform.graduateTime : "无"
              }}
            </el-col>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">职称：</el-col>
            <el-col :span="18">{{ detailform.title | titleFilter }}</el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">职业资格信息：</el-col>
            <el-col :span="18">
              {{
              detailform.ptInfo ? detailform.ptInfo : "无"
              }}
            </el-col>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">职业资格：</el-col>
            <el-col :span="18">{{ detailform.quality | qualityFilter }}</el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">职业资格信息：</el-col>
            <el-col :span="18">
              {{
              detailform.pqInfo ? detailform.pqInfo : "无"
              }}
            </el-col>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">现工作单位：</el-col>
            <el-col :span="18">{{ detailform.unit || "无" }}</el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">工作位置：</el-col>
            <el-col :span="18">{{ detailform.workLocation || "无" }}</el-col>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-col :span="6" class="right">所在行业：</el-col>
            <el-col :span="18">
              {{
              detailform.industry | industryFilter
              }}
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="right">注册时间：</el-col>
            <el-col :span="18">{{ detailform.ctime }}</el-col>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button style="float:right" @click="dialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import { talentquery, querytalentdetail } from "../../api/api";
import { mapState, mapActions, mapGetters } from "vuex";
import BatchUpload from "./batchUpload";
import { formatTime } from "@/utils";
import {
  educations,
  sexs,
  titles,
  qualities,
  filterData,
} from "../../utils/config";
import event from "@/mixins/common";
export default {
  data() {
    return {
      batchShow: false,
      dialogVisible: false,
      educations,
      sexs,
      titles,
      qualities,

      detailform: {
        name: "",
        sex: "",
        idCard: "",
        phone: "",
        cnum: "",
        cname: "",
        educ: "",
        school: "",
        first: "",
        major: "",
        title: "",
        ptInfo: "",
        quality: "",
        pqInfo: "",
        industry: "",
        unit: "",
        ctime: "",
        first: "",
        honour: "",
        political: "",
        cardType: "",
        idCard: "",
        passport: "",
        driverCard: "",
      },
    };
  },
  components: {
    BatchUpload,
  },
  mixins: [event],
  computed: {
    ...mapState({
      honours: (state) => state.options.honours,
    }),
    ...mapGetters(["backfillHonours", "sortHonours"]),
    honourIdFilter() {
      return function (val) {
        if(!val){
          return "无"
        }
        for (let i = 0; i < this.honours.length; i++) {
          if (this.honours[i].value == val) {
            return this.honours[i].label;
          }
        }
      };
    },
  },
  created() {
    (this.tableData = {
      id: "ordinaryUsers",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "姓名", prop: "name" },
        { label: "性别", prop: "sex", type: "status", statusMap: this.sexs },
        {
          label: "人才荣誉",
          prop: "honour",
          type: "status",
          statusMap: this.backfillHonours,
        },
        {
          label: "学历",
          prop: "educ",
          type: "status",
          statusMap: this.educations,
        },
        {
          label: "职称",
          prop: "title",
          type: "status",
          statusMap: this.titles,
        },
        {
          label: "职业资格",
          prop: "quality",
          type: "status",
          statusMap: this.qualities,
        },
        { label: "人才卡", prop: "cname" },
        { label: "注册时间", prop: "ctime" },
        {
          label: "操作",
          type: "handle",
          width: "300",
          handles: [
            {
              fn: (index, row) => this.handelview(row),
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
            label: "人才荣誉",
            type: "select",
            key: "honour",
            option: this.sortHonours,
          },
          {
            label: "学历",
            type: "select",
            key: "educ",
            option: this.educations,
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
            ],
          },
        ],
      });
    this.getTableList();
  },
  methods: {
    async getTableList() {
      try {
        this.loading = true;
        let para = {
          ...this.searchForm,
          ...this.listState,
        };
        delete para.total;
        const res = await talentquery(para);
        this.list = res.data;
        this.listState = {
          ...this.listState,
          total: res.total,
        };
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async handelview(row) {
      let para = {
        tid: row.tid,
      };
      try {
        const res = await querytalentdetail(para);
        this.detailform = {
          ...this.detailform,
          ...res,
        };
        this.dialogVisible = true;
      } catch (e) {}
    },
    closeBatch() {
      this.batchShow = false;
    },
    bacthAuth() {
      this.batchShow = true;
    },
    goBatchHistory() {
      this.$router.push("/OrdinaryUsers/batchHistory");
    },
  },
  filters: {
    titleFilter(value) {
      return filterData("titles", value);
    },
    educationFilter(value) {
      return filterData("educations", value);
    },
    qualityFilter(value) {
      return filterData("qualities", value);
    },
    sexFilter(value) {
      return filterData("sexs", value);
    },
    industryFilter(value) {
      return filterData("industries", value);
    },
    politicalFormat(value) {
      return filterData("politicals", value);
    },
    cardTypeFormat(value) {
      return filterData("cardTypes", value);
    },
    talentSourceFormat(value) {
      return filterData("talentSources", value);
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
.el-form-item {
  margin-bottom: 10px;
}
.right {
  text-align: right;
}
</style>
