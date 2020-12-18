<template>
  <div style="width:100%">
    <el-row class="subtitleRow">
      <div class="blue"></div>
      <span class="subtitle">职称信息</span>
    </el-row>
    <el-form
      ref="titleform"
      :model="titleform"
      label-width="200px"
      style="width:100%"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="职称：">
            {{ titleform.category | titleFilter }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业资格信息：">
            {{ titleform.info || "无" }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" v-if="titleform.picture">
          <el-form-item label="职业照片：">
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
    titleform: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    showImg() {
       let picture = [];
      this.titleform.picture.split(",").forEach(item => {
        picture.push(needlim(item));
      });
      this.$emit("openPic", "honour", picture);
    },
  },

  filters: {
    titleFilter(val) {
      return filterData("titles", val);
    },
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
