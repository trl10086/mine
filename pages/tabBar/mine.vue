<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="user-cover">
			<!-- 1. 头部用户信息 -->
			<view v-if="!token" @click="sLogin" class="text36 white fontwe ml32 mainRow mainAlignCenter" style="height: 230rpx;">登录/注册</view>
			<view v-else>
				<view class="user-info">
					<view class="avatar"><u-avatar :src="datalist.avatar" mode="circle" size="100"></u-avatar></view>
					<view class="info">
						<view class="nickname">{{ datalist.nickname }}</view>
						<view class="tel">{{ datalist.mobile }}</view>
					</view>
				</view>
				<view class="balance">
					<view class="left-money money">
						<text>我的余额</text>
						<text>{{ datalist.balance }}</text>
					</view>

					<view @click="huiYuBalance" class="money">
						<view class="hy-money money">
							<text>回鱼收入</text>
							<text>{{ datalist.return_fish }}</text>
						</view>
					</view>
					<view @click="huiYuBalance" class="money">
						<view class="hy-money money">
							<text>中标金额</text>
							<text>{{datalist.back_bid_price}}</text>
						</view>
					</view>
					<navigator @click="bounce()" class="money">
						<view class="coupon money">
							<text>优惠券</text>
							<text>{{ datalist.coupon_num }}</text>
						</view>
					</navigator>
				</view>
			</view>
			<!-- 2. 优惠券购买 -->
			<view class="wrap-bg">
				<view class="coupon-container">
					<view class="title">{{ discount_list.config_list.title }}</view>
					<view class="descp">{{ discount_list.config_list.content }}</view>
					<view class="coupon-list">
						<view class="item" v-for="n in discount_list.list" :key="n.id" @click="onpay(n)">
							<text class="fontwe">{{ n.name }}</text>
							<text class="text32">{{ n.fish_pond_name }}</text>
							<view class="price">¥ {{ n.price }}</view>
						</view>
					</view>
				</view>
			</view>
			<u-popup v-model="showPay" mode="bottom" @close="backflow">
				<view class="card">
					<view class="mt32 fontwe">
						{{ discount_data.fish_pond_name }}
						<text class="text32 ml16" style="color: #F38B10;">￥{{ discount_data.price }}</text>
					</view>
					<view class="mt32">请选择支付方式</view>
					<u-cell-group>
						<u-cell-item title="微信支付" @click="payHandler" index="1" :arrow="false">
							<u-image width="28" height="28" :src="`/static/images/${selectedPay == '1' ? '' : 'no-'}pay-icon.png`" slot="right-icon"></u-image>
						</u-cell-item>
						<u-cell-item title="余额支付" @click="payHandler" index="3" :arrow="false">
							<u-image width="28" height="28" :src="`/static/images/${selectedPay == '3' ? '' : 'no-'}pay-icon.png`" slot="right-icon"></u-image>
						</u-cell-item>
					</u-cell-group>
					<button class="sub" @click="order_submit">立即支付</button>
				</view>
			</u-popup>
		</view>

		<!-- 3. 我的成绩 -->
		<view class="score wrap-in">
			<view class="title">我的成绩</view>
			<view class="list">
				<view class="item">
					<text>鱼获</text>
					<text>{{ !token ? 0 : datalist.fish_catch }}</text>
				</view>
				<view class="item">
					<text>次数</text>
					<text>{{ !token ? 0 : datalist.num }}</text>
				</view>
				<view class="item">
					<text>过百</text>
					<text>{{ !token ? 0 : datalist.fish_over }}</text>
				</view>
				<view class="item">
					<text>坑冠</text>
					<text>{{ !token ? 0 : datalist.the_first_num }}</text>
				</view>
			</view>
		</view>

		<!-- 4. 订单信息 -->
		<view class="score wrap-in">
			<view class="list">
				<view @click="myOrder">
					<view class="item">
						<u-image width="76" height="76" src="/static/images/myorder.png"></u-image>
						<text class="icon-title">我的订单</text>
					</view>
				</view>

				<view @click="subOrder">
					<view class="item">
						<u-image width="76" height="76" src="/static/images/suborder.png"></u-image>
						<text class="icon-title">预约订单</text>
					</view>
				</view>
				<view @click="collect">
					<view class="item">
						<u-image width="80" height="80" src="/static/images/myfav.png"></u-image>
						<text class="icon-title">我的收藏</text>
					</view>
				</view>
				<view @click="shopOrder">
					<view class="item">
						<u-image width="78" height="78" src="/static/images/myshare.png"></u-image>
						<text class="icon-title">商城订单</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 5. 隐私政策 和 员工端管理 -->

		<view class="score wrap-in">
			<u-cell-item :title-style="{ 'font-size': '32rpx', color: '#1A1B1D' }" title="推广分享" @click="shareHandler">
				<u-image class="private-icon" slot="icon" width="40" height="40" src="/static/images/tuiguang.png"></u-image>
			</u-cell-item>
			<u-cell-item :title-style="{ 'font-size': '32rpx', color: '#1A1B1D' }" title="隐私政策" @click="privateHandler">
				<u-image class="private-icon" slot="icon" width="48" height="48" src="/static/images/privateicon.png"></u-image>
			</u-cell-item>

			<u-cell-item
				:border-bottom="false"
				v-if="token && datalist.is_staff == 1"
				:title-style="{ 'font-size': '32rpx', color: '#1A1B1D' }"
				title="员工端管理"
				@click="staffHandler"
			>
				<u-image class="user-icon" slot="icon" width="48" height="48" src="/static/images/usericon.png"></u-image>
			</u-cell-item>
		</view>

		<!-- 6. 退出登录 -->
		<view class="leave"><button class="login-out" @click="onExit">退出登录</button></view>

		<!-- 推广和分享 -->
		<u-mask :show="showPopup" @click="showPopup = false">
			<view class="mainRow center" style="height: 100%;"><u-image :src="img" width="702rpx" height="1058rpx"></u-image></view>
		</u-mask>
	</view>
