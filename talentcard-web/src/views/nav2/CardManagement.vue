<template>
  <section>
    <!--title-->
    <div class="titlewrapper">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">人才卡管理</div>
        <div class="homepageTitle"></div>
      </section>
      <!--列表-->
      <div class="toolbar" style="background-color:white">
        <el-form :inline="true" :model="searchForm" label-width="100px">
          <el-form-item label="卡片名称">
            <el-input v-model="searchForm.title" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="卡片编号">
            <el-input v-model="searchForm.cardNum" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="开始日期">
            <el-date-picker v-model="searchForm.startTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker v-model="searchForm.endTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-bottom:10px;" @click="resetfilter">重置</el-button>
            <el-button type="primary" native-type='submit' @click="(e) => getCardInfo(e)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--列表-->
    <div class="contentwrapper">
      <div class="cards cardslayout" v-for="(item, index) in cards" :key="index">
        <div
          v-if="index === 0"
          class="defaultCard"
          @click="handelnewcard"
          v-permission="'userCardCreate'"
        >
          <div style="font-size:60px;color:#ccc;text-align:center;margin-top:80px">
            <router-link to="/CreateNewCard" style="text-decoration: none; color:#ccc">+</router-link>
          </div>
          <div style="font-size:18px;color:#ccc;text-align:center">添加新卡片</div>
        </div>

        <div
          v-if="index !== 0"
          class="cardItself"
          :style="{ backgroundImage: 'url(' + item.picture + ')' }"
        >
          <div class="selfie"></div>
          <div class="cardname">{{ item.name }}</div>
          <div class="cardtitle">{{ item.title }}</div>
          <div class="cardcode">{{ item.initialWord }}</div>
          <div class="cardCreateTime">创建时间:&nbsp{{ item.createTime.split(" ")[0] }}</div>
          <div class="cardHolderNum">持有人数:&nbsp{{ item.memberNum }}</div>

          <div v-if="index == 1" class="cardButtonGroup">
            <div
              style="width:50%;text-align:center;padding-top:15px;font-size:14px;font-weight:bold"
            >默认卡片</div>
            <div style="height:30px;width:0px; border:0.5px solid #CCCCCC; margin-top:20px" />
            <div
              style="width:50%;text-align:center;padding-top:15px;font-size:14px;"
              @click="handelViewCard(index)"
            >查看</div>
          </div>
          <div v-if="index !== 1 && index !== 0" class="cardButtonGroup">
            <div
              style="width:33%;text-align:center;padding-top:15px;font-size:14px;"
              @click="handelViewCard(index)"
            >查看</div>
            <div style="height:30px;width:0px; border:0.5px solid #CCCCCC; margin-top:20px" />
            <div
            v-permission="'userCardUpdate'"
              style="width:33%;text-align:center;padding-top:15px;font-size:14px;"
              @click="handelEditCard(index)"
            >编辑</div>
            <div style="height:30px;width:0px; border:0.5px solid #CCCCCC; margin-top:20px" />
            <div
              v-permission="'userCardDelete'"
              style="width:33%;text-align:center;padding-top:15px;font-size:14px;"
              @click="handelDeleteCard(item)"
            >删除</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="卡片详情"
      :visible.sync="checkDetailsDialog"
      width="50%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div style="width: 100%; height: 1px; border-top: solid #EEEEEE 1px;margin-top:-10px" />
      <div class="detailContent" style="font-size:16px">
        <el-row style="padding-top:20px;padding-left:20px">
          <el-col :span="9">
            <div
              class="cardPic"
              :style="{ backgroundImage: 'url(' + detailedCardPicture + ')' }"
              style="width:100%"
            >
              <div class="insidetop" style="width:100%">
                <div class="insideselfie" style="width:15%"></div>
                <div class="insidemid" style="width:50%">
                  <div class="cardTitle">{{ detailedCardName }}</div>
                  <div class="cardName">{{ detailedCardTitle }}</div>
                </div>
                <div class="insideright" style="width:25%">
                  <div>{{ detailedCardInitialWord }}{{ detailedCardInitialNum }}</div>
                </div>
              </div>

              <div class="insidebot">
                <div>创建时间：{{ detailedCardCreateTime.split(" ")[0] }}</div>
                <div>持有人数：{{ detailedCardMemberNum }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="12" :push="2" style="padding-top:20px ">
            <el-row style="margin-bottom:15px">
              <el-col :span="12">
                <span style="color:#666666">创建人员：</span>
                <span style="color:#333333">
                  {{
                  !detailedCardPeople ? "系统生成" : detailedCardPeople
                  }}
                </span>
              </el-col>

              <el-col :span="12">
                <span style="color:#666666">创建时间：</span>
                <span style="color:#333333">
                  {{
                  detailedCardCreateTime.split(" ")[0]
                  }}
                </span>
              </el-col>
            </el-row>

            <el-row style="margin-bottom:15px">
              <span style="color:#666666">商户名称：</span>
              <span style="color:#333333">{{ detailedCardName }}</span>
            </el-row>
            <el-row style="margin-bottom:15px">
              <span style="color:#666666">卡片名称：</span>
              <span style="color:#333333">{{ detailedCardTitle }}</span>
            </el-row>
            <el-row style="margin-bottom:15px" v-if="detailedCardInitialWord">
              <span style="color:#666666">卡片编号：</span>
              <span style="color:#333333">{{ detailedCardInitialWord }}{{ detailedCardInitialNum }}</span>
            </el-row>
            <el-row style="margin-bottom:15px">
              <span style="color:#666666">持有人数：</span>
              <span style="color:#333333">{{ detailedCardMemberNum }}</span>
            </el-row>
          </el-col>
        </el-row>
        <div style="width: 100%; height: 1px; border-top: solid #EEEEEE 1px;margin-top:20px" />
        <el-row style="padding-left:20px">
          <el-row style="margin-top:20px;color:#666666">
            政策权益：
            <template v-if="detailedCardPolicyInfo && detailedCardPolicyInfo.length > 0">
              <el-tag
                v-for="item in detailedCardPolicyInfo"
                :key="item"
                class="tag-margin"
              >{{ item }}</el-tag>
            </template>
            <template v-else>
              <span>无</span>
            </template>
          </el-row>
          <el-row style="margin-top:20px">
            <span style="color:#666666">卡片描述：</span>
            <span style="color:#333333">
              {{
              !detailedCardDescription ? "默认卡片" : detailedCardDescription
              }}
            </span>
          </el-row>
          <el-row style="margin-top:20px">
            <span style="color:#666666">每年可领取旅游次数:</span>
            <span style="color:#333333">
              {{
              tripTimes ? tripTimes + "次" : "无"
              }}
            </span>
          </el-row>
          <el-row></el-row>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkDetailsDialog = false">返回</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { getCards, deletecards, findOne } from "../../api/api";
import { formatTime } from "../../utils";
const SEARCHFORM = {
  title: "",
  cardNum: "",
  startTime: "",
  endTime: "",
};
export default {
  data() {
    return {
      createnewcarddia: false,
      checkDetailsDialog: false,
      cards: [],
      deleteVis: false,
      confirmDeleteVis: false,
      deleteLoading: false,
      deleteCardId: "",
      viewCardId: "",
      detailedCardName: "",
      detailedCardTitle: "",
      detailedCardMemberNum: "",
      detailedCardWaitingMemberNum: "",
      detailedCardCurrNum: "",
      detailedCardDescription: "",
      detailedCardPicture: "",
      detailedCardPictureCdn: "",
      detailedCardLogoUrl: "",
      detailedCardPrerogative: "",
      detailedCardInitialWord: "",
      detailedCardInitialNum: "",
      detailedCardCreateTime: "",
      detailedCardCreatePeole: "",
      detailedCardPolicyInfo: [],
      detailedCardPeople: "",
      tripTimes: "",
      searchForm: {
        ...SEARCHFORM,
      },
    };
  },
  methods: {
    resetfilter() {
      this.searchForm = {
        ...SEARCHFORM,
      };
      this.getCardInfo();
    },

    async getCardInfo(e) {
       // enter el-form键阻止冒泡
      e && e.stopPropagation()
      e && e.preventDefault()
      var defaultcard = {
        cardId: "",
        createTime: "",
        currNum: "",
        description: "",
        dr: "",
        initialNum: "",
        initialWord: "",
        logoUrl: "",
        memberNum: "",
        name: "",
        picture: "",
        pictureCdn: "",
        prerogative: "",
        status: "",
        title: "",
        wxCardId: "",
      };
      let para = {
        ...this.searchForm,
        startTime: this.searchForm.startTime
          ? formatTime(this.searchForm.startTime, "yyyy-MM-dd")
          : "",
        endTime: this.searchForm.endTime
          ? formatTime(this.searchForm.endTime, "yyyy-MM-dd")
          : "",
      };
      try {
        const res = await getCards(para);
        this.cards = res || [];
        this.cards.unshift(defaultcard);
        if (this.cards.length == 1) {
          this.$message({
            message: "无搜索结果",
            type: "warning",
          });
        }
      } catch (e) {}
    },

    handelnewcard() {
      this.createnewcarddia = true;
      this.$router.push("/CreateNewCard");
    },

    async handelDeleteCard(item) {
      if (item.memberNum > 0) {
        try {
          await this.$alert("此卡持有人数不为0，无法删除！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: true,
          });
        } catch (e) {}
      } else {
        try {
          await this.$alert("是否删除此人才卡片？", "删除操作", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: true,
          });
          let para = {
            cardId: item.cardId,
          };
          await deletecards(para);
          this.$message({
            message: "卡片删除成功",
            type: "success",
          });
          this.getCardInfo();
        } catch (e) {}
      }
    },
    async handelViewCard(index) {
      this.checkDetailsDialog = true;
      let para = {
        cardId: this.cards[index].cardId,
      };
      try {
        const res = await findOne(para);
        this.detailedCardName = res.name;
        this.detailedCardTitle = res.title;
        this.detailedCardMemberNum = res.memberNum;
        this.detailedCardWaitingMemberNum = res.waitingMemberNum;
        this.detailedCardCurrNum = res.currNum;
        this.detailedCardDescription = res.businessDescription;
        this.tripTimes = res.tripTimes;
        this.detailedCardPicture = res.picture;
        this.detailedCardPictureCdn = res.pictureCdn;
        this.detailedCardLogoUrl = res.logoUrl;
        this.detailedCardPrerogative = res.prerogative;
        this.detailedCardInitialWord = res.initialWord;
        this.detailedCardInitialNum = res.initialNum;
        this.detailedCardCreateTime = res.createTime;
        this.detailedCardPolicyInfo = res.policyInfo;
        this.detailedCardPeople = res.createPerson;
      } catch (e) {}
    },
    handelEditCard(index) {
      this.$router.push({
        path: "/EditCard",
        query: { id: this.cards[index].cardId },
      });
    },
  },
  mounted() {
    this.getCardInfo();
  },
};
</script>

