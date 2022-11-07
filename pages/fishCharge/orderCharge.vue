// 接口完成，订单支付
<template>
	<view class="wrap">
		<view class="wrap-in">
			<view class="card">
				<view class="item">
					<image :src="incoming_data.pic_url[0].url" mode=""></image>

					<view class="info">
						<view class="title">{{ incoming_data.name }}</view>
						<view class="short-cut">{{ incoming_data.details }}</view>
						<view class="tags">
							<view v-if="hours != '' ? true : false" class="tag">今日钓鱼{{ hours }}个钟</view>
							<view v-else class="tag">今日钓鱼{{ incoming_data.fish_time }}个钟</view>
						</view>
					</view>
				</view>
			</view>

			<view class="card">
				<u-cell-group>
					<view class="buy-counter">
						<text style="  color: #606266;">数量</text>
						<u-number-box v-model="list.num"></u-number-box>
					</view>
					<u-cell-item v-if="bigness != '' ? true : false" title="订单总价" :value="`${bigness}元`" :arrow="false"></u-cell-item>
					<u-cell-item v-else title="订单总价" :value="`${incoming_data.price * list.num}元`" :arrow="false"></u-cell-item>
					<u-cell-item title="已选钓位" :value="`${list.fish_pond_seat_id}号`" :arrow="false"></u-cell-item>
					<!-- :url="'/pages/mine/coupon?id='+2" -->
					<u-cell-item
						v-show="jup != 5 ? true : false"
						@click="dive(list.fish_pond_id, jup)"
						title="优惠券"
						:value="`${quantity != 0 ? user_coupon.name : '无'}`"
					></u-cell-item>
				</u-cell-group>
			</view>
			<view class="leave_behind ">
				<view class="mh32 ">
					<text class="careful">备注留言</text>
					<form>
						<textarea cols="50" rows="4" maxlength="70" placeholder="选填，请留言你的备注" v-model="list.remark"></textarea>
						<br />
					</form>
				</view>
			</view>
			<u-cell-group>
				<u-cell-item title="微信支付" @click="payHandler" index="1" :arrow="false">
					<u-image width="28" height="28" :src="`/static/images/${list.pay_type == '1' ? '' : 'no-'}pay-icon.png`" slot="right-icon"></u-image>
				</u-cell-item>
				<u-cell-item title="现金支付" @click="payHandler" index="4" :arrow="false">
					<u-image width="28" height="28" :src="`/static/images/${list.pay_type == '4' ? '' : 'no-'}pay-icon.png`" slot="right-icon"></u-image>
				</u-cell-item>
				<u-cell-item title="余额支付" @click="payHandler" index="3" :arrow="false">
					<u-image width="28" height="28" :src="`/static/images/${list.pay_type == '3' ? '' : 'no-'}pay-icon.png`" slot="right-icon"></u-image>
				</u-cell-item>
			</u-cell-group>
			<view class="markup">备注：现金支付或其他支付由现场工作人员操作</view>
		</view>
		<button class="sub" @click="btnBClick">立即支付</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			incoming_data: [{ price: '' }, { fish_time: '' }], //鱼塘详情API
			bigness: '', // 续费价格
			hours: '', //续费时间
			selectedPay: '',
			user_coupon: '',
			quantity: '',
			preference: '', //用户优惠卷
			judge: 1,
			coupon_judgment: 0, //优惠卷判断
			min_price: '', //活动价格
			pool: '', //使用优惠卷的塘
			list: {
				fish_pond_id: '', //上一个页面传过来的池塘id
				fish_pond_seat_id: '',
				pay_type: '',
				order_type: 1,
				remark: '',
				coupon_id: '',
				order_id: '',
				is_renew: '1',
				num: 1
			},
			queue_id: '', //微信支付
			token: '', //微信支付
			zf_list: {}, //微信支付
			wxTow_id: '', //微信支付id第二步
			wxPayment: {},
			pay_type: '',
			fish_pond_seat_id: {},
			jup: -1,
			test: 2
		};
	},
	onLoad(res) {
		this.list.fish_pond_id = res.fish; //上一个页面传过来的池塘id
		this.list.fish_pond_seat_id = res.id; //上一个页面传过来的钓鱼位号
		this.list.order_id = res.order_id; //续费时才需要传
		this.bigness = res.bigness; //传过来的价格
		this.hours = res.hours; //传过来的时间
		this.list.is_renew = res.is_renew; //是否全场
		this.jup = res.jup;
		console.log(14584, res);
		this.reservoirDetails(res.fish);

		// this.user_preference();
	},
	created() {
		uni.$on('coupon', (res, quantity, index) => {
			this.user_coupon = JSON.parse(res.coupon_data);
			this.list.coupon_id = res.id;
			this.quantity = quantity;
			this.min_price = JSON.parse(res.coupon_data).min_price;
			this.pool = res.coupon_id;
			this.coupon_judgment = index;
		});
	},

	methods: {
		//进入优惠卷
		dive(id, jup) {
			uni.navigateTo({
				url: `/pages/mine/coupon?id=2&fishpondid=${id}&index=${1}`
			});
		},
		reservoirDetails(id) {
			let self = this;
			console.log(id);
			this.$u.api2
				.getReservoirDetails({ id: id })
				.then(res => {
					this.incoming_data = res.data.detail;
					this.fish_id = res.data.seat_list;

					// this.fish_id.forEach(res => {
					// 	if(res.status==1){
					// 		self.fish_pond_seat_id=res
					// 		console.log(1246,self.fish_pond_seat_id)
					// 	}

					// })
					console.log(66, res);
				})
				.catch(err => {
					console.log(err);
				});
		},
		//节流
		btnBClick() {
			// 此处用法为在js中调用，需要写this.$u.throttle()
			this.$u.throttle(this.check, 3000);
		},
		//下单API
		check() {
			let self = this;
			if(self.list.num==0){
				uni.showToast({
						title: '数量不能为0',
						duration: 2000,
						icon: 'none'
					});
					return false
			}
			// if(self.jup==self.test){
			// 	uni.showToast({
			// 		title: '不能用优惠卷进行续费',
			// 		duration: 2000,
			// 		icon: 'none'
			// 	});
			// 	return false
			// }
			// console.log(111);
			if (Number(this.coupon_judgment) == Number(this.judge)) {
				uni.showToast({
					title: '现金支付不可使用优惠卷',
					duration: 2000,
					icon: 'none'
				});
				return false;
			}
			// if (Number(this.min_price) > Number(this.incoming_data.price)) {
			// 	uni.showToast({
			// 		title: '优惠卷大于现金不可用',
			// 		duration: 2000,
			// 		icon: 'none'
			// 	});
			// 	return false;
			// }
			// if(this.incoming_data.id!=this.pool){
			// 	uni.showToast({
			// 		title: '优惠卷和塘不匹配',
			// 		duration: 2000,
			// 		icon: 'none'
			// 	});
			// 	return;
			// }
			//续费鱼塘座位id
			// this.$u.vuex('fishPosition', this.list.fish_pond_seat_id);
			
			
			this.$u.api2
				.getCheck({ form_data: JSON.stringify(this.list) })
				.then(res => {
					console.log(res.data && res.data.pay_type == 1);
					console.log(4562, res.data.pay_type);
					if (res.data && res.data.pay_type == 1) {
						console.log(Number(res.data.list));
						if (Number(res.data.list) == 0) {
							uni.showModal({
								title: '支付成功，请确定跳转到首页',
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										uni.switchTab({
											url: '../tabBar/home'
										});
										console.log('用户点击确定');
									}
								}
							});
							return false;
						}
						console.log(14481, res);
						self.queue_id = res.data.list.queue_id;
						self.token = res.data.list.token;
						self.zf_list = res.data.list;

						self.WxPaymentTwo();

						console.log(11);
					} else {
						console.log(64212, res);
						//支付成功跳转
						uni.showModal({
							title: '支付成功，请确定跳转到首页',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									uni.switchTab({
										url: '../tabBar/home'
									});
									console.log('用户点击确定');
								}
							}
						});
					}
				})
				.catch(err => {
					console.log(1451, err);
					uni.showModal({
						title: err.msg,
						showCancel: false
					});
				});
		},
		//微信支付第二部
		WxPaymentTwo() {
			let self = this;
			self.$u.api2
				.getWxPaymentTwo(self.zf_list)
				.then(res => {
					if(res.data.retry==1){
						uni.showToast({
						    title: '当前网络繁忙',
						    duration: 2000
						});
					}else{
						self.wxTow_id = res.data.id;
						console.log(2, self.wxTow_id);
						self.wxPaymentThree();
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		//微信支付第三步
		wxPaymentThree() {
			let self = this;
			console.log(4231,self.wxTow_id)
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
								uni.showModal({
									title: '支付成功',
									showCancel: false,
									success: function(res) {
										uni.switchTab({
											url: '../tabBar/home'
										});
										console.log('用户点击确定');
									}
								});
								console.log('success:' + JSON.stringify(res));
							},
							fail: function(err) {
								uni.showModal({
									title: '支付取消',
									showCancel: false,
									complete: function(res) {
										uni.navigateTo({
											url: '../mine/myOrder'
										});
										console.log('用户点击确定');
									}
								});
								console.log('fail:' + JSON.stringify(err));
							}
						});
					}
				})
				.catch(err => {
					console.log(1564, err);
				});
		},
		payHandler(index) {
			this.judge = index;

			console.log('payHandler', index, arguments);
			this.list.pay_type = Number(index);
		}
	}
};
</script>

