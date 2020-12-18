<template>
  <div style="width:100%">
    <el-row class="subtitlerow">
      <span class="subtitle">人才类别</span>
      <el-button
        type="primary"
        class="editbtn"
        @click="gotoEdit('/Edit/category')"
        v-permission="'verifiedTalentUpdate'"
        v-if="tabs!=2"
      >编辑</el-button>
    </el-row>
    <el-divider></el-divider>
    <el-row class="formRow">
      <span class="label">人才类别：</span>
      <span class="labelinfo" v-if="talentInfo.category">
        {{
        categoryFilter(talentInfo.category)
        }}
      </span>
      <span class="labelinfo" v-if="!talentInfo.category">无</span>
    </el-row>
    <el-row class="formRow" v-if="talentInfo.category">
      <span class="label">政策权益：</span>
      <el-link type="primary" @click.native="showBenefits">查看</el-link>
    </el-row>
    <el-dialog title="人才类别对应政策权益" :visible.sync="dialogVisible" width="30%">
      <el-form ref="talentInfo" :model="talentInfo" label-width="100px">
        <el-form-item label="人才类别：">{{ categoryFilter(talentInfo.category) }}</el-form-item>
        <el-form-item label="政策权益：">
          <div v-if="!list.length">无</div>
          <ul v-else class="policyList">
            <li v-for="(item,index) in list" :key="index">{{ item.name }}</li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { filterData } from "../../../utils/config";
import { mapState, mapActions, mapGetters } from "vuex";
import { findPolicy } from "../../../api/api";
export default {
  props: {
    talentInfo: {
      type: Object,
      default: () => {},
    },
     tabs: { type: String, default: "1" },
  },
  data() {
    return {
      dialogVisible: false,
      list: [],
    };
  },
  computed: {
    ...mapState({
      honours: (state) => state.options.honours,
      categories: (state) => state.options.categories,
    }),
  },
  methods: {
    categoryFilter(category) {
      if (!category) {
        return "无";
      } else {
        let arr = [];
        category.split(",").forEach((item) => {
          for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].value == item) {
              arr.push(this.categories[i].label);
            }
          }
        });
        return arr + "";
      }
    },
    gotoEdit(path) {
      this.$router.push({
        path: path,
        query: {
          openId: this.$route.query.openId,
        },
      });
    },
    showBenefits() {
      this.dialogVisible = true;
      this.getPolicy();
    },
    async getPolicy() {
      let cateString = this.talentInfo.category;
      try {
        let para = {
          category: cateString,
        };
        const res = await findPolicy(para);
        this.list = res;
      } catch (e) {}
    },
  },

  // filters: {
  //   categoryFilter(value) {
  //     if (value) {
  //       let cateList = value.split(",");
  //       let output = cateList.reduce(function(total, currentValue) {
  //         return total + "," + filterData("categories", currentValue);
  //       }, "");
  //       output = output.substr(1);
  //       return output;
  //     }
  //   },
  // },
  created() {},
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

.policyList {
  margin: 0px;
}
</style>
