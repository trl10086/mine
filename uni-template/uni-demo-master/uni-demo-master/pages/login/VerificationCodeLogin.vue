<template>
	<view class="main">
		<view class="text36 black textw800 ml32 mt80">手机快捷登录</view>
		<u-form class="mh32 mt32" :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :rightIconStyle="{color: '#888', fontSize: '32rpx'}" :label-position="labelPosition" label=" "
				prop="phone" label-width="0">
				<u-input :border="border" placeholder="请输入手机号" v-model="model.phone" type="number" :clearable="false">
				</u-input>
				<u-button slot="right" type="error" size="mini" @click="getCode">{{codeTips}}</u-button>
				<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label=" " prop="code" label-width="0">
				<u-input :border="border" placeholder="请输入验证码" v-model="model.code" type="text" :clearable="false">
				</u-input>
			</u-form-item>

		</u-form>
		<view class="agreement-text mh32 mt32">
			登录即代表同意用户协议
		</view>
		<view class="mt80 mh32">
			<u-button class="mh32" :custom-style="formReady ? activeStyle : inactiveStyle" :disabled="!formReady" size="default"
				@click="login">提交
			</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				hidePage: false,
				model: {
					phone: '',
					uuid: '',
					code: '',
					password: '',
					rePassword: '',
				},
				formReady: true,
				activeStyle: {
					color: '#f3f4f6',
					marginTop: '20rpx',
					backgroundColor: '#E4352B'
				},
				inactiveStyle: {
					color: '#f3f4f6',
					marginTop: '20rpx',
					backgroundColor: '#FFA9A4'
				},
				rules: {
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: ['blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['blur'],
						}
					],
					code: [{
							required: true,
							message: '请输入验证码',
							trigger: ['change'],
						},
						{
							type: 'number',
							message: '验证码只能为数字',
							trigger: ['change'],
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: ['change', 'blur'],
						},
						{
							// 正则不能含有两边的引号
							pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/,
							message: '需同时含有字母和数字，长度在6-12之间',
							trigger: ['change', 'blur'],
						}
					],
					rePassword: [{
							required: true,
							message: '请重新输入密码',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.model.password;
							},
							message: '两次输入的密码不相等',
							trigger: ['change', 'blur'],
						}
					]
				},
				codeTips: '',
				errorType: ['message'],
				labelPosition: 'left',
				border: false,
				check: true,
			}
		},
		onLoad(option) {

		},
		onReady() {

		},
		methods: {
			wxAutoLogin(option) {
				// #ifdef H5
				const appid = this.$dy_config.wxH5AppId
				const scope = this.$dy_config.wxH5scope
				let isWxBrowser = this.$jwx.isWxBrowser() // 微信公众号登录
				if (appid != '' && isWxBrowser) {
					this.hidePage = true
					uni.showLoading({
						title: '自动登录中...',
						mask: true
					})
					setTimeout(() => {
						uni.hideLoading();
					}, 800);

					if (option.code != null) {
						this.$u.vuex('vuex_token', "123456")
						this.$u.vuex('vuex_user', {
							nickName: "uView用户"
						})
						this.$jwx.fuckWx(true, 1) // 这里的1指的是从登录页返回上一页。如果是当前页面的调用不需要额外返回一层
					} else {
						// snsapi_base现象为刚看到登录页面就跳转返回了。所以采用这种方法的，适合放在公众号入口，用户无感知。
						// snsapi_userinfo现象为看到登录页就需要授权登录。
						this.$jwx.goWxOauthUrl(appid, scope)
					}
				}
				// #endif
			},
			login() {
				uni.switchTab({
					url: '/pages/tabBar/home'
				});
				if (!this.$u.test.mobile(this.model.phone)) {
					this.$u.toast('请输入正确手机号1');
					return
				}
				if (this.model.code.length == 0) {
					this.$u.toast('请输入验证码');
					return
				}
			},
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode() {
				if (!this.$u.test.mobile(this.model.phone)) {
					this.$u.toast('请输入正确手机号');
					return
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码',
						mask: true
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 500);
				} else {
					this.$u.toast('请稍后再试');
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 100rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 28rpx;
		color: $u-content-color;
	}

	.agreement-text {
		display: flex;
		align-items: center;
		color: $u-tips-color;
	}
</style>
