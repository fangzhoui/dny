<template>
  <section>
    <!--title-->
    <div class="titlewrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/PolicyApproval' }">政策审批</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--form-->
    <div class="contentwrapper">
      <el-divider></el-divider>
      <el-form ref="form" :model="form" label-width="100px" style="width:100%">
        <el-form-item label="申请信息" width="100%" class="formItem">
          <div class="info">
            <el-row>
              <el-col :span="12">申请人：{{tname}}</el-col>

              <el-col :span="12">政策名称：{{pname}}</el-col>
            </el-row>
          </div>

          <el-row>
            <el-col :span="12">申请时间：{{ctime}}</el-col>

            <el-col :span="12">政策编号：{{pnum}}</el-col>
          </el-row>

          <el-row>当前状态：{{status}}</el-row>
        </el-form-item>
        <el-divider v-if="uname||bnum||bname"></el-divider>
        <el-form-item label="银行卡信息" v-if="uname||bnum||bname" class="formItem">
          <div class="info">
            <el-row>
              <el-col :span="12">持卡人：{{uname}}</el-col>
              <el-col :span="12">银行卡号：{{bnum}}</el-col>
            </el-row>

            <el-row>开户行名：{{bname}}</el-row>
          </div>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="证明附件" v-if="annexes" class="formItem">
          <div class="info">
            <el-row v-for="item in annexes" :key="item.url">
              <i class="el-icon-document" />
              {{item.name}}
              <a
                v-if="isIE && /\.(png|jpg)$/.test(item.url)"
                :href="item.url"
                target="_blank"
                download
                class="download"
              >下载</a>
              <a v-else @click="downloadIamge(item.url,item.name)" class="download">
                下载
                <i class="icon-down"></i>
              </a>
            </el-row>
          </div>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="审批记录" class="formItem">
          <div class="info">
            <el-table :data="tableData" style="width: 100%" empty-text="无搜索结果">
              <el-table-column type="index" label="序号" width="50px"/>
              <el-table-column prop="ctime" label="提交时间" />
              <el-table-column prop="type" label="类型" />
              <el-table-column prop="uname" label="审批人" />
              <el-table-column prop="result" label="审批结果" />
              <el-table-column prop="opinion" label="审批意见" />
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <div style="width:100%;text-align:center;margin-top:30px">
        <el-button style="margin-left:-130px" @click="bakctomain">返回</el-button>
      </div>
    </div>
  </section>
</template>


<script>
import { policyApplyDetail } from "../../api/api";
import event from "./mixin";
export default {
  data() {
    return {
      form: {
        name: ""
      },
      textarea: "",
      tableData: [],
      bname: "",
      bnum: "",
      uname: "",
      tname: "",
      status: "",
      pnum: "",
      pname: "",
      ctime: "",
      annexes: [],
      dialogVisible: false,
      radio: "1"
    };
  },
  mixins: [event],
  methods: {
    async gettable() {
      let para = {
        paid: this.$route.query.index
      };
      try {
        const res = await policyApplyDetail(para)
        this.tableData = res.approval;
        this.tname = res.tname;
        this.status = res.status;
        this.pnum = res.pnum;
        this.pname = res.pname;
        this.ctime = res.ctime;
        if (res.annexes) {
          this.annexes = res.annexes;
        }
        if (res.bank) {
          this.bname = res.bank.bname;
          this.uname = res.bank.uname;
          this.bnum = res.bank.bnum;
        }
      }catch (e) {}
    },
    bakctomain() {
      this.$router.push("/PolicyApproval");
    }
  },
  mounted() {
    this.gettable();
  }
};
</script>

<style scoped>
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}

.titlewrapper {
  background-color: white;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
 
}

.contentwrapper {
  background-color: white;
  padding: 50px;
  padding-top: 0;
  display: flex;
  flex-wrap: wrap;
}
.info {
  margin-top: 30px;
}
.download {
  cursor: pointer;
  margin-left: 15px;
  color: #1890ff;
}
</style>

