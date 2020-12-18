<template>
  <div class="form-container">
    <div class="form-container-header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumb-self">
        <el-breadcrumb-item :to="{ path: '/extend/travel' }">免费旅游</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider class="divider-self"></el-divider>
    </div>
    <div class="form-container-content details-box">
      <p class="title">景区信息</p>
      <div class="detail-header">
        <div class="avatar-box">
          <el-image style="width: 320px; height: 180px" :src="form.avatar" fit="cover"></el-image>
        </div>
        <div class="content-box">
          <div class="title-box">
            <h3>景区名称：{{form.name}}</h3>
          </div>
         <!-- <div class="limit">入园限制: {{ formatLimit() }}</div> -->
          <div class="limit">景区等级: {{ form.grade | formatLevel }}</div>
          <div class="limit">景区位置: {{ form.area | formatArea }} {{form.location}}</div>
          <div class="limit">特色简介: {{ form.intro }}</div>
          <div class="limit">优惠折扣: {{ form.discount ? `${form.discount}折` : '-' }}</div>
        </div>
        <div class="qrcode-box">
          <div class="qr-code">
            <el-image :src="form.qrCode" fit="cover" style="width: 74px; height: 74px"></el-image>
          </div>
          <p class="down-text">
            <i class="el-icon-download"></i>
            <a @click="openQrDialog" class="download">二维码下载</a>
          </p>
        </div>
      </div>
      <div class="enjoy-content">
        <p class="sub-title">享受群体</p>
        <div class="qunti">
          <template v-for="item in cardList">
            <span
              class="items"
              :key="item.label"
              v-if="form.cardIds.includes(item.cardId)"
            >{{`${item.name}/${item.initialWord}`}}</span>
          </template>
          <template v-for="item in honours">
            <span
              class="items"
              :key="item.text"
              v-if="form.talentHonourIds.includes(item.type)"
            >{{item.text}}</span>
          </template>
          <template v-for="item in categories">
            <span
              class="items"
              :key="item.text"
              v-if="form.categoryIds.includes(item.type)"
            >{{item.text}}</span>
          </template>
          <template v-for="item in educations">
            <span
              class="items"
              :key="item.text"
              v-if="form.educIds.includes(item.type)"
            >{{item.text}}</span>
          </template>
          <template v-for="item in titles">
            <span
              class="items"
              :key="item.text"
              v-if="form.titleIds.includes(item.type)"
            >{{item.text}}</span>
          </template>
          <template v-for="item in qualities">
            <span
              class="items"
              :key="item.text"
              v-if="form.qualityIds.includes(item.type)"
            >{{item.text}}</span>
          </template>
        </div>
      </div>
      <div class="detail-content">
        <p class="sub-title">景区介绍</p>
        <div v-html="form.desc"></div>
      </div>
      <div class="carousel-box">
        <el-carousel height="344px">
          <el-carousel-item v-for="(item, index) in form.picture" :key="index">
            <el-image :src="item" class="carousel-image" fit="cover"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="detail-content">
        <p class="sub-title">备注</p>
        <div v-html="form.extra"></div>
      </div>
      <div class="go-back">
        <el-button @click="back()">返 回</el-button>
      </div>
    </div>
    <qrcodeDownloader :dialogState="dialogVisible" :id="this.$route.query.id.toString()" @closed="closed"></qrcodeDownloader>  
  </div>
</template>