</template>

<script>
export default {
	onShow() {
		this.user();
		this.discount();
		console.log(this.token);
	},
	methods: {
		//点击遮罩层
		backflow() {
			console.log(111);
			this.showPay = false;
		},
		//点击跳转
		bounce() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '/pages/mine/coupon' + `?id=1`
			});
		},
		myOrder() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '/pages/mine/myOrder'
			});
		},
		subOrder() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '/pages/mine/subOrder'
			});
		},
		collect() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '/pages/mine/collect'
			});
		},
		shopOrder() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '/pages/mine/shopOrder'
			});
		},
		huiYuBalance() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '/pages/mine/huiYuBalance'
			});
		},
		sLogin() {
			if (this.token) {
				return false;
			} else {
				uni.navigateTo({
					url: '../login/login'
				});
				return true;
			}
		},
		privateHandler() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '/pages/mine/privateRule'
			});
		},
		staffHandler() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '/pages/staff/staff'
			});
		},
		shareHandler() {
			if (this.sLogin()) {
				return;
			}
			this.showPopup = true;
			let self = this;
			self.$u.api.share().then(res => {
				self.img = res.data.pic_url;
				console.log(1111, res);
			});
		},
		//退出登录
		onExit() {
			if (this.token) {
				this.$u.vuex('token', '');
				this.$refs.uToast.show({
					title: '登出成功',
					type: 'default',
					url: 'pages/tabBar/home',
					isTab: true
				});
			}
		},
		//获取用户信息
		user() {
			let self = this;
			self.$u.api.user_info({}).then(res => {
				self.datalist = res.data;
				console.log(1451,self.datalist)
			});
		},
		//优惠活动列表
		discount() {
			let self = this;
			self.$u.api.discount_list({}).then(res => {
				self.discount_list = res.data;
			});
		},
		payHandler(index) {
			this.selectedPay = index;
		},
		//支付
		onpay(n) {
			if (this.sLogin()) {
				return;
			}
			this.discount_data = n;
			//防抖
			this.$u.debounce(this.isshowPay, 500);
		},
		isshowPay() {
			this.showPay = true;
		},
		order_submit() {
			if (this.sLogin()) {
				return;
			}
			let self = this;
			const data = {
				order_type: 3,
				pay_type: self.selectedPay,
				coupon_discount_id: self.discount_data.id
			};
			self.$u.api
				.fish_submit({
					form_data: JSON.stringify(data)
				})
				.then(res => {
					console.log(res);
					console.log(5423, res.data.list);
					if (res.data&&res.data.pay_type == 1) {
						
						self.queue_id = res.data.list.queue_id;
						self.token = res.data.list.token;
						self.zf_list = res.data.list;
						self.WxPaymentTwo();
					} else {
						self.$refs.uToast.show({
							title: '购买成功',
							type: 'default',
						});
						this.user();
						self.showPay = false;
					}
					
					// self.showPay = false;
					// self.$refs.uToast.show({
					// 	title: '购买成功',
					// 	type: 'default',
					// });
					
				})
				.catch(res => {
					self.showPay = false;
					self.$refs.uToast.show({
						title: res.msg,
						type: 'error'
					});
				});
			self.selectedPay = 1;
		},
		//微信支付第二部
		WxPaymentTwo() {
			console.log(2);
			let self = this;
			self.$u.api2
				.getWxPaymentTwo(self.zf_list)
				.then(res => {
					self.wxTow_id = res.data.id;
					console.log(2, res);
					self.wxPaymentThree();
				})
				.catch(err => {
					console.log(err);
				});
		},
		//微信支付第三步
		wxPaymentThree() {
			console.log(3);
			let self = this;
			self.$u.api2
				.getWxPaymentThree({ id: self.wxTow_id })
				.then(res => {
					self.pay_type = res.data.list[0].key;
					console.log(3, res.data.list[0].key);
					self.wxPaymentFour();
				})
				.catch(err => {
					console.log(err);
				});
		},
		//微信支付第四步
		wxPaymentFour() {
			let self = this;
			self.$u.api2
				.getWxPaymentFour({
					id: self.wxTow_id,
					pay_type: self.pay_type
				})
				.then(res => {
					self.wxPayment = res.data;
					console.log(4, self.wxPayment);
					if (res.code == 0) {
						// 仅作为示例，非真实参数信息。
						uni.requestPayment({
							appid: self.wxPayment.appId,
							id: self.wxPayment.id,
							provider: 'wxpay',
							timeStamp: self.wxPayment.timeStamp,
							nonceStr: self.wxPayment.nonceStr,
							package: self.wxPayment.package,
							signType: self.wxPayment.signType,
							paySign: self.wxPayment.paySign,

							success: function(res) {
								self.$refs.uToast.show({
									title: '支付成功',
									type: 'default',
								});
								this.user();
								self.showPay = false;
								console.log('success:' + JSON.stringify(res));
							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
							}
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	data() {
		return {
			showPopup: false,
			showPay: false,
			selectedPay: 1,
			discount_data: '',
			//用户信息
			datalist: '',
			discount_list: '',
			img: ''
		};
	}
};
</script>

<style lang="scss">
.leave {
	height: 120rpx;
}
.wrap {
	width: 100%;
	background-color: #f7f7f8;

	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;
	}
}

.user-cover {
	width: 750rpx;
	height: 634rpx;
	background: url(../../static/images/user_bg.png) no-repeat;
	background-size: 750rpx 564rpx;
	padding-top: 24rpx;

	.user-info {
		display: flex;
		align-items: center;
		color: #fff;
		padding-left: 40rpx;

		.avatar {
			margin-right: 20rpx;
		}

		.info {
			.nickname {
				font-size: 30rpx;
				line-height: 1.4;
			}

			.tel {
				font-size: 24rpx;
			}
		}
	}

	.balance {
		padding-top: 20rpx;
		display: flex;
		width: 100%;

		.money {
			height: 100rpx;
			color: #fff;

			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
		}
	}
}

.share-cover {
	display: flex;
	justify-content: center;
	background: transparent;
}

.header-info {
	padding-top: 100rpx;
	width: 750rpx;
	height: 564rpx;

	background: url(../../static/images/user_bg.png) no-repeat;
	background-size: 750rpx 564rpx;

	.user-info {
		display: flex;
		align-items: center;
		color: #fff;
		padding-left: 40rpx;

		.avatar {
			margin-right: 20rpx;
		}

		.info {
			.nickname {
				font-size: 30rpx;
				line-height: 1.4;
			}

			.tel {
				font-size: 24rpx;
			}
		}
	}

	.balance {
		padding-top: 20rpx;
		display: flex;
		width: 100%;

		.money {
			height: 100rpx;
			color: #fff;

			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
		}
	}
}

.wrap-bg {
	padding-top: 20rpx;
	padding-bottom: 20rpx;
}

.coupon-container {
	background-color: #3b3f54;
	width: 90%;
	padding: 20rpx;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.title {
		font-size: 40rpx;
		color: #ffdfba;
	}

	.descp {
		font-size: 24rpx;
		color: #ffdfba;
	}

	.coupon-list {
		width: 100%;
		margin-top: 20rpx;
		display: flex;
		justify-content: space-around;

		.item {
			padding: 10rpx;
			font-size: 24rpx;
			color: #382c1e;
			width: 200rpx;
			height: 200rpx;
			background-color: #fff5e5;
			border: 2rpx solid #d4a673;
			border-radius: 6rpx;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.price {
				// width: 100rpx;
				padding-left: 10rpx;
				padding-right: 10rpx;
				height: 50rpx;
				line-height: 50rpx;
				text-align: center;
				border-radius: 25rpx;
				background-color: #636073;
				color: #fde6a4;
			}
		}
	}
}

.score {
	background-color: #fff;
	padding: 10rpx;
	border-radius: 10rpx;
	margin-bottom: 20rpx !important;

	.title {
		line-height: 3;
	}

	.private-icon,
	.user-icon {
		margin-right: 16rpx;
	}

	.list {
		display: flex;
		justify-content: space-between;

		.item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			text:first-child {
				line-height: 2;
			}

			.icon-title {
				margin-top: 32rpx;
			}
		}
	}
}

.login-out {
	width: 632rpx;
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	border-radius: 44rpx;
	background-color: #282828;
	color: #fff;
	margin-top: 48rpx;
}

.card {
	padding: 0 24rpx;
}

.sub {
	width: 632rpx;
	height: 72rpx;
	line-height: 72rpx;
	border-radius: 36rpx;
	background-color: #282828;
	color: #fff;
	font-size: 32rpx;
	margin-top: 40rpx;
	margin-bottom: 20rpx;
}
</style>
