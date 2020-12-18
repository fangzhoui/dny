<template>
  <div style="width:100%">
    <el-row class="subtitleRow">
      <div class="blue"></div>
      <span class="subtitle">职业资格信息</span>
    </el-row>
    <el-form ref="qualityform" :model="qualityform" label-width="200px" style="width:100%">
      <el-row>
        <el-col :span="12">
          <el-form-item label="职业资格：">{{ qualityform.category | qualityFilter }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业资格信息：">{{ qualityform.info || "无"}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-if="qualityform.picture">
          <el-form-item label="职业资格照片：">
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
    qualityform: {
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
      let picture = [];
      this.qualityform.picture.split(",").forEach(item => {
        picture.push(needlim(item));
      });
      this.$emit("openPic", "honour", picture);
    }
  },

  filters: {
    qualityFilter(val) {
      return filterData("qualities", val);
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
