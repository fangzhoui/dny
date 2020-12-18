<template>
  <el-container>
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ValidateTalent' }">认证人才</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{
          pageType == "edit" ? "编辑人才荣誉" : "新增人才荣誉"
          }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-form ref="honourForm" :rules="rules" :model="honourForm" label-width="auto">
        <p style="color: #F56C6C; position:absolute;margin-top:10px;margin-left:100px">*</p>
        <el-form-item label="人才荣誉：" prop="honourType">
          <el-select v-model="honourForm.honourType" :placeholder="honourFilter">
            <el-option
              v-for="item in canUserHonours"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="政策权益：">
          <el-tag type="primary" v-for="item in currentPolicyList" :key="item.name">{{ item.name }}</el-tag>
        </el-form-item>

        <el-form-item label="人才荣誉证明照片/扫描件：" required prop="picture">
          <mulitip-upload
            action="/tcmgr/file/upload"
            projectName="honourPic"
            :imgs="honourForm.picture"
            :maxCount="3"
            :limit="10"
            text="最多上传3张,支持扩展名：png .jpg"
            @successUpload="avatarInput"
          ></mulitip-upload>
        </el-form-item>
        <el-form-item label="操作原因:" prop="descp">
          <el-input
            type="textarea"
            v-model="honourForm.descp"
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
        <el-button type="primary" @click="submitForm('honourForm')">确定编辑</el-button>
      </template>
    </el-footer>
  </el-container>
</template>

<script>
import { needlim } from "../viewpage/needlim";
import {
  findPolicy,
  addNewHonour,
  editHonour,
  cTalentDetail,
} from "../../../api/api";
import { mapState, mapActions, mapGetters } from "vuex";
import MulitipUpload from "@c/upload/multipleUpload";
export default {
  components: {
    MulitipUpload,
  },
  data() {
    const checkThatName = (rule, value, callback) => {
      if (this.flag && value === "") {
        callback(new Error("请选择人才荣誉"));
      } else {
        callback();
      }
    };
    return {
      editList: {
        name: "",
      },
      honourForm: {
        honour: "",
        picture: [],
        descp: "",
        honourType: "",
      },
      flag: true,
      showpreview: false,
      currentPolicyList: [],
      rules: {
        honourType: [
          {
            validator: checkThatName,
            trigger: ["change", "blur"],
          },
        ],
        picture: [
          {
            required: true,
            message: "请上传附件",
            trigger: ["change", "blur"],
          },
        ],
        descp: [
          {
            required: true,
            message: "请填写操作原因",
            trigger: ["change", "blur"],
          },
        ],
      },
      imageUrl: "",
      pageType: "",
      honourList: "",
    };
  },
  computed: {
    ...mapGetters(["canUserCategories", "canUserHonours", "sortHonours"]),
    honourFilter() {
      for (let i = 0; i < this.sortHonours.length; i++) {
        if (this.sortHonours[i].value == this.honourForm.honour) {
          return this.sortHonours[i].label;
        }
      }
    },
  },
  watch: {
    "honourForm.honourType"() {
      this.getCurrentPolicies();
    },
  },
  methods: {
    deletehonour(index) {
      this.editList.splice(index, 1);
    },
    newHonour() {
      this.editList.push({ name: "" });
    },
    goBack() {
      this.$router.go(-1);
    },
    async getCurrentPolicies() {
      try {
        if (this.honourForm.honourType) {
          this.honourList = this.honourForm.honourType + "";
        } else {
          this.honourList = this.honourForm.honour + "";
        }
        let honArray = this.honourList.split(" ");
        let para = {
          honourList: honArray,
        };
        const res = await findPolicy(para);
        this.currentPolicyList = res;
      } catch (e) {
        console.log(e);
      }
    },
    submitForm(val) {
      this.$refs.honourForm.validate(async (valid) => {
        if (valid) {
          try {
            const isDev = process.env.NODE_ENV == "development";
            const reg = isDev
              ? /http\:\/\/dev.localcards.gov.vbooster.cn/
              : new RegExp(location.origin);
            let params = {
              honourId: this.honourForm.honourType
                ? this.honourForm.honourType
                : this.honourForm.honour,
              honourPicture: this.honourForm.picture
                .map((i, index) => i.url.replace(reg, ""))
                .join(","),
              openId: this.$route.query.openId,
              opinion: this.honourForm.descp,
            };
            if (this.pageType == "add") {
              const title = "新增操作";
              const message = "是否确定新增此用户的人才荣誉信息？";
              await this.$alert(message, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
              });
              await addNewHonour(params);
              this.$router.go(-1);
              this.$message.success("新增成功");
            }
            if (this.pageType == "edit") {
              params.thId = this.honourForm.thId;
              const title = "编辑操作";
              const message = "是否确定编辑此用户的人才荣誉信息？";
              await this.$alert(message, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
              });
              const res = await editHonour(params);
              this.$router.go(-1);
              this.$message.success("编辑成功");
            }
          } catch (e) {
            console.log(e, "执行失败");
          }
        } else {
          return false;
        }
      });
    },
    avatarInput(val) {
      this.$set(this.honourForm, "picture", val);
      this.$refs.honourForm.validateField("picture");
    },
    async getDetail() {
      try {
        let para = {
          openId: this.$route.query.openId,
        };
        const res = await cTalentDetail(para);
        console.log(res);
        let honourTemp =
          res.talentInfo.talentHonourPOList[this.$route.query.index];
        var url = honourTemp.honourPicture;
        if (url) {
          var pictureList = url.split(",");
          let picture = [];
          pictureList.forEach((item) => {
            picture.push(needlim(item));
          });
          this.honourForm = {
            honour: honourTemp.honourId,
            descp: honourTemp.descp ? honourTemp.descp : "",
            picture: picture.map((item) => {
              return { name: item, url: item };
            }),
            thId: honourTemp.thId,
          };
        } else {
          this.honourForm = {
            honour: honourTemp.honourId,
            descp: honourTemp.descp ? honourTemp.descp : "",
            picture: [],
            thId: honourTemp.thId,
          };
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  filters: {},
  created() {},
  mounted() {
    if (this.$route.query.type == "edit") {
      this.pageType = "edit";
      this.flag = false;
      this.getDetail();
    }
    if (this.$route.query.type == "add") {
      this.pageType = "add";
    }
  },
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
.content {
  background: #f5f5f5;
  margin-top: 20px;
  padding: 20px 32px;
  position: relative;
  border-radius: 5px;
  .deletebtn {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 999;
    background: #999999;
    border-radius: 50%;
    color: white;
    font-size: 3px;
    text-align: center;
    line-height: 18px;
    cursor: pointer;
  }
}
/deep/ .el-tag {
  margin-right: 16px;
}
</style>
