<template>
  <div>
    <el-form :model="detailform" class="demo-form-inline" style="padding-left:40px">
     <el-col :span="12">
            <el-form-item label="姓名：">
              {{ detailform.name }}
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
              {{ detailform.sex |sexFilter}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              {{ detailform.phone }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="12">
            <el-form-item label="政治面貌：">
              {{ detailform.political |politicalFilter}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现工作单位：">
              {{ detailform.workUnit || "无"  }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="12">
            <el-form-item label="工作位置：">
              {{ detailform.workLocationType| workLocationTypeFilter }}&nbsp{{ detailform.workLocation=='海外'? '' :detailform.workLocation}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在行业：">
              {{ detailform.industry |industryFilter }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="12">
            <el-form-item label="注册时间：">
              {{ detailform.createTime  }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人才来源：">
              {{ detailform.talentSource | talentSourceFormat }}
            </el-form-item>
          </el-col>
        </el-row>
      <el-form-item>
        <el-button style="float:right" @click="closeDialogVisible">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  educations,
  sexs,
  titles,
  qualities,
  honours,
  filterData
} from "../../utils/config";
import { needlim } from "@/views/nav3/viewpage/needlim";

export default {
  props: {
    detailform: {
      type: Object,
      default: () => {}
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
     
    };
  },
  created() {
      
  },
  mounted() {
 
  },
  methods: {
    closeDialogVisible() {
      this.dialogVisible = false;
      this.$emit("closeDialogVisible", this.dialogVisible);
    },
      showZJ() {
      const { cardType, idCard, passport, driverCard } = this.detailform;
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
    honourIdFilter(value) {
      return filterData("honours", value);
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
    politicalFilter(val) {
      return filterData("politicals", val);
    },
    workLocationTypeFilter(val){
      return filterData("placeTypes", val);
    }
  }
};
</script>

<style scoped lang="less">
.image-box {
  width: 55%;
}
</style>
