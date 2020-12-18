<template>
  <div class="form-container">
    <div class="form-container-header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumb-self">
        <el-breadcrumb-item :to="{ path: '/other/active' }">人才活动</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider class="divider-self"></el-divider>
    </div>
    <div class="form-container-content">
      <el-form
        autocomplete="off"
        ref="form"
        :model="form"
        :rules="isRead ? {} : rules"
        label-width="120px"
      >
        <el-form-item label="活动名称:" prop="name">
          <el-input
            v-model="form.name"
            autocomplete="off"
            show-word-limit
            type="text"
            placeholder="请输入活动名称"
            class="content-width"
            maxlength="100"
            v-if="!isRead"
          ></el-input>
          <span v-else class="read-style">{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="活动编号:" prop="num" v-if="!isXcx">
          <el-input
            v-model="form.num"
            autocomplete="off"
            show-word-limit
            type="text"
            placeholder="请输入活动编号"
            class="content-width"
            maxlength="10"
            :disabled="isEdit"
            v-if="!isRead"
          ></el-input>
          <span v-else class="read-style">{{ form.num }}</span>
        </el-form-item>
        <el-form-item label="活动发起方:" prop="sponsor">
          <el-input
            v-model="form.sponsor"
            autocomplete="off"
            show-word-limit
            type="text"
            placeholder="请输入活动发起方"
            class="content-width"
            maxlength="100"
            v-if="!isRead"
          ></el-input>
          <span v-else class="read-style">{{ form.sponsor }}</span>
        </el-form-item>
        <el-form-item label="活动时间:" prop="date">
          <el-date-picker
            v-if="!isRead && !isNotNew"
            class="content-width"
            v-model="form.date"
            value-format="yyyy-MM-dd"
            type="date"
            :picker-options="pickerOptions"
            placeholder="选择日期"
          ></el-date-picker>
          <span v-else class="read-style">{{ form.date | formatDate(form.time) }}</span>
        </el-form-item>
        <el-form-item label="活动场地:" prop="eventField">
          <el-select
            class="content-width"
            v-model="form.eventField"
            placeholder="请选择场地"
            :disabled="isEdit"
            v-if="!isRead"
          >
            <el-option
              v-for="item in fieldAreas"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else class="read-style">{{ form.eventField | getEventFieldById(fieldAreas) }}</span>
        </el-form-item>
        <el-form-item label="活动时间段:" prop="time" v-if="!isRead && !isXcx && !isNotNew" >
          <el-select
            multiple
            class="content-width"
            v-model="form.time"
            placeholder="请选择活动时间段"
            v-if="!isRead"
            no-data-text="请选择活动时间和活动场地"
            @remove-tag="removeTag"
            @change="timeChange"
          >
            <el-option
              v-for="item in newTimeAreas"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.used"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item v-if="!isRead && !isXcx" label="活动时长（h）:">
          <span class="read-style">{{ form.time | getTimerLong }}</span>
        </el-form-item>
        <el-form-item v-if="isRead" label="活动时长（h）:" prop="duration">
          <span class="read-style">{{ form.duration }}</span>
        </el-form-item>
        <el-form-item label="活动名额:" prop="ifQuota" v-if="!isXcx">
          <el-radio-group :disabled="isEdit" v-model="form.ifQuota" v-if="!isRead">
            <el-radio :label="2">不要求男女比例</el-radio>
            <el-radio :label="1">要求男女比例</el-radio>
          </el-radio-group>
          <span v-else class="read-style">{{ form.ifQuota == 1 ? '要求男女比例' : '不要求男女比例' }}</span>
        </el-form-item>
        <el-form-item v-if="form.ifQuota == 2 && !isXcx" label="活动总名额:" prop="eventQuota">
          <el-input-number
            class="content-width"
            v-model="form.eventQuota"
            placeholder="请输入总活动名额"
            @blur="changeNumber('eventQuota')"
            :controls="false"
            :step-strictly="true"
            :min="0"
            v-if="!isRead"
          ></el-input-number>
          <span v-else class="read-style">{{ form.eventQuota }}</span>
        </el-form-item>
        <el-form-item v-if="isXcx && isRead" label="活动参与人数:">
          <span class="read-style">{{ form.eventQuota }}</span>
        </el-form-item>
        <el-form-item label="活动状态:" v-if="isRead">
          <span class="read-style">{{ form.status | showStatus(isXcx) }}</span>
        </el-form-item>
        <el-form-item label="活动类型:" v-if="isRead">
          <span class="read-style">{{ isXcx ? '小程序发起' : '后台创建' }}</span>
        </el-form-item>
        <template v-if="form.ifQuota == 1">
          <el-form-item label="男士活动名额:" prop="maleQuota">
            <el-input-number
              class="content-width"
              v-model="form.maleQuota"
              placeholder="请输入男士活动名额"
              @blur="changeNumber('maleQuota')"
              :controls="false"
              :step-strictly="true"
              :min="0"
              v-if="!isRead"
            ></el-input-number>
            <span v-else class="read-style">{{ form.maleQuota }}</span>
          </el-form-item>
          <el-form-item label="女士活动名额:" prop="femaleQuota">
            <el-input-number
              class="content-width"
              v-model="form.femaleQuota"
              placeholder="请输入女士活动名额"
              @blur="changeNumber('femaleQuota')"
              :controls="false"
              :step-strictly="true"
              :min="0"
              v-if="!isRead"
            ></el-input-number>
            <span v-else class="read-style">{{ form.femaleQuota }}</span>
          </el-form-item>
          <el-form-item label="活动总名额:" prop="hdme">
            <el-input-number
              class="content-width"
              disabled
              :value="allQuota"
              placeholder="请输入总活动名额"
              :controls="false"
              :step-strictly="true"
              :min="0"
              v-if="!isRead"
            ></el-input-number>
            <span v-else class="read-style">{{ form.femaleQuota + form.maleQuota }}</span>
          </el-form-item>
        </template>
        <el-form-item v-if="!isXcx && isRead" label="已报名人数:">
          <span
            class="read-style"
            v-if="num <= 0"
          >{{ num }}</span>
          <span
            class="read-style link"
            @click="goQuotaDetail"
            v-else
          >{{ num }}</span>
        </el-form-item>
        <el-form-item label="享受群体:" prop="ids" v-if="!isXcx">
          <select-equity-index :form="form" @submit="submitIds" :cardOnly="false" :isRead="isRead" />
        </el-form-item>
        <el-form-item label="活动详情:" prop="detail">
          <span class="edit-span" @click="detailEdit = true" v-if="!isRead">编辑</span>
          <span v-else class="read-style" v-html="form.detail"></span>
        </el-form-item>
        <el-form-item label="活动流程:" prop="process" v-if="!isXcx">
          <span class="edit-span" @click="processEdit = true" v-if="!isRead">编辑</span>
          <span v-else class="read-style" v-html="form.process"></span>
        </el-form-item>
        <el-form-item label="活动对象:" prop="target" v-if="!isXcx">
          <span class="edit-span" @click="targetEdit = true" v-if="!isRead">编辑</span>
          <span v-else class="read-style" v-html="form.target"></span>
        </el-form-item>
        <el-form-item label="联系方式:" prop="contact">
          <el-input
            v-model="form.contact"
            show-word-limit
            type="textarea"
            placeholder="请输入联系方式"
            maxlength="500"
            :rows="4"
            v-if="!isRead"
          ></el-input>
          <span v-else class="read-style">{{form.contact}}</span>
        </el-form-item>
        <el-form-item label="活动宣传图:" prop="picture" v-if="!isXcx">
          <mulitip-upload
            action="/tcmgr/file/upload"
            :imgs="form.picture"
            :maxCount="10"
            text="最多可上传10张，大小1M以内，尺寸750*344，支持扩展名：.png .jpg"
            @successUpload="pictureInput"
            projectName="others"
            v-if="!isRead"
          ></mulitip-upload>
          <div class="carousel-box" v-else>
            <el-carousel height="344px">
              <el-carousel-item v-for="(item, index) in form.picture" :key="index">
                <el-image :src="item.url" class="carousel-image" fit="cover"></el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-form-item>
        <div v-if="isRead">
          <h3>操作记录</h3>
          <hr />
          <ajax-table :tableData="tableData" :list="list" :isPager="false" />
        </div>
        <el-form-item>
          <el-button @click="cancel" style="margin-left:400px;">返 回</el-button>
          <el-button
            type="primary"
            @click="valuecheck('form')"
            :loading="loading"
            v-show="!isRead && !isApproval"
          >确定{{ id ? '修改' : '新增'}}</el-button>
          <el-button type="primary" @click="approvalCheckShow" v-show="isApproval">审批</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      :visible.sync="detailEdit"
      width="840px"
      :close-on-click-modal="false"
      append-to-body
    >
      <VueEditor
        ref="detail"
        placeholder="请输入活动详情"
        id="detail"
        :visible="detailEdit"
        :defaultContent="form.detail"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDesc('detail')">取 消</el-button>
        <el-button type="primary" @click="saveDesc('detail')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="processEdit"
      width="840px"
      :close-on-click-modal="false"
      append-to-body
    >
      <VueEditor
        ref="process"
        id="process"
        placeholder="请输入活动流程"
        :visible="processEdit"
        :defaultContent="form.process"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDesc('process')">取 消</el-button>
        <el-button type="primary" @click="saveDesc('process')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="targetEdit"
      width="840px"
      :close-on-click-modal="false"
      append-to-body
    >
      <VueEditor
        ref="target"
        id="target"
        placeholder="请输入活动对象"
        :visible="targetEdit"
        :defaultContent="form.target"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDesc('target')">取 消</el-button>
        <el-button type="primary" @click="saveDesc('target')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="showApprovalCheck"
      width="440px"
      :close-on-click-modal="false"
      append-to-body
      title="审批"
    >
      <el-form :model="checkForm" ref="checkForm" label-width="100px">
        <el-form-item
          label="是否通过"
          prop="result"
          :rules="[
            { required: true, message: '请选择', trigger: ['blur', 'change'] },
          ]"
        >
          <el-radio-group v-model="checkForm.result">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="审批意见"
          prop="opinion"
          :rules="[
            { required: true, message: '请输入审批意见', trigger: ['blur', 'change'] },
          ]"
        >
          <el-input type="textarea" :rows="4" :maxlength="200" placeholder="请输入审批意见" v-model="checkForm.opinion"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="showApprovalCheck = false">取 消</el-button>
          <el-button type="primary" :loading="subloading" @click="submitForm('checkForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEventIdDetailsApi,
  saveEventDetailsApi,
  getEventIdDetailsXcxApi,
  getActivitiesQueryApprovalByFeidApi,
  saveEventEditApi,
  saveEventAddApi,
  checkActivities,
  findEventTime,
  getNumByEventId
} from "@/api/api";
import SelectEquityIndex from "@c/checkEquity";
import { emptyArr } from "@/utils/validator";
import { deepCopy, formatLocationOrigin, needlim, formatTime } from "@/utils";
import MulitipUpload from "@c/upload/multipleUpload";
import IsOneUpload from "@c/upload/isOneUpload";
import VueEditor from "@c/editor";
import { getTimesArr } from "./config";
import {
  timeAreas,
  approvalStatus,
  activityStatus,
} from "./config";
import { mapActions, mapGetters, mapState } from "vuex";
const FORM = {
  cardIds: [],
  categoryIds: [],
  talentHonourIds: [],
  educIds: [],
  titleIds: [],
  qualityIds: [],
  picture: [],
  time: [],
  eventField: 1,
  ifQuota: 2
};
let oldLen = 0;
export default {
  name: "ExtendPagesAddOrEditTravel",
  components: {
    SelectEquityIndex,
    MulitipUpload,
    IsOneUpload,
    VueEditor,
  },
  props: {},
  data() {
    const checkIds = (rule, value, callback) => {
      const {
        cardIds,
        categoryIds,
        educIds,
        titleIds,
        qualityIds,
        talentHonourIds,
      } = this.form;
      const arr = [].concat(
        cardIds,
        categoryIds,
        educIds,
        titleIds,
        qualityIds,
        talentHonourIds
      );
      if (arr.length <= 0) {
        callback(new Error("请设置享受群体"));
      } else {
        callback();
      }
    };
    return {
      timeAreas: timeAreas,
      id: "",
      loading: false,
      subloading: false,
      form: deepCopy(FORM),
      rules: {
        name: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: ["change", "blur"],
          },
        ],
        num: [
          {
            required: true,
            message: "请输入活动编号",
            trigger: ["change", "blur"],
          },
        ],
        sponsor: [
          {
            required: true,
            message: "请输入活动发起方",
            trigger: ["change", "blur"],
          },
        ],
        date: [
          {
            required: true,
            message: "请选择活动时间",
            trigger: ["change", "blur"],
          },
        ],
        time: [
          {
            required: true,
            message: "请选择活动时间段",
            trigger: ["change", "blur"],
          },
        ],
        eventField: [
          {
            required: true,
            message: "请选择活动场地",
            trigger: ["change", "blur"],
          },
        ],
        ifQuota: [
          {
            required: true,
            message: "请选择活动名额",
            trigger: ["change", "blur"],
          },
        ],
        maleQuota: [
          {
            required: true,
            message: "请输入男士活动名额",
            trigger: ["change", "blur"],
          },
        ],
        femaleQuota: [
          {
            required: true,
            message: "请输入女士活动名额",
            trigger: ["change", "blur"],
          },
        ],
        eventQuota: [
          {
            required: true,
            message: "请输入活动总名额",
            trigger: ["change", "blur"],
          },
        ],
        ids: [
          { required: true, validator: checkIds, trigger: ["change", "blur"] },
        ],
        detail: [
          {
            required: true,
            message: "请输入活动详情",
            trigger: ["blur", "change"],
          },
        ],
        target: [
          {
            required: true,
            message: "请输入活动对象",
            trigger: ["blur", "change"],
          },
        ],
        process: [
          {
            required: true,
            message: "请输入活动流程",
            trigger: ["blur", "change"],
          },
        ],
        contact: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: ["blur", "change"],
          },
        ],
        picture: [
          {
            required: true,
            validator: emptyArr,
            message: "请上传活动宣传图",
            trigger: ["blur", "change"],
          },
        ],
      },
      targetEdit: false,
      processEdit: false,
      detailEdit: false,
      showApprovalCheck: false,
      tableData: {},
      list: [],
      checkForm: {
        result: "",
        opinion: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      useTimes: [],
      newTimeAreas: [],
      useTimeByEvent: {},
      num: 0, // 已报名人数
    };
  },
  created() {
    this.id = this.$route.query.id || "";
    if (this.id) {
      this.getScenicDetails(this.id);
      this.getNum(this.id)
    }
  },
  watch: {
    "form.eventField"(val, old) {
      const { date } = this.form;
      if (old) {
        this.$set(this.form, "time", []);
      }
      if (val && date) {
        this.getUseTime(val, date);
      }
    },
    "form.date"(val, old) {
      const { eventField } = this.form;
      if (old) {
        this.$set(this.form, "time", []);
      }
      if (val && eventField) {
        this.getUseTime(eventField, val);
      }
    }
  },
  computed: {
    title() {
      const { type = 0, approval = 0 } = this.$route.query;
      if (approval) {
        return "审批";
      }
      if (type == 0) {
        return "新建";
      } else if (type == 1) {
        return "查看";
      } else if (type == 2) {
        return "编辑";
      }
    },
    isNotNew() {
      let type = this.$route.query.type;
      return type != 0;
    },
    isRead() {
      let type = this.$route.query.type;
      return type == 1;
    },
    isEdit() {
      let type = this.$route.query.type;
      return type == 2;
    },
    isXcx() {
      let type = this.$route.query.xcx || 0;
      return type == 1;
    },
    isApproval() {
      let type = this.$route.query.approval || 0;
      return type == 1;
    },
    ...mapState({
      fieldAreas: (state) => state.others.eventField,
    }),
    allQuota() {
      const { maleQuota, femaleQuota } = this.form;
      const sum = (maleQuota ? maleQuota : 0) + (femaleQuota ? femaleQuota : 0);
      this.$set(this.form, "eventQuota", sum);
      this.$refs.form.validateField("eventQuota");
      return sum;
    },
  },
  mounted() {},
  methods: {
    ...mapActions(['getOtherApprovalNum']),
    async getNum(id) {
      try {
        this.num = await getNumByEventId({
          eventId: id
        })
      } catch (e) {} finally {
      }
    },
    changeNumber(key){
      if (!this.form[key]) {
        this.$set(this.form, key, 0)
      }
    },
    setUserTime() {
      const { timeAreas = [], useTimes = [] } = this;
      const { eventField = null, date = null, time = [] } = this.form;
      if (!eventField || !date) {
        return [];
      }
      const timeMap = Object.values(timeAreas);
      let n = timeMap.map((item) => {
        if (useTimes.includes(item.value)) {
          return {
            ...item,
            label: item.label + ' (已占用)',
            used: true,
          };
        } else {
          return {
            ...item,
            used: false,
          };
        }
      });
      const now = formatTime(new Date(), "yyyy-MM-dd");
      const nowTime = formatTime(new Date(), "yyyy-MM-dd HH:mm");
      if (now == date) {
        let HHmm = nowTime.split(" ")[1];
        let hmarr = HHmm.split(":");
        let hh = hmarr[0];
        let mm = hmarr[1];
        if (Number(mm) > 30) {
          hh = Number(hh) + 1;
          mm = 0;
        } else {
          mm = 1;
          hh = Number(hh);
        }
        let num = hh * 2 + mm + 1;
        n = n.map((item) => {
          if (item.value < num) {
            if (item.label.indexOf('(已占用)') > -1) {
              item.label = item.label.replace(' (已占用)', '')
            }
            return {
              ...item,
              label: item.label + ' (已过期)',
              used: true,
            };
          }
          return item;
        });
      }
      this.newTimeAreas = n;
    },
    async getUseTime(eventField, date) {
      try {
        if (eventField && date) {
          const params = {
            efid: eventField,
            date: date,
          };
          const res = await findEventTime(params);
          if (res) {
            let { timeInterval } = res;
            this.useTimes = timeInterval.split(",").map((i) => Number(i));
            const eventField1 = this.useTimeByEvent.eventField || ''
            const date1 = this.useTimeByEvent.date || ''
            const time1 = this.useTimeByEvent.time || []
            if (this.id && eventField == eventField1 && date == date1) {
              this.useTimes = this.useTimes.filter((item) => !time1.includes(item))
            }
          } else {
            this.useTimes = [];
          }
          this.setUserTime();
        }
      } catch (e) {
        console.log("e", e);
      }
    },
    valuecheck(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            let params = {
              ...this.form,
              card: this.form.cardIds || [],
              category: this.form.categoryIds || [],
              honour: this.form.talentHonourIds || [],
              education: this.form.educIds || [],
              title: this.form.titleIds || [],
              quality: this.form.qualityIds || [],
            };
            let pictures = params.picture
              .map((item) => {
                let url = formatLocationOrigin(item.url);
                return url;
              })
              .toString();
            let sTime = this.form.time.sort((a, b) => a - b);
            let start, end;
            start = sTime[0];
            end = sTime[sTime.length - 1];
            start = timeAreas[start].label.split(" ~ ")[0] + ":00";
            end = timeAreas[end].label.split(" ~ ")[1] + ":00";
            params.startTime = this.form.date + " " + start;
            params.endTime = this.form.date + " " + end;
            params.duration = this.form.time.length * 0.5;
            params.picture = pictures;
            params.time = params.time.toString();
            this.loading = true;
            const title = this.id ? "修改操作" : "新增操作";
            const message = this.id
              ? "是否确定修改此活动？<br/><span style='color: rgb(255, 153, 0)'>注意：如果修改活动的享受群体、活动名额，不影响原来已经报名成功的人才。</span>"
              : "是否确定创建此活动？";
            await this.$alert(message, title, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: true,
              dangerouslyUseHTMLString: true,
            });
            if (this.id) {
              await saveEventEditApi(params);
            } else {
              await saveEventAddApi(params);
            }
            this.$message.success(`${this.id ? "修改" : "新建"}成功`);
            this.$router.go(-1);
          } catch (e) {
            if (e && e.status == 2801) {
              this.$message.error("该活动编号已存在，请重新输入");
            }
          } finally {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    approvalCheckShow() {
      this.showApprovalCheck = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const params = {
              ...this.checkForm,
              feid: this.id,
            };
            this.subloading = true
            await checkActivities(params);
            this.getOtherApprovalNum();
            this.$message.success("审批完成");
            this.$router.go(-1);
          } catch (e) {
            console.log(e);
          } finally {
            this.subloading = false
          }
        } else {
          return false;
        }
      });
    },
    async getScenicDetails(id) {
      try {
        if (this.isXcx) {
          const params = {
            feid: id,
          };
          const res = await getEventIdDetailsXcxApi(params);
          this.form = {
            ...res,
          };
          const jilu = await getActivitiesQueryApprovalByFeidApi(params);
          this.list = jilu || [];
          this.tableData = {
            id: "evEvent",
            arr: [
              { label: "序号", prop: "", type: "index", minWidth: 80 },
              { label: "操作时间", prop: "createTime" },
              { label: "类型", prop: "typeString" },
              { label: "操作人", prop: "username" },
              {
                label: "审批结果",
                prop: "resultString",
              },
              { label: "审批意见/操作原因", prop: "opinion" },
            ],
          };
        } else {
          const params = {
            eventId: id,
          };
          const res = await getEventIdDetailsApi(params);
          this.form = {
            ...res,
            cardIds: res.card || [],
            categoryIds: res.category || [],
            talentHonourIds: res.honour || [],
            educIds: res.education || [],
            titleIds: res.title || [],
            qualityIds: res.quality || [],
            picture:
              (res.picture &&
                res.picture.split(",").map((i) => {
                  return {
                    url: needlim(i),
                  };
                })) ||
              [],
          };

          if (!this.isRead) {
            let time = [];
            if (res.time) {
              let t = res.time;
              time = t.split(",").map((item) => Number(item));
            }
            this.useTimeByEvent = {
              time: time,
              date: res.date,
              eventField: res.eventField
            };
            this.$set(this.form, "time", time);
          }
          this.tableData = {
            id: "evEvent",
            arr: [
              { label: "序号", prop: "", type: "index", minWidth: 80 },
              { label: "操作时间", prop: "createTime" },
              { label: "类型", prop: "typeName" },
              { label: "操作人", prop: "userName" },
              { label: "审批意见/操作原因", prop: "opinion" },
            ],
          };
          this.list = res.evEventLogBOList || [];
          delete this.form.card;
          delete this.form.category;
          delete this.form.honour;
          delete this.form.education;
          delete this.form.quality;
        }
      } catch (e) {}
    },
    cancel() {
      this.$router.go(-1);
    },
    submitIds(val) {
      this.form = {
        ...val,
      };
      this.$refs["form"].validateField("ids");
    },
    pictureInput(arr) {
      this.$set(this.form, "picture", arr);
      this.$refs["form"].validateField("picture");
    },
    cancelDesc(key) {
      this.$set(this.form, key, this.form[key]);
      this.closeDialog();
    },
    closeDialog() {
      this.targetEdit = false;
      this.processEdit = false;
      this.detailEdit = false;
    },
    saveDesc(key) {
      const content = this.$refs[key].content;
      this.$set(this.form, key, content);
      this.$refs["form"].validateField(key);
      this.closeDialog();
    },

    goQuotaDetail() {
      const { eventId } = this.form;
      this.$router.push({
        path: `/other/active/QuotaDetail/${eventId}`,
      });
    },
    removeTag(tag) {
      const { time } = this.form;
      if (time.length >= 2) {
        const sortTime = deepCopy(time).sort((a, b) => a - b);
        let min = 0;
        let max = 0;
        sortTime.map((item) => {
          if (item < tag) {
            min++;
          } else {
            max++;
          }
        });
        if (max >= min) {
          let removeTime = sortTime.slice(-max);
          this.$set(this.form, "time", removeTime);
          oldLen = removeTime.length;
        } else {
          let removeTime = sortTime.slice(0, min);
          this.$set(this.form, "time", removeTime);
          oldLen = removeTime.length;
        }
      }
    },
    timeChange(val) {
      if (val.length == 1) {
        const { useTimes, newTimeAreas } = this;
        const select = val[0];
        let min = 0;
        let max = 49;
        let minTem = -49;
        let maxTem = 49;
        useTimes.forEach((item) => {
          let tem = item - select;
          if (tem > 0 && tem < maxTem) {
            maxTem = tem;
            max = item;
          }
          if (tem < 0 && tem > minTem) {
            minTem = tem;
            min = item;
          }
        });
        this.newTimeAreas = newTimeAreas.map((item) => {
          if (item.value < min) {
            return {
              ...item,
              used: true,
            };
          } else if (item.value > max) {
            return {
              ...item,
              used: true,
            };
          } else {
            return {
              ...item,
            };
          }
        });
      }
      if (val.length == 0) {
        this.setUserTime();
      }

      if (val.length > oldLen) {
        oldLen = val.length;
        if (val.length >= 2) {
          let sortTime = deepCopy(val).sort((a, b) => a - b);
          let min = sortTime[0];
          let max = sortTime[sortTime.length - 1];
          let tem = [];
          for (let i = 1; i <= 48; i++) {
            if (i >= min && i <= max) {
              tem.push(i);
            }
          }
          this.$set(this.form, "time", tem);
        }
      } else {
        let sortTime = deepCopy(val).sort((a, b) => a - b);
        let ac = sortTime;
        let index = 0;
        ac.forEach((a, b) => {
          if (ac[b + 1] && a + 1 != ac[b + 1]) {
            index = ac[b] + 1;
          }
        });
        if (index > 0) {
          this.removeTag(index);
        }
      }
    },
  },
  filters: {
    formatDate(date = "", time = "") {
      if (!time) {
        return "-";
      }
      let nDate = date.split(" ")[0];
      let timeArr = typeof time == "string" ? time.split(",") || [] : time;
      let times = deepCopy(timeArr);
      const timeStr = getTimesArr(times);
      return `${nDate}  ${timeStr}`;
    },
    getTimerLong(time) {
      if (!time) {
        return "-";
      }
      const long =
        typeof time == "string"
          ? time.split(",").length * 0.5
          : time.length * 0.5;
      return long || "-";
    },
    getEventFieldById(id, eventField) {
      if (!id) {
        return "-";
      }
      const filterField = eventField.filter((item) => item.value == id);
      if (filterField && filterField.length > 0) {
        return filterField[0].label;
      }
      return "-";
    },
    showStatus(status, isXcx) {
      if (status) {
        let keyStr = Number(status);
        const obj = Object.assign({}, approvalStatus, activityStatus)
        return obj[keyStr].label;
      } else {
        return "-";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.edit-span {
  cursor: pointer;
  height: 20px;
  font-size: 14px;
  color: rgba(54, 152, 233, 1);
  text-decoration: underline;
}
.carousel-box {
  margin-top: 10px;
  width: 750px;
  .carousel-image {
    height: 100%;
    width: 100%;
  }
}
.link {
  text-decoration: underline;
  color: #169bd5;
  cursor: pointer;
}
</style>