<script>
import { getScenicDetailsApi, getCardsFilterBase } from "@/api/api";
import { gradeConfig, areaConfig } from "../../config";
import event from "@v/nav4/mixin";
import { mapState } from 'vuex'
import qrcodeDownloader from '../../../../components/qrcodeDownloader'
export default {
  name: "ExtendPagesReadTravel",
  props: {},
  components:{qrcodeDownloader},
  data() {
    return {
      id: "",
      dialogVisible:false,
      form: {
        name: "",
        rate: "",
        unit: "",
        times: "",
        grade: "",
        area: null,
        intro: null,
        location: null,
        cardIds: [],
        categoryIds: [],
        educIds: [],
        titleIds: [],
        qualityIds: [],
        talentHonourIds: [],
        avatar: "",
        picture: [],
        desc: "",
        extra: "",
        qrCode: "",
      },
      unitOpt: {
        1: { label: "年", value: 1 },
        2: { label: "季", value: 2 },
        3: { label: "月", value: 3 }
      },
      cardList: []
    };
  },
  mixins: [event],
  created() {
    this.id = this.$route.query.id || "";
    if (this.id) {
      this.getScenicDetails(this.id);
      this.init();
    }
  },
  methods: {
    async init() {
      try {
        const res = await getCardsFilterBase();
        this.cardList = [...res];
      } catch (e) {
        console.log(e);
      }
    },
    async getScenicDetails(id) {
      try {
        const params = {
          scenicId: id
        };
        const res = await getScenicDetailsApi(params);
        this.form = {
          ...res,
          talentHonourIds: res.talentHonourIds || []
        };
      } catch (e) {}
    },
    formatLimit() {
      const { rate, unit, times } = this.form;
      let pin = "";
      let message = "";
      try {
        pin = this.unitOpt[unit].label || "";
        message = `${rate}${pin}/${times}次`;
      } catch (e) {
        message = "";
      }
      return message;
    },
    back() {
      this.$router.go(-1);
    },
    openQrDialog(){
      this.dialogVisible=true;
    },
    closed(){
      this.dialogVisible=false;
    }
  },
  filters: {
    formatLevel(val) {
      if (val) {
        return gradeConfig[val].label;
      } else {
        return "无";
      }
    },
    formatArea(val) {
      if (val && val != 10) {
        return areaConfig[val].label;
      } else {
        return ''
      }
    }
  },
  computed: {
    ...mapState({
      categories: (state) => state.options.categories,
      honours: (state) => state.options.honours,
      titles: (state) => state.options.titles,
      qualities: (state) => state.options.qualities,
      educations: (state) => state.options.educations,
    }),
  }
}
</script>

<style lang="less" scoped>
.sub-title() {
  font-weight: bold;
  color: #333;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  margin-top: 19px;
  margin-bottom: 13px;
}

.details-box {
  .title {
    height: 14px;
    font-size: 14px;
    color: #333;
    line-height: 14px;
    margin-bottom: 22px;
    font-weight: bold;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      left: -10px;
      top: -2px;
      width: 4px;
      height: 18px;
      background-color: #0091e7;
    }
  }
  .detail-header {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    .avatar-box {
      //flex: 0 0 220px;
      //flex: 1 1 auto;
    }
    .content-box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 8px 24px;
      height: 180px;
      box-sizing: border-box;
      .title-box {
        display: flex;
        align-items: center;
        & > h3 {
          height: 28px;
          font-size: 20px;
          line-height: 28px;
          color: #333;
          margin-right: 19px;
        }
      }
      .limit {
        color: #3698e9;
        font-size: 14px;
        line-height: 20px;
      }
    }
    .qrcode-box {
      .down-text {
        color: #1890ff;
        font-size: 14px;
        line-height: 20px;
        cursor: pointer;
      }
    }
  }
  .enjoy-content {
    .sub-title {
      .sub-title;
    }
    .qunti {
      display: flex;
      flex-flow: row wrap;
      .items {
        padding: 5px 21px;
        margin-bottom: 9px;
        font-size: 14px;
        font-weight: bold;
        height: 20px;
        line-height: 20px;
        border: 1px solid #1890ff;
        border-radius: 4px;
        margin-right: 9px;
        color: #1890ff;
      }
    }
  }
  .detail-content {
    margin-top: 13px;
    .sub-title {
      .sub-title;
    }
  }
  .carousel-box {
    margin-top: 10px;
    width: 750px;
    .carousel-image {
      height: 100%;
      width: 100%;
    }
  }
  
}
</style>