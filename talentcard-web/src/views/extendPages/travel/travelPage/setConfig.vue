<template>
  <el-dialog
    title="配置旅游数量"
    :show-close="false"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="640px"
    :before-close="close"
  >
    <el-form ref="form" :model="form" label-width="200px">
      <el-form-item
        label="每月旅游总数:"
        prop="num"
        :rules="[
          { required: true, message: '请输入每月旅游总数', trigger: 'blur' },
        ]"
      >
        <el-input-number
          style="width: 202px"
          v-model.number="form.num"
          :min="1"
          :max="99999999"
          :controls="false"
          placeholder="请填写每月可领取的旅游总数量"
          class="content-width"
        ></el-input-number>
      </el-form-item>
      <p style="margin-bottom:20px">不同人才卡，所有景点的每年可领取旅游次数：</p>
      <template v-for="(item, index) in form.cardPOList">
        <el-form-item
          :label="`${item.title}/${item.initialWord}`"
          :prop="'cardPOList.' + index + '.tripTimes'"
          :rules="{
            required: true,
            message: '请输入人才卡旅游限制次数',
            trigger: 'blur',
          }"
        >
          <el-input-number
            style="width: 202px"
            v-model="item.tripTimes"
            :min="1"
            :max="99999999"
            :controls="false"
            placeholder="请输入每月旅游总数"
          ></el-input-number>&nbsp次
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit('form')" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getConfig,
  setConfig,
  getCardsFilterBase,
  setTripTimes
} from "@/api/api";

export default {
  name: "set-config",
  props: ["dialogVisible"],
  components: {},
  data() {
    const checkNum = (rule, value, callback) => {
      if (value || value == 0) {
        if (Number(value) || value == 0) {
          if (Number(value) < 1 || Number(value) > 9999999) {
            callback(new Error("请输入1-9999999之内的数字"));
          } else {
            callback();
          }
        } else {
          callback(new Error("每月旅游数量必须为数字值"));
        }
      } else {
        callback(new Error("请填写每月可领取的旅游总数量"));
      }
    };
    return {
      form: {
        num: 0,
        cardPOList: [
          {
            tripTimes: ""
          }
        ]
      },
      loading: false
    };
  },
  async created() {
    const params = {
      key: "SCENIC_NUM"
    };
    try {
      this.getCards();
      const res = await getConfig(params);
      this.form.num = Number(res) || 0;
    } catch (e) {}
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const params = {
            key: "SCENIC_NUM",
            value: this.form.num
          };
          console.log(this.form);
          let cardIdList = [];
          let TripTimesList = [];
          for (let i in this.form.cardPOList) {
            cardIdList.push(this.form.cardPOList[i].cardId);
            TripTimesList.push(parseInt(this.form.cardPOList[i].tripTimes));
          }
          const query = {
            cardId: cardIdList,
            tripTimes: TripTimesList
          };
          console.log(query);
          try {
            this.loading = true;
            await setConfig(params);
            await setTripTimes(query);
            this.$message.success("保存旅游数量成功");
            this.$emit("close");
          } catch (e) {
          } finally {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    async getCards() {
      try {
        const res = await getCardsFilterBase();
        this.form.cardPOList = res;
      } catch (e) {}
    }
  }
};
</script>

<style lang="less" scoped></style>
