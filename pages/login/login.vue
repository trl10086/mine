<template>
	<view class="main mainColumn mainAlignCenter" style="margin-top: 25%;">
		<view class="button1 textwbold text36" style="background-color: #5ED1A9;margin-top: 150rpx;"
			@click="getUserInfoClick" lang="zh_CN" open-type="getUserInfo" scope="userInfo">
			微信授权登录
		</view>
		<view class="button1 textwbold text36 mt24" style="color:#989898;background-color: #F4F4F4;" @click="goback"
			lang="zh_CN">
			取消
		</view>
		<u-checkbox-group class="fcenter mt32">
			<u-checkbox :label-size="labelsize" name="点餐" active-color="red" shape="circle" v-model="checked"
				:disabled="false"><text style="font-size: 24rpx;"
					@click="$u.route('pages/login/agreement')">阅读并同意用户协议和隐私政策</text>
			</u-checkbox>
		</u-checkbox-group>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked: false,
				labelsize: 20,
			}
		},
		methods: {
			//拉取授权
			getUserInfoClick(e) {
				var that = this;
				if (!that.checked) {
					that.$refs.uToast.show({
						title: '请先同意同意用户协议和隐私政策',
						type: 'error',
					})
					return
				}
				uni.getUserProfile({
					desc: '用于完善用户资料',
					lang: 'zh_CN',
					success: function(res) {
						that.getUserInfo(res);
					},
					fail: function(res) {
						console.log('wx.getUserProfile=>用户拒绝了授权');
						// console.log(res);
					},
				});
			},
			// 登录
			getUserInfo(userInfoResult) {
				// console.log(userInfoResult)
				var that = this;
				uni.login({
					scopes: 'auth_base',
					success(loginResult) {
						// console.log(loginResult);
						const data = {
							encryptedData: userInfoResult.encryptedData,
							iv: userInfoResult.iv,
							rawData: userInfoResult.rawData,
							signature: userInfoResult.signature,
							code: loginResult.code,
						};
						// console.log(data);
						that.$u.api.login(
							data
						).then(res => {
							if (res.data.is_bind_mobile == false) {
								uni.redirectTo({
									url: '/pages/login/bindPhone' + "?user_id=" + res.data
										.user_id +
										"&token=" + res.data.access_token
								})
								return
							} else {
								that.$u.vuex('token', res.data.access_token)
								that.$u.route({
									type: 'back'
								});
							}
						}).catch(err => {
							this.$refs.uToast.show({
								title: err.msg,
								type: 'error'
							})
							uni.stopPullDownRefresh()
						})
					},
					fail(error) {
						reject(error);
					}
				});
			},
			codelogin() {
				console.log("654+564546")
				uni.navigateTo({
					url: './VerificationCodeLogin'
				})
			},
			goback() {
				setTimeout(() => {
					this.$u.route({
						type: 'switchTab',
						url: 'pages/tabBar/home',
						params: {
							name: 'lisa',
						},
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F8FAFC;
	}
</style>
