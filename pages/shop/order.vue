<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<u-card :show-head="false">
			<view slot="body" class="header">
				<u-image width="232" height="232" border-radius="8" :src="dlist.img"></u-image>
				<view class="info">
					<view class="title">{{ dlist.name }}（{{ dlist.guiGe }}）</view>
					<view class="price">
						<text class="bt">¥</text>
						<text class="number">{{ dlist.price }}元</text>
					</view>
				</view>
			</view>
		</u-card>

		<view class="card">
			<u-cell-group>
				<u-cell-item title="数量" :arrow="false"><u-number-box slot="right-icon" v-model="dlist.num" :min="1"></u-number-box></u-cell-item>
			</u-cell-group>

			<u-cell-group>
				<u-cell-item title="订单总价" :arrow="false">
					<view style="color: #F38B10; font-size: 32rpx;">￥{{ parseFloat(dlist.price * dlist.num).toFixed(2) }}</view>
				</u-cell-item>
			</u-cell-group>

			<u-cell-group>
				<u-cell-item :title="titleA" @click="showA = true"></u-cell-item>
				<u-picker mode="selector" v-model="showA" :default-selector="[0]" @confirm="confirmA" :range="yvTang" range-key="name"></u-picker>
			</u-cell-group>

			<u-cell-group>
				<u-cell-item :title="titleB" @click="showClick"></u-cell-item>
				<u-picker mode="selector" v-model="showB" :default-selector="[0]" @confirm="confirmB" :range="diaoWei" range-key="seat_id"></u-picker>
			</u-cell-group>

			<u-cell-group>
				<u-cell-item title="微信支付" @click="payHandler" index="1" :arrow="false">
					<u-image width="28" height="28" :src="`/static/images/${selectedPay == '1' ? '' : 'no-'}pay-icon.png`" slot="right-icon"></u-image>
				</u-cell-item>
				<u-cell-item title="线下支付" @click="payHandler" index="4" :arrow="false">
					<u-image width="28" height="28" :src="`/static/images/${selectedPay == '4' ? '' : 'no-'}pay-icon.png`" slot="right-icon"></u-image>
				</u-cell-item>
				<u-cell-item title="余额支付" @click="payHandler" index="3" :arrow="false">
					<u-image width="28" height="28" :src="`/static/images/${selectedPay == '3' ? '' : 'no-'}pay-icon.png`" slot="right-icon"></u-image>
				</u-cell-item>
				<u-cell-item title="备注" :hover-class="false" title-width="100" :arrow="false">
					<u-input v-model="remark" :type="type" :border="border" :height="height" :auto-height="autoHeight" />
				</u-cell-item>
			</u-cell-group>
			<view class="markup">备注:现金支付或其他支付由现场工作人员操作</view>

			<button class="sub" @click="order_submit">立即支付</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			wxPayment: {},
			remark: '',
			type: 'textarea',
			border: true,
			height: 100,
			autoHeight: true,
			custom: {
				'font-size': '28rpx'
			},
			titleA: '选择鱼塘位置',
			titleB: '选择钓位几号',
			checked: false,
			selectedPay: '',
			// 收到的值
			dlist: '',
			//鱼塘列表
			showA: false,
			yvTang: '',
			ytId: '',
			//钓位列表
			showB: false,
			diaoWei: '',
			dwID: '',
			queue_id: '', //微信支付
			token: '', //微信支付
			zf_list: {}, //微信支付
			wxTow_id: '' //微信支付id第二步
		};
	},
	onLoad(e) {
		this.dlist = JSON.parse(e.list);
		this.getPondList();
	},
	methods: {
		payHandler(index) {
			console.log('payHandler', index, arguments);
			this.selectedPay = index;
		},
		//鱼塘列表
		getPondList() {
			let self = this;
			self.$u.api2
				.getPondList({
					page: 1,
					limit: 9999
				})
				.then(res => {
					self.yvTang = res.data.list;
				});
		},
		showClick() {
			if (!this.ytId) {
				this.$refs.uToast.show({
					title: '请先选择鱼塘',
					type: 'default',
					url: '/pages/user/index'
				});
			} else {
				this.showB = true;
			}
		},
		//钓位列表
		confirmA(index) {
			this.ytId = this.yvTang[index].id;
			this.titleA = this.yvTang[index].name;
			let self = this;
			self.$u.api
				.fishSeat({
					id: self.ytId
				})
				.then(res => {
					self.diaoWei = res.data;
				});
		},
		confirmB(index) {
			this.dwID = this.diaoWei[index].seat_id;
			this.titleB = this.diaoWei[index].seat_id + '号钓位';
		},
		order_submit() {
			let self = this;
			if (self.ytId === '' || self.dwID === '') {
				this.$refs.uToast.show({
					title: '请填写完整的信息',
					type: 'default',
					url: '/pages/user/index'
				});
				return;
			} else if (!self.selectedPay) {
				this.$refs.uToast.show({
					title: '请选择支付方式',
					type: 'default',
					url: '/pages/user/index'
				});
				return;
			}
			const data = {
				fish_pond_id: self.ytId,
				fish_pond_seat_id: self.dwID,
				goods_id: self.dlist.id,
				goods_attr_id: self.dlist.attr_id,
				num: self.dlist.num,
				pay_type: self.selectedPay,
				remark: self.remark
			};
			self.$u.api
				.order_submit({
					form_data: JSON.stringify(data)
				})
				.then(res => {
					console.log(5423, res.data.list);
					if (res.data&&res.data.pay_type == 1) {
						
						self.queue_id = res.data.list.queue_id;
						self.token = res.data.list.token;
						self.zf_list = res.data.list;
						self.WxPaymentTwo();
					} else {
						self.$refs.uToast.show({
							title: '支付成功',
							back: true
						});
					}
				})
				.catch(err => {
					console.log(
						console.log(111),
						self.$refs.uToast.show({
							title: err.msg,
							type: 'default'
						})
					);
				});
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
									back: true
								});
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
	}
};
</script>

<style lang="scss">
page {
	background-color: #f7f7f8;
}

.wrap {
	.header {
		display: flex;

		.info {
			margin-left: 54rpx;
			color: #1a1b1d;
			font-size: 32rpx;
			line-height: 44rpx;
		}

		.price {
			color: #f38b10;
			margin-top: 40rpx;

			.bt {
				font-size: 24rpx;
			}

			.number {
				font-size: 32rpx;
			}
		}
	}

	.card {
		padding: 0 24rpx;
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
}
</style>
