<template>
	<view class="main" style="margin-top: 25%;">
		<u-button :custom-style="customStyle" type="success" open-type="getPhoneNumber"
			@getphonenumber="onGetPhoneNumber" shape="square">授权获取手机号</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: '',
				token1: '',
				user_id: '',
				customStyle: {
					marginTop: '150rpx',
					fontWeight: 'bold',
					height: '100rpx',
					width: '656rpx',
					background: '#5ED1A9'
				}
			}
		},
		onLoad(option) {
			this.user_id = option.user_id;
			this.token1 = option.token;
			var self = this;
			uni.login({
				scopes: 'auth_base',
				success(loginResult) {
					self.code = loginResult.code;
				},
				fail(error) {

				}
			});
		},
		methods: {
			//拉起获取手机号授权，绑定手机号
			onGetPhoneNumber(e) {
				if (e.detail.errMsg == "getPhoneNumber:fail user deny") {} else {
					//允许授权  
					// console.log(e.detail)
					var self = this;
					this.$u.api.binding({
						code: this.code,
						iv: e.detail.iv,
						encryptedData: e.detail.encryptedData,
						user_id: this.user_id,
					}).then(res => {
						self.$u.vuex('token', self.token1)
						self.$u.route({
							type: 'switchTab',
							url: 'pages/tabBar/home'
						})
					}).catch(err => {

					})
				}
			},

		}
	}
</script>

<style>

</style>
