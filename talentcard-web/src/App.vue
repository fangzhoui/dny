<template>
	<div id="app" @mousemove="moveEvent">
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	},
	data(){
    return {
      timmer: null,
     
    }
  },
  methods: {
    moveEvent(){
      let path = ['/login']
      if(!path.includes(this.$route.path)) { //如果不是登录页面的话页面停止进行30分钟后清空session
        clearTimeout(this.timmer);
        this.init();
      }
 
    },
 
    init(){
      this.timmer=setTimeout(()=>{
    
        //清除session
        sessionStorage.removeItem("sessionData");
        sessionStorage.clear();
        //清除缓存
        this.$cache.reset();
        //跳往登录页面
        this.$router.push({
          path: "/login",
 
      });
 
      },1*60*60*1000);//设置1小时清空session进入屏保
    },
  }

}

</script>

<style lang="less">
body {
	margin: 0px;
	padding: 0px;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}

#app {
	// position: absolute;
	// top: 0px;
	// bottom: 0px;
	height: 100%;
	width: 100%;
	background-color: #f3f6f9;
}
.el-container {
	background-color: #f3f6f9 !important;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>