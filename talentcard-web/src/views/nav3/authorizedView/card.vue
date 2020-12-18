<template>
  <div style="width:100%">
    <el-row class="subtitlerow">
      <span class="subtitle">人才卡</span>
      <el-button
        type="primary"
        class="editbtn"
        @click="gotoEdit('/Edit/card')"
        v-permission="'verifiedTalentUpdate'"
         v-if="tabs!=2"
      >编辑</el-button>
    </el-row>
    <el-divider></el-divider>
    <div style="width:100%">
      <el-row class="formRow">
        <el-col :span="8">
          <span class="label">卡片编号：</span>
          <span class="labelinfo">{{ cardInfo.cardNum }}</span>
        </el-col>
        <el-col :span="8">
          <span class="label">卡片名称：</span>
          <span class="labelinfo">{{ cardInfo.title }}</span>
        </el-col>
      </el-row>
      <el-row class="formRow">
        <span class="label">政策权益：</span>
        <el-link type="primary" @click.native="showBenefits">查看</el-link>
      </el-row>
    </div>
    <el-dialog title="人才卡对应权益" :visible.sync="dialogVisible" width="30%">
      <el-form ref="cardInfo" :model="cardInfo" label-width="100px">
        <el-form-item label="卡片编号：">{{ cardInfo.cardNum }}</el-form-item>
        <el-form-item label="卡片名称：">{{ cardInfo.title }}</el-form-item>
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
import { findPolicy } from "../../../api/api";
export default {
  props: {
    cardInfo: {
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
  computed: {},
  methods: {
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
      try {
        let para = {
          cardId: this.cardInfo.cardId,
        };
        const res = await findPolicy(para);
        this.list = res;
      } catch (e) {}
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
.policyList {
  margin: 0px;
}
</style>