<style scoped>
.tag-margin {
  margin-right: 7px;
}
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
.title {
  padding: 0px;
}
.contentwrapper {
  background-color: white;
  padding: 50px;
  display: flex;
  flex-wrap: wrap;
}
.cards {
  width: 400px;
  height: 288px;
  border-radius: 25px;
  margin-left: 40px;
  margin-bottom: 50px;
}
.cardItself {
  height: 220px;
  width: 400px;
  border-radius: 25px 25px 0 0;
  background-size: 100% 100%;
  position: relative;
}

.cardTitle {
  margin-top: 30px;
  margin-left: 20px;
  font-size: 18px;
  color: white;
  font-style: bold;
}
.cardName {
  margin-top: 5px;
  margin-left: 20px;
  font-size: 16px;
  color: white;
}
.cardButtonGroup {
  position: absolute;
  height: 50px;
  width: 400px;
  border-radius: 0px 0px 25px 25px;
  display: inline-flex;
  background-color: #eeeeeeee;
  margin-top: 220px;
}
.defaultCard {
  border-radius: 25px;
  border: 2px #cccccc dashed;
  width: 400px;
  height: 260px;
}

.detailedcardimg {
  background: url("https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=318015692,1179676105&fm=26&gp=0.jpg");
}
.cardPic {
  width: 400px;
  height: 200px;
  border-radius: 10px;
  background-size: 100% 100%;
  margin-bottom: 10px;
}

