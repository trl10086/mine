<template>
	<view class="main">
		<view class="text58 fcenter mt320 textw800 red">招商团</view>
		<view class="button1 fcenter mt160 mainRow bgred textwbold text36" @click="getUserInfoClick" lang="zh_CN"
			open-type="getUserInfo" scope="userInfo">
			<image class="img32 mr32" src="../../static/logo.png" mode="aspectFill"></image>
			微信授权登录
		</view>
		<view @click="codelogin" class="button1 fcenter mt32 mainRow ciclrRed text36 red textwbold">
			<image class="img32 mr32" src="../../static/logo.png" mode="aspectFill"></image>
			手机快捷登录
		</view>
		<u-checkbox-group class="fcenter mt32">
			<u-checkbox :label-size="labelsize" name="啊实打实" active-color="red" shape="circle" v-model="checked"
				:disabled="false">阅读并同意招商团用户协议，服务协议和隐私政策。
			</u-checkbox>
		</u-checkbox-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked: false,
				labelsize: 18
			}
		},
		methods: {
			getUserInfoClick(e) {
				var that = this;
				var result = {};
				uni.getUserProfile({
					desc: '用于完善用户资料',
					lang: 'zh_CN',
					success: function(res) {
						result.detail = res;
						console.log(result)
						that.getUserInfo(result);
					},
					fail: function(res) {
						console.log('wx.getUserProfile=>用户拒绝了授权');
						console.log(res);
					},
				});
				// #ifdef MP-TOUTIAO
				// this.getUserInfo(e);
				// #endif
			},
			getUserInfo(e) {
				console.log(e)
				uni.login({
					success: function(loginRes) {
						console.log(loginRes.code)
					}
				});
			},
			codelogin() {
				console.log("654+564546")
				uni.navigateTo({
					url:'./VerificationCodeLogin'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
