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
				<u-cell-item title="数量" :arrow="false">
					<view>{{ dlist.num }}</view>
				</u-cell-item>
			</u-cell-group>

			<u-cell-group>
				<u-cell-item title="订单总价" :arrow="false">
					<view style="color: #F38B10; font-size: 32rpx;">￥{{ dlist.price }}</view>
				</u-cell-item>
			</u-cell-group>

			<u-cell-group>
				<view class="frame">
					<view>{{ dlist.fish_pond_name }}</view>
				</view>
			</u-cell-group>

			<u-cell-group>
				<view class="frame">
					<view>{{ dlist.fish_pond_seat_id }}号钓位</view>
				</view>
			</u-cell-group>
			<view class=" Frame">
				<view class="mh32 leave">留言备注</view>
				<view class="remark">{{ dlist.remark }}</view>
			</view>
			<u-cell-group>
				<u-cell-item title="微信支付" v-if="dlist.pay_type == 1 ? true : false" @click="payHandler" index="1" :arrow="false"></u-cell-item>
				<u-cell-item title="线下支付" v-else-if="dlist.pay_type == 4 ? true : false" @click="payHandler" index="4" :arrow="false"></u-cell-item>
				<u-cell-item title="余额支付" v-else @click="payHandler" index="3" :arrow="false"></u-cell-item>
			</u-cell-group>
			<view v-show="dlist.pay_type == 1 ? true : false" class="footsie"><view class="sub" @click="order_submit">付款</view></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			remark: '',
			type: 'textarea',
			height: 100,
			autoHeight: true,
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
			orderType: '', //订单类型
			indentid: ''
		};
	},
	onLoad(e) {
		this.dlist = JSON.parse(e.list);
		this.orderType = this.dlist.order_type;
		this.indentid = this.dlist.indent_id;
		console.log(this.dlist);
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
			console.log(this.orderType, this.indentid);
			let self = this;
		this.$u.api2
			.getWxPaymentGive({ id: this.indentid })
			.then(res => {
				self.wxTow_id = res.data.id;
				self.wxPaymentThree();
				console.log(res);
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
.remark {
	margin-left: 30rpx;
	font-size: 28rpx;
}
.frame {
	height: 88rpx;
	line-height: 88rpx;
	margin-left: 32rpx;
	color: #606266;
}
.footsie {
	height: 98rpx;
	background-color: #ffffff;
	align-items: center;
	justify-content: flex-end;
	display: flex;
	.sub {
		width: 120rpx;
		margin-left: 26rpx;
		height: 48rpx;
		line-height: 48rpx;
		border-radius: 24rpx;
		border: 1px solid #5d7291;
		color: #5d7291;
		text-align: center;
	}
}
.leave {
	padding-top: 32rpx;

	margin-bottom: 12rpx;
	color: #606266;
}
.Frame {
	margin-top: 32rpx;
	margin-bottom: 32rpx;
	background-color: #ffffff;
	height: 180rpx;
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
}
</style>
