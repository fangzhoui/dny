<template>
  <el-container>
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ValidateTalent' }">认证人才</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{
          pageType == "edit" ? "编辑职业资格信息" : "新增职业资格信息"
          }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-form ref="qualityform" :model="qualityform" :rules="rules" label-width="auto">
        <el-form-item label="职业资格：" prop="category">
          <el-select v-model="qualityform.category" placeholder="请选择">
            <el-option
              v-for="item in qualities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职业资格信息：" prop="info">
          <el-input
            v-model="qualityform.info"
            placeholder="请输入内容"
            maxlength="20"
            show-word-limit
            style="width:400px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="政策权益：">
          <el-tag type="primary" v-for="item in policyList" :key="item.id">{{ item.name }}</el-tag>
        </el-form-item>
        <el-form-item label="职业资格证书资格照片/扫描件：" prop="picture">
          <mulitip-upload
            action="/tcmgr/file/upload"
            projectName="qualityPic"
            :imgs="qualityform.picture"
            :maxCount="3"
            :limit="10"
            text="最多上传3张,支持扩展名：png .jpg"
            @successUpload="avatarInput"
          ></mulitip-upload>
        </el-form-item>
        <el-form-item label="操作原因：" prop="descp">
          <el-input
            type="textarea"
            v-model="qualityform.descp"
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
        <el-button type="primary" @click="submitForm('qualityform')">确定编辑</el-button>
      </template>
    </el-footer>
  </el-container>
</template>

<script>
import {
  findPolicy,
  addNewQuality,
  editQuality,
  cTalentDetail,
} from "../../../api/api";
import MulitipUpload from "@c/upload/multipleUpload";
import { qualities } from "../../../utils/config";
import { needlim } from "../viewpage/needlim";
export default {
  data() {
    return {
      pageType: "",
      qualities,
      qualityform: {
        descp: "",
        category: "",
        info: "",
        picture: [],
      },
      policyList: [],
      rules: {
        category: [
          {
            required: true,
            message: "请选择职业资格",
            trigger: ["change", "blur"],
          },
        ],
        info: [
          {
            required: true,
            message: "请输入职业资格信息",
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
    };
  },
  components: {
    MulitipUpload,
  },
  computed: {},
  methods: {
    deleteQuality(index) {
      this.editList.splice(index, 1);
    },
    newQuality() {
      this.editList.push({ name: "" });
    },
    goBack() {
      this.$router.go(-1);
    },
    avatarInput(val) {
      this.$set(this.qualityform, "picture", val);
      this.$refs["qualityform"].validateField("picture");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const isDev = process.env.NODE_ENV == "development";
            const reg = isDev
              ? /http\:\/\/dev.localcards.gov.vbooster.cn/
              : new RegExp(location.origin);
            let params = {
              ...this.qualityform,
              picture: this.qualityform.picture
                .map((i) => i.url.replace(reg, ""))
                .join(","),
              openId: this.$route.query.openId,
              opinion: this.qualityform.descp,
            };
            if (this.pageType == "add") {
              const title = "新增操作";
              const message = "是否确定新增此用户的职业资格信息？";
              await this.$alert(message, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
              });
              await addNewQuality(params);
              this.$router.go(-1);
              this.$message.success("新增成功");
            }
            if (this.pageType == "edit") {
              params.pqId = this.qualityform.pqId;
              const title = "编辑操作";
              const message = "是否确定编辑此用户的职业资格信息？";
              await this.$alert(message, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
              });
              const res = await editQuality(params);
              this.$router.go(-1);
              this.$message.success("编辑成功");
            }
          } catch (e) {}
        } else {
          return false;
        }
      });
    },
    async getCurrentPolicies() {
      try {
        let para = {
          qualityList: [this.qualityform.category],
        };
        const res = await findPolicy(para);
        this.policyList = res;
      } catch (e) {}
    },
    async getDetail() {
      try {
        let para = {
          openId: this.$route.query.openId,
        };
        const res = await cTalentDetail(para);
        console.log(res);
        let qualityList =
          res.talentInfo.profQualityPOList[this.$route.query.index];
        var url = qualityList.picture;
        if (url) {
          var pictureList = url.split(",");
          let picture = [];
          pictureList.forEach((item) => {
            picture.push(needlim(item));
          });
          this.qualityform = {
            ...qualityList,
            descp: qualityList.descp ? qualityList.descp : "",
            category: qualityList.category,
            info: qualityList.info,
            picture: picture.map((item) => {
              return { name: item, url: item };
            }),
          };
        } else {
          this.qualityform = {
            ...qualityList,
            descp: qualityList.descp ? qualityList.descp : "",
            category: qualityList.category,
            info: qualityList.info,
            picture: [],
          };
        }
      } catch (e) {}
    },
  },
  watch: {
    qualityform: {
      handler: function (newvalue, oldvalue) {
        this.getCurrentPolicies();
      },
      deep: true,
    },
  },
  filters: {},
  created() {},
  mounted() {
    if (this.$route.query.type == "edit") {
      this.pageType = "edit";
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
.avatar-uploader-icon {
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  color: #8c939d;
  width: 120px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar {
  width: 300px;
  height: 190px;
  display: block;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
}
/deep/ .el-tag {
  margin-right: 16px;
}
</style>
