<template>
  <section>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="申请信息" name="first">
        <!--title-->
        <div class="titlewrapper">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/PolicyApproval' }"
              >政策审批</el-breadcrumb-item
            >
            <el-breadcrumb-item>{{
              detail ? "详情" : "审批"
            }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button
            type="primary"
            @click="revoke"
            v-if="policyStatus == 1 || policyStatus == 2"
            >撤销审批</el-button
          >
        </div>
        <!--form-->
        <div class="contentwrapper">
          <el-divider></el-divider>
          <el-form
            ref="form"
            :model="form"
            label-width="100px"
            style="width: 100%"
            label-position="left"
          >
            <el-form-item label="申请信息" width="100%" class="formItem">
              <el-row>
                <el-col :span="12">
                  <span>&nbsp&nbsp&nbsp&nbsp申请人</span>
                  ：{{ tname }}
                </el-col>
                <el-col :span="12">政策名称：{{ pname }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">申请时间：{{ ctime }}</el-col>

                <el-col :span="12">政策编号：{{ pnum }}</el-col>
              </el-row>

              <el-row>当前状态：{{ status }}</el-row>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="已申请政策" width="100%" class="formItem">
              <el-table
                :data="hapbData"
                style="width: 100%"
                empty-text="无搜索结果"
                :header-cell-style="{ background: '#FAFAFA' }"
                v-if="hapbData && hapbData.length != 0"
              >
                <el-table-column type="index" label="序号" width="50px" />
                <el-table-column prop="createTime" label="申请时间" />
                <el-table-column prop="name" label="政策名称" />
                <el-table-column prop="num" label="政策编号" />
                <el-table-column prop="userName" label="审批人" />
                <el-table-column
                  prop="result"
                  :formatter="statusFormatter"
                  label="审批结果"
                />
                <el-table-column prop="opinion" label="审批意见" />
                <el-table-column prop="updateTime" label="审批时间" />
              </el-table>
              <p class="notApply" v-else>当前没有已申请通过的政策</p>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item
              label="银行卡信息"
              v-if="uname || bnum || bname"
              class="formItem"
            >
              <el-row>
                <el-col :span="12">
                  <span>&nbsp&nbsp&nbsp&nbsp持卡人</span>
                  ：{{ uname }}
                </el-col>
                <el-col :span="12">银行卡号：{{ bnum }}</el-col>
              </el-row>
              <el-row>开户行名：{{ bname }}</el-row>
            </el-form-item>
            <el-divider v-if="uname || bnum || bname"></el-divider>

            <el-form-item label="证明附件" v-if="annexes" class="formItem">
              <el-row v-for="item in annexes" :key="item.url">
                <i class="el-icon-document" />
                {{ item.name }}
                <!-- <el-link :href="item.url" type="primary" style="font-color:red">下载 </el-link> -->
                <!-- <a
                  v-if="isIE && /\.(png|jpg)$/.test(item.url)"
                  :href="item.url"
                  target="_blank"
                  download
                  class="download"
                >下载111</a> -->
                <a
                  href="#"
                  @click.prevent="downloadImg(item.url, item.name)"
                  class="download"
                >
                  下载
                  <i class="icon-down"></i>
                </a>
              </el-row>
            </el-form-item>
            <el-divider v-if="annexes"></el-divider>

            <el-form-item label="审批记录" class="formItem">
              <el-table
                :data="tableData"
                style="width: 100%"
                empty-text="无搜索结果"
                :header-cell-style="{ background: '#FAFAFA' }"
              >
                <el-table-column type="index" label="序号" width="50px" />
                <el-table-column prop="ctime" label="提交时间" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="uname" label="审批人" />
                <el-table-column prop="result" label="审批结果" />
                <el-table-column prop="opinion" label="审批意见/操作原因" />
              </el-table>
            </el-form-item>
          </el-form>
          <div
            style="
              width: 100%;
              text-align: center;
              margin-left: -100px;
              margin-top: 30px;
            "
          >
            <el-button @click="goBack">返回</el-button>
            <el-button
              type="primary"
              v-if="!Boolean(detail)"
              @click="dialogVisible = true"
              >审批</el-button
            >
          </div>
        </div>

        <el-dialog
          title="审批"
          :visible.sync="dialogVisible"
          width="640px"
          :close-on-click-modal="false"
          :show-close="false"
        >
          <div
            style="
              width: 100%;
              height: 1px;
              border-bottom: 1px solid #ccc;
              margin-top: -20px;
              margin-bottom: 20px;
            "
          ></div>
          <div style="padding: 10px; margin-left: 40px">
            <el-form
              label-position="right"
              label-width="100px"
              :model="approvalForm"
              ref="approvalForm"
              :rules="rules"
              required
            >
              <el-form-item label="是否通过:" prop="radio">
                <el-radio-group v-model="approvalForm.radio">
                  <el-radio :label="1">通过</el-radio>
                  <el-radio :label="2">驳回</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="政策资金:"
                prop="funds"
                v-if="approvalForm.radio == 1"
              >
                <el-input
                  oninput="value=value.replace(/[^\d]/g,'')"
                  style="width: 300px"
                  placeholder="请输入实际政策资金"
                  v-model="approvalForm.funds"
                ></el-input>
              </el-form-item>
              <el-form-item label="审批意见:" prop="textarea">
                <el-input
                  style="width: 300px"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入审批意见"
                  v-model="approvalForm.textarea"
                  maxlength="200"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  style="margin-left: 180px"
                  @click="resetForm('approvalForm')"
                  >取 消</el-button
                >
                <el-button
                  :loading="subLoadingflag"
                  type="primary"
                  @click="confirmApproval('approvalForm')"
                  >确 定</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <el-dialog title="撤销审批" :visible.sync="revokeDialog" width="30%">
          <p style="margin-bottom: 15px; margin-left: 10px">
            是否确认撤销该审批，撤销后该政策申请将变为“待审批”状态。
          </p>
          <el-form
            :model="revokeForm"
            ref="revokeForm"
            :rules="rules"
            required
            class="revokeForm"
          >
            <el-form-item label="操作原因:" prop="opinion">
              <el-input
                style="width: 400px"
                type="textarea"
                :rows="4"
                placeholder="请输入操作意见"
                v-model="revokeForm.opinion"
                maxlength="200"
                show-word-limit
              ></el-input>
              <p style="padding-left: 80px; color: #aaa">
                操作成功后将会通知用户操作原因
              </p>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="revokeDialog = false">取 消</el-button>
            <el-button type="primary" @click="closeRevokeDialog"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="人才详情" name="second">
        <PeopleDetails tabs="2" :openId="openId"></PeopleDetails>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>


<script>
import {
  policyApplyDetail,
  approval,
  revokeApproval,
  getpolicydetail,
} from "../../api/api";
import PeopleDetails from "../nav3/ApprovedTalent";
import event from "./mixin";
import { mapActions } from "vuex";
import LoginVue from "../Login.vue";
import { getBrowser } from "../../utils/index";
export default {
  components: {
    PeopleDetails,
  },
  data() {
    return {
      form: {
        name: "",
      },
      openId: "",
      activeName: "first",
      revokeForm: {},
      revokeDialog: false,
      detail: "",
      hapbData: [],
      tableData: [],
      bname: "",
      bnum: "",
      uname: "",
      tname: "",
      status: "",
      pnum: "",
      pname: "",
      policyStatus: 0,
      ctime: "",
      annexes: [],
      dialogVisible: false,
      subLoadingflag: false,
      approvalForm: {
        radio: 1,
        textarea: "",
        funds: "",
      },
      rules: {
        radio: [
          {
            required: true,
            message: "请选择是否通过",
            trigger: ["blur", "change"],
          },
        ],
        textarea: [
          {
            required: true,
            message: "请输入审批意见",
            trigger: ["blur", "change"],
          },
        ],
        opinion: [
          {
            required: true,
            message: "请输入操作原因",
            trigger: ["blur", "change"],
          },
        ],
        funds: [
          {
            required: true,
            message: "请输入实际政策资金",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  mixins: [event],
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    statusFormatter(row, column, cellValue, index) {
      if (row.result == 1) {
        return "通过";
      } else {
        return "驳回";
      }
    },
    ...mapActions(["getPolicyapp"]),
    async gettable() {
      let para = {
        paid: this.$route.query.paid,
      };
      try {
        const res = await policyApplyDetail(para);
        this.tableData = res.approval;
        this.hapbData = res.havingApprovePolicyBOList;
        this.tname = res.tname;
        this.status = res.status;
        this.pnum = res.pnum;
        this.pname = res.pname;
        this.ctime = res.ctime;
        this.annexes = res.annexes;
        if (res.bank) {
          this.bname = res.bank.bname;
          this.bnum = res.bank.bnum;
          this.uname = res.bank.uname;
        }
        this.approvalForm.funds = res.initialFunds;
      } catch (e) {}
    },
    async confirmApproval(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.subLoadingflag = true;
          let para = {
            paid: this.$route.query.paid,
            status: this.approvalForm.radio,
            opinion: this.approvalForm.textarea,
            actualFunds: this.approvalForm.funds,
          };
          try {
            const res = await approval(para);
            this.subLoadingflag = false;
            this.dialogVisible = false;
            this.$router.push("/PolicyApproval");
            this.$store.dispatch("getPolicyapp");
            this.$message({
              message: "审批成功",
              type: "success",
            });
          } catch (e) {
            this.subLoadingflag = true;
          }
        } else {
          return false;
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    download(href, name) {
      let eleLink = document.createElement("a");
      eleLink.download = name;
      eleLink.href = href;
      eleLink.click();
      eleLink.remove();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    revoke() {
      this.revokeDialog = true;
    },
    async closeRevokeDialog() {
      this.$refs.revokeForm.validate(async (valid) => {
        if (valid) {
          let para = {
            paId: this.$route.query.paid,
            opinion: this.revokeForm.opinion,
          };
          try {
            const res = await revokeApproval(para);
            this.$router.push("/PolicyApproval");
            this.$message({
              message: "撤销成功",
              type: "success",
            });
          } catch (e) {}
        }
      });
    },
    downloadImg(imgsrc, name) {
      const url = imgsrc;
      this.convertUrlToBase64(url).then((base64) => {
        const blob = this.convertBase64UrlToBlob(base64);
        if (getBrowser() === "IE" || getBrowser() === "Edge") {
          window.navigator.msSaveBlob(blob, name);
        } else {
          const a = document.createElement("a");
          const body = document.querySelector("body");
          a.download = name || "image";
          a.href = URL.createObjectURL(blob);
          a.style.display = "none";
          body.appendChild(a);
          a.click();
          body.removeChild(a);
          window.URL.revokeObjectURL(a.href);
        }
      });
    },
    // 利用canvas和toDataURL把图片转成base64格式并返回
    convertUrlToBase64(url) {
      return new Promise((resolve, reject) => {
        const width = 1080;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          let iwidth = img.width;
          let iheight = img.height;

          let scole = iwidth / width
          let height = iheight / scole
          canvas.width = width;
          canvas.height = height


          const context = canvas.getContext("2d");
          console.log(`width: ${canvas.width}`, `height: ${canvas.height}`)
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          const ext = img.src
            .substring(img.src.lastIndexOf(".") + 1)
            .toLowerCase();
          const dataURL = canvas.toDataURL("image/" + ext);

          const base64 = {
            dataURL: dataURL,
            type: "image/" + ext,
            ext: ext,
          };
          resolve(base64);
        };
      });
    },
    // 将图片base64流文件转成blob文件
    convertBase64UrlToBlob(base64) {
      const parts = base64.dataURL.split("base64,");
      const contentType = parts[0].split(":")[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; i++) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    },
  },

  mounted() {
    this.gettable();
  },
  created() {
    this.detail = this.$route.query.detail;
    this.policyStatus = this.$route.query.status;
    this.openId = this.$route.query.openId;
  },
};
</script>

<style scoped lang="less">
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}

.titlewrapper {
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
  .el-button {
    margin-right: 60px;
    margin-top: -10px;
  }
}

.contentwrapper {
  background-color: white;
  padding: 50px;
  padding-top: 0;
  display: flex;
  flex-wrap: wrap;
}
.revokeForm /deep/ .el-form-item__error {
  left: 80px;
}
.info {
  margin-top: 30px;
  margin-right: 30px;
}
.download {
  cursor: pointer;
  margin-left: 15px;
  color: #1890ff;
}
</style>
<style>
.formItem .el-form-item__label::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 18px;
  vertical-align: middle;
  margin-right: 10px;
  background: rgba(0, 145, 231, 1);
  border-radius: 4px;
}
.formItem .el-form-item__content {
  width: 100%;
  float: left;
  margin-left: 30px !important;
}
.notApply {
  text-align: center;
  color: #999999;
}
</style>