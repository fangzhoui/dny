<template>
  <el-container v-loading.fullscreen.lock="fullscreenLoading">
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ValidateTalent' }">认证人才</el-breadcrumb-item>
        <el-breadcrumb-item>编辑人才卡</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-form ref="cardInfo" :rules="rules" :model="cardInfo" label-width="auto">
        <el-form-item label="卡片编号：" prop="cardNum">
          <el-input v-model="cardInfo.cardNum" style="width:200px" disabled />
        </el-form-item>

        <el-form-item label="卡片名称：" prop="cardId">
          <el-select v-model="cardInfo.cardId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.cardId"
              :label="item.title + item.initialWord"
              :value="item.cardId"
            ></el-option>
          </el-select>

          <p class="tips">请谨慎的为用户换卡，因微信规则，如将用户持有的A卡，更换成B卡后，用户将永久失去A卡的持有权。</p>
        </el-form-item>
        <el-form-item label="政策权益：">
          <el-tag type="primary" v-for="item in items" :key="item.id">{{ item.name }}</el-tag>
        </el-form-item>
        <el-form-item label="操作原因：" prop="descp">
          <el-input
            type="textarea"
            v-model="cardInfo.descp"
            maxlength="200"
             show-word-limit
            style="width:400px"
            :rows="8"
          ></el-input>
            <p style="color:#bbb">操作成功后将会通知用户操作原因</p>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>
      <template>
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="submitForm('cardInfo')">确定编辑</el-button>
      </template>
    </el-footer>
  </el-container>
</template>

<script>
import {
  findPolicy,
  ChangeableCard,
  ChangeCard,
  cTalentDetail
} from "../../../api/api";
export default {
  data() {
    return {
      cardInfo: {},
      options: [],
      items: [],
      rules: {
        cardNum: [
          {
            required: true,
            message: "请输入卡片编号",
            trigger: ["change", "blur"]
          }
        ],
        cardId: [
          {
            required: true,
            message: "请选择卡片名称",
            trigger: ["change", "blur"]
          }
        ],
         descp: [
          {
            required: true,
            message: "请填写操作原因",
            trigger: ["change", "blur"],
          },
        ]
      },
      fullscreenLoading: true
    };
  },
  computed: {},
  watch: {
    cardInfo: {
      handler: function(newvalue, oldvalue) {
        this.getPolicies();
      },
      deep: true
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getCard() {
      try {
        let para = {
          talentId: this.cardInfo.talentId
        };
        const res = await ChangeableCard(para);
        this.options = res;
      } catch (e) {}
    },
    async getPolicies() {
      try {
        let para = {
          cardId: this.cardInfo.cardId
        };
        const res = await findPolicy(para);
        this.items = res;
      } catch (e) {}
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const params = {
              talentId: this.cardInfo.talentId,
              cardId: this.cardInfo.cardId,
              opinion:this.cardInfo.descp
            };
            const title = "编辑操作";
            const message = "是否编辑此用户的卡片信息？";
            await this.$alert(message, title, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: true
            });
            await ChangeCard(params);
            this.$router.go(-1);
            this.$message.success("编辑成功");
          } catch (e) {}
        } else {
          return false;
        }
      });
    },
    async getDetail() {
      try {
        this.fullscreenLoading = true;
        let para = {
          openId: this.$route.query.openId
        };
        const res = await cTalentDetail(para);
        this.cardInfo = {
          ...res.cardInfo,
          cardNum: res.talentInfo.cardNum,
          talentId: res.talentInfo.talentId
        };
      } catch (e) {
      } finally {
        this.fullscreenLoading = false;
      }
    }
  },
  filters: {},
  async created() {
    await this.getDetail();
    await this.getCard();
    await this.getPolicies();
  }
};
</script>

<style scoped lang="less">
.el-header {
  background: white;
  padding: 20px;
}
.el-main {
  background: white;
}
.el-footer {
  background: white;
  text-align: center;
  .el-button {
    width: 120px;
    margin-right: 40px;
  }
}
/deep/ .el-form {
  margin-top: 16px;
}
/deep/ .el-form-item {
  margin-bottom: 16px;
}
/deep/ .el-tag.el-tag--danger {
  margin-right: 16px;
}
.tips {
  margin-top: 10px;
  width: 400px;
  font-size: 12px;
  color: #999999;
  line-height: 20px;
}
.el-tag {
  margin-right: 8px;
}
</style>
