<template>
  <div style="width:100%">
    <el-row class="subtitlerow">
      <span class="subtitle">基本信息</span>
      <el-button
        type="primary"
        class="editbtn"
        @click="gotoEdit('/Edit/basic')"
        v-permission="'verifiedTalentUpdate'"
        v-if="tabs!=2"
      >编辑</el-button>
    </el-row>
    <el-divider></el-divider>
    <el-row class="formRow">
      <el-col :span="8">
        <span class="label">姓名：</span>
        <span class="labelinfo">{{ basicInfo.name }}</span>
      </el-col>
      <el-col :span="8">
        <span class="label">性别：</span>
        <span class="labelinfo">{{ basicInfo.sex | sexFilter }}</span>
      </el-col>
      <el-col :span="8">
        <span class="label">证件类型：</span>
        <span class="labelinfo">{{ showZJ() }}</span>
      </el-col>
    </el-row>
    <el-row class="formRow">
      <el-col :span="8">
        <span class="label">联系电话：</span>
        <span class="labelinfo">{{ basicInfo.phone }}</span>
      </el-col>
      <el-col :span="8">
        <span class="label">政治面貌：</span>
        <span class="labelinfo">
          {{
          basicInfo.political | politicalFilter
          }}
        </span>
      </el-col>
      <el-col :span="8">
        <span class="label">现工作单位：</span>
        <span class="labelinfo">{{ basicInfo.workUnit || '无' }}</span>
      </el-col>
    </el-row>
    <el-row class="formRow">
      <el-col :span="8">
        <span class="label">工作位置：</span>
        <span class="labelinfo">
          {{ basicInfo.workLocationType | workLocationTypeFilter }}&nbsp{{
          (basicInfo.workLocation == "海外" || basicInfo.workLocation == "无") ? "" : basicInfo.workLocation
          }}
        </span>
      </el-col>
      <el-col :span="8">
        <span class="label">所在行业：</span>
        <span class="labelinfo">{{ basicInfo.industry | industryFilter }}</span>
      </el-col>
      <el-col :span="8">
        <span class="label">人才来源：</span>
        <span class="labelinfo">
          {{
          basicInfo.talentSource | talentSourceFilter
          }}
        </span>
      </el-col>
    </el-row>
    <el-row class="formRow">
      <el-col :span="8">
        <span class="label">注册时间：</span>
        <span class="labelinfo">{{ basicInfo.createTime }}</span>
      </el-col>
      <el-col :span="8">
        <span class="label">完成认证时间：</span>
        <span class="labelinfo">{{ basicInfo.firstCertificationTime }}</span>
      </el-col>
    </el-row>
    <el-row class="formRow">
      <el-col :span="8">
        <span class="label">参保单位：</span>
        <span class="labelinfo">{{ basicInfo.security_workUnit || '无' }}</span>
      </el-col>
      <el-col :span="8">
        <span class="label">参保时间：</span>
        <span
          class="labelinfo"
        >{{ (basicInfo.security_time && basicInfo.security_time.split(' ')[0]) || '无' }}</span>
      </el-col>
      <el-col :span="8">
        <span class="label">核查时间：</span>
        <span
          class="labelinfo"
        >{{ (basicInfo.check_time && basicInfo.check_time.split(' ')[0]) || '无' }}</span>
      </el-col>
    </el-row>
    <el-row class="formRow">
      <el-col :span="8">
        <span class="label">人员类别：</span>
        <span
          class="labelinfo"
        >{{ (!basicInfo.social_type || basicInfo.social_type == 3) ? '无' : (basicInfo.social_type == 1 ? '在职人员' : '中断人员') }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { filterData, cityList } from "../../../utils/config";
export default {
  props: {
    basicInfo: {
      type: Object,
      default: () => {},
    },
    tabs: { type: String, default: "1" },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    gotoEdit(path) {
      this.$router.push({
        path: path,
        query: {
          openId: this.$route.query.openId,
          // basicInfo: this.basicInfo,
        },
      });
    },
    showZJ() {
      const { cardType, idCard, passport, driverCard } = this.basicInfo;
      if (cardType == 1) {
        return `身份证 (${idCard})`;
      }
      if (cardType == 2) {
        return `护照 (${passport})`;
      }
      if (cardType == 3) {
        return `驾照 (${driverCard})`;
      }
    },
  },

  filters: {
    sexFilter(value) {
      return filterData("sexs", value);
    },
    politicalFilter(value) {
      return filterData("politicals", value);
    },
    industryFilter(value) {
      return filterData("industries", value);
    },
    talentSourceFilter(value) {
      return filterData("talentSources", value);
    },
    workLocationTypeFilter(value) {
      return filterData("placeTypes", value);
    },
  },
};
</script>

<style lang="less" scoped>
.editbtn {
  padding: 0;
  width: 80px;
  height: 30px;
  float: right;
  margin-top: 4px;
}
.subtitlerow {
  width: 100%;
}
.subtitle {
  font-size: 15px;
  margin-top: 16px;
  font-weight: bold;
  float: left;
}
.formRow {
  width: 100%;
  margin-bottom: 10px;
  line-height: 30px;
  img {
    width: 400px;
    height: 200px;
  }
}
.label {
  font-size: 14px;
  color: #666666;
  font-weight: 100px;
}

.labelinfo {
  font-size: 14px;
  margin-left: 0px;
  color: #333333;
}
</style>