.insideselfie {
  width: 60px;
  height: 55px;
  background: url(../../assets/quzhou-logo.png);
  background-size: 100% 100%;
  margin-top: 20px;
  margin-left: 20px;
  float: left;
}

.insidemid {
  width: 200px;
  height: 100px;
  float: left;
}
.insideright {
  color: white;
  float: left;
  margin-top: 60px;
}
.insidetop {
  height: 65%;
}
.insidebot {
  color: white;
  margin-left: 30px;
}
.el-dialog__body {
  padding: 30px 20px 0 20px;
}
.cardname {
  position: absolute;
  width: 200px;
  font-size: 16px;
  color: white;
  height: 20px;
  top: 30px;
  left: 100px;
}
.cardtitle {
  position: absolute;
  width: 150px;
  height: 20px;
  top: 60px;
  left: 100px;
  font-size: 14px;
  color: white;
}
.cardcode {
  position: absolute;
  width: 100px;
  height: 20px;
  top: 60px;
  left: 280px;
  font-size: 14px;
  color: white;
}
.selfie {
  position: absolute;
  width: 60px;
  height: 60px;
  background: url(../../assets/quzhou-logo.png) no-repeat;
  background-size: 100% 100%;
  top: 20px;
  left: 20px;
}
.cardCreateTime {
  position: absolute;
  width: 300px;
  height: 80px;
  top: 150px;
  left: 30px;
  font-size: 14px;
  color: white;
}
.cardHolderNum {
  position: absolute;
  width: 300px;
  height: 80px;
  top: 175px;
  left: 30px;
  font-size: 14px;
  color: white;
}
</style>
