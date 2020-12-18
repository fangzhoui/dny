<template>
  <div style="width:100%">
    <el-row class="subtitleRow">
      <div class="blue"></div>
      <span class="subtitle">学历信息</span>
    </el-row>
    <el-form ref="eduform" :model="eduform" label-width="200px" style="width:100%">
      <el-row>
        <el-col :span="12">
          <el-form-item label="学历：">
            {{ eduform.education | eduFilter }} &nbsp{{
            eduform.firstClass | firstClassFilter
            }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校：">{{ eduform.school || "无" }}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="专业：">{{ eduform.major || "无" }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="毕业时间：">{{ eduform.graduateTime || "无" }}</el-form-item>
        </el-col>
      </el-row>

      <el-row>
         <el-col :span="12">
          <el-form-item label="学习形式：">{{ eduform.fullTime==1?'全日制':'在职' }}</el-form-item>
        </el-col>
        <el-col :span="12" v-if="eduform.educPicture">
          <el-form-item label="学历照片：">
            <el-link type="primary" @click.native="showImg">查看</el-link>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider></el-divider>
  </div>
</template>

<script>
import { filterData, tableFormater } from "../../../utils/config";
import { needlim } from "./needlim";
export default {
  props: {
    eduform: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    showImg() {
      let educPicture = [];
      this.eduform.educPicture.split(",").forEach(item => {
        educPicture.push(needlim(item));
      });
      this.$emit("openPic", "honour", educPicture);
    }
  },

  filters: {
    eduFilter(val) {
      return filterData("educations", val);
    },
    firstClassFilter(val) {
      if (val == 3) {
        return;
      } else {
        return filterData("natureTypes", val);
      }
    }
  },
  created() {}
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
