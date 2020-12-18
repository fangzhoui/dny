<template>
  <div style="width:100%">
    <el-row class="subtitleRow">
      <div class="blue"></div>
      <span class="subtitle">主要人才荣誉</span>
    </el-row>
    <el-form ref="honourform" :model="honourform" label-width="200px" style="width:100%">
      <el-row>
        <el-col :span="12">
          <el-form-item label="人才荣誉：">{{ honourFilter(honourform.honourId) }}</el-form-item>
        </el-col>
        <el-col :span="12" v-if="honourform.honourPicture">
          <el-form-item label="荣誉照片：">
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
import {needlim} from "./needlim";
import { mapState, mapActions,mapGetters } from "vuex";
export default {
  props: {
    honourform: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ImgTitle: "荣誉照片"
    };
  },
  computed: {
      ...mapState({
      honours: (state) => state.options.honours,
    }),
    honourFilter(){
      return function(val){
          for (let i = 0; i < this.honours.length; i++) {
            if (this.honours[i].value == val) {
              return this.honours[i].label
            }
          }
      }
    }
  },
  methods: {
    showImg() {
      let honourPicture = []
      this.honourform.honourPicture.split(",").forEach(item=>{
          honourPicture.push(needlim(item))
      })
      this.$emit("openPic", "honour", honourPicture);
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
