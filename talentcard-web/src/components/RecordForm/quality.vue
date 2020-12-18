<template>
  <div>
    <el-form :model="detailform" class="demo-form-inline" style="padding-left:40px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="职业资格：">{{ detailform.category | qualityFilter }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业资格信息：">{{ detailform.info || "无"}}</el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-col :span="6" class="right">职业资格证书资格照片/扫描件：</el-col>
        <el-col :span="18">
          <viewer :images="imgUrl">
            <img class="image-box" v-for="(src,index) in imgUrl" :src="src" :key="index" />
          </viewer>
        </el-col>
      </el-form-item>
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
  filterData,
} from "../../utils/config";
import { needlim } from "@/views/nav3/viewpage/needlim";

export default {
  props: {
    detailform: {
      type: Object,
      default: () => {},
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    imgUrl() {
      let educPicture = [];
      if (this.detailform.picture) {
        this.detailform.picture.split(",").forEach((item, index) => {
          educPicture.push(needlim(item));
        });
      }

      return educPicture;
    },
  },
  mounted() {},
  methods: {
    closeDialogVisible() {
      this.dialogVisible = false;
      this.$emit("closeDialogVisible", this.dialogVisible);
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
  },
};
</script>

<style scoped lang="less">
.image-box {
  width: 55%;
}
</style>