<style lang="scss">
.buy-counter {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 32rpx;
	padding: 26rpx 32rpx;
	border-bottom: 1rpx solid #cccccc30;
}
textarea {
	height: 100rpx;
}
page {
	background-color: #f7f7f8;
}

.wrap {
	width: 100%;
	background-color: #f7f7f8;

	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;
	}
}

.card {
	border-radius: 12rpx;
	padding: 18rpx 20rpx;
	background-color: #fff;
	margin-bottom: 20rpx;

	.item {
		width: 100%;
		display: flex;
		background-color: #fff;
		margin-bottom: 40rpx;

		image {
			width: 240rpx;
			height: 240rpx;
		}

		.info {
			padding-left: 20rpx;

			.title {
				font-size: 44rpx;
				color: #1a1b1d;
				font-weight: 500;
				margin-bottom: 10rpx;
			}

			.short-cut {
				width: 400rpx;
				font-size: 28rpx;
				color: #1a1b1d;
				line-height: 44rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.tags {
				margin: 24rpx 0;

				.tag {
					width: 232rpx;
					height: 62rpx;
					line-height: 62rpx;
					border-radius: 4px;
					text-align: center;
					background: #5d7291;
					color: #fff;
				}
			}
		}
	}
}
.leave_behind {
	margin: 16rpx 0rpx;
	height: 180rpx;
	background: #fff;
	.careful {
		display: inline-block;
		font-size: 28rpx;
		color: #1a1b1d;
		margin-top: 32rpx;
		margin-bottom: 12rpx;
	}
}
.markup {
	font-size: 24rpx;
	color: #1a1b1d;
	margin-top: 30rpx;
	margin-bottom: 112rpx;
}

.sub {
	width: 632rpx;
	height: 72rpx;
	line-height: 72rpx;
	border-radius: 36rpx;
	background-color: #282828;
	color: #fff;
	font-size: 32rpx;
	margin-bottom: 20rpx;
}
</style>
