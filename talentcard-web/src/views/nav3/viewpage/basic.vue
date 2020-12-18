<template>
  <div style="width:100%" >
    <el-row class="subtitleRow">
        <div class="blue"></div>
        <span class="subtitle">基本信息</span>
    </el-row>
    <el-form ref="basicform" :model="basicform" label-width="200px" style="width:100%">
        <el-row >
          <el-col :span="12">
            <el-form-item label="姓名：">
              {{ basicform.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型：">
              {{showZJ()}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="12">
            <el-form-item label="性别：">
              {{ basicform.sex |sexFilter}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              {{ basicform.phone }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="12">
            <el-form-item label="政治面貌：">
              {{ basicform.political |politicalFilter}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现工作单位：">
              {{ basicform.workUnit || "无"  }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="12">
            <el-form-item label="工作位置：">
              {{ basicform.workLocationType| workLocationTypeFilter }}&nbsp{{ basicform.workLocation=='海外'? '' :basicform.workLocation}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在行业：">
              {{ basicform.industry |industryFilter }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="12">
            <el-form-item label="注册时间：">
              {{ basicform.createTime  }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人才来源：">
              {{ basicform.talentSource | talentSourceFormat }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="basicform.completeCertificationTime" >
          <el-col :span="12">
            <el-form-item label="完成认证时间：">
              {{ basicform.completeCertificationTime || "无"  }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-divider></el-divider>

  </div>
</template>

<script>
import { filterData, tableFormater } from "../../../utils/config";
export default {
  props:{
    basicform:{
        type:Object,
        default:()=>{}
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    showZJ() {
      const { cardType, idCard, passport, driverCard } = this.basicform;
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
    sexFilter(val) {
      return filterData("sexs", val);
    },
    politicalFilter(val) {
      return filterData("politicals", val);
    },
    industryFilter(val) {
      return filterData("industries", val);
    },
    talentSourceFormat(val) {
      return filterData("talentSources", val);
    },
    workLocationTypeFilter(val){
      return filterData("placeTypes", val);
    }
  },
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
