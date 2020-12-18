import Vue from "vue";
import Vuex from "vuex";
import common from "./modules/common";
import options from "./modules/options";
import others from "./modules/others";
import jurisdiction from "./modules/jurisdiction"
import CertifiedPersonnel from "./modules/CertifiedPersonnel";
import VueXAlong  from 'vuex-along'
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    CertifiedPersonnel,
    options,
    others,
    jurisdiction
  },
  plugins: [VueXAlong({ //VueXAlong 引入插件 自定的名字 同上面import 
    name: 'along',     //存放在localStroage或者sessionStroage 中的名字
    local: { list: [], isFilter: true },      //是否存放在local中  false 不存放 如果存放按照下面session的配置配
    session: { list: [], isFilter: true } //如果值不为false 那么可以传递对象 其中 当isFilter设置为true时， list 数组中的值就会被过滤调,这些值不会存放在seesion或者local中
  })]
});
