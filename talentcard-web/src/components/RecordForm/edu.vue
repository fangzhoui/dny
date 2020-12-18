<template>
  <div>
    <el-form :model="detailform" class="demo-form-inline" style="padding-left:40px">
      <el-form-item>
        <el-col :span="12">
          <el-col :span="6" class="right">学历：</el-col>
          <el-col :span="18">{{ detailform.education | educationFilter }}</el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6" class="right">学校：</el-col>
          <el-col :span="18">
            {{ detailform.school ? detailform.school : "无"
            }} {{
            detailform.firstClass | firstClassFilter
            }}
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
          <el-col :span="6" class="right">学习形式</el-col>
          <el-col :span="18">
            {{
            detailform.fullTime == 1 ? '全日制' : "在职"
            }}
          </el-col>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="6" class="right">学历信息证明照片/扫描件</el-col>
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
      if (this.detailform.educPicture) {
        this.detailform.educPicture.split(",").forEach((item, index) => {
          educPicture.push(needlim(item));
        });
      }

      return educPicture;
    },
  },
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
    firstClassFilter(value) {
      //3时不显示数据 而不是 ‘以上都不是’
      if (value == 3) {
        return "";
      } else {
        return filterData("natureTypes", value);
      }
    },
  },
};
</script>

<style scoped lang="less">
.image-box {
  width: 55%;
}
</style>
