<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<u-card :show-head="false">
			<view slot="body" class="header">
				<u-image width="232" height="232" border-radius="8" :src="dlist.img"></u-image>
				<view class="info">
					<view class="title">{{ dlist.name }}</view>
					<view class="price">
						<text class="bt">¥</text>
						<text class="number">{{ dlist.price }}元</text>
					</view>
				</view>
			</view>
		</u-card>

		<view class="card">
			<view class="heading">
				<view class=" textwbold caption mh32">订单信息</view>
				<view class="total">
					<view class="total_indent mh32">订单总价</view>
					<view style="color: #F38B10; font-size: 32rpx;">￥{{ dlist.price }}</view>
				</view>
			</view>

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
			<u-cell-group>
				<u-cell-item title="付款时间" :arrow="false">
					<view>{{ dlist.send_time }}</view>
				</u-cell-item>
			</u-cell-group>
			<u-cell-group>
				<u-cell-item title="支付方式" :arrow="false">
					<view class="payment">
						<u-cell-item title="微信支付" v-if="dlist.pay_type == 1 ? true : false" @click="payHandler" index="1" :arrow="false"></u-cell-item>
						<u-cell-item title="线下支付" v-else-if="dlist.pay_type == 4 ? true : false" @click="payHandler" index="4" :arrow="false"></u-cell-item>
						<u-cell-item title="余额支付" v-else @click="payHandler" index="3" :arrow="false"></u-cell-item>
					</view>
				</u-cell-item>
			</u-cell-group>
			<view class=" Frame">
				<view class="mh32 leave">留言备注</view>
				<view class="remark">{{ dlist.remark }}</view>
			</view>
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
			if (!self.selectedPay) {
				this.$refs.uToast.show({
					title: '请选择支付方式',
					type: 'default',
					url: '/pages/user/index'
				});
				return;
			}
			// const data = {
			// 	fish_pond_id: self.dlist.fish_pond_id,
			// 	fish_pond_seat_id: self.dlist.fish_pond_seat_id,
			// 	goods_id: self.dlist.id,
			// 	goods_attr_id: self.dlist.attr_id,
			// 	num: self.dlist.num,
			// 	pay_type: self.selectedPay,
			// 	remark: self.remark
			// };
			self.$u.api2
				.getMerchandiseBuy({
					order_type: self.orderType,
					id: self.indentid
				})
				.then(res => {
					self.$refs.uToast.show({
						title: '支付成功',
						type: 'default',
						back: true
					});
					console.log(res);
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f7f7f8;
}
.heading {
	color: #0d0d0d;
	background-color: #ffffff;
	.caption {
		padding-top: 28rpx;
		font-size: 36rpx;
	}
	.total {
		display: flex;
		justify-content: space-between;
		margin-top: 62rpx;
		padding-bottom: 32rpx;
		margin-right: 32rpx;
		.total_indent {
		}
	}
}
.payment {
	display: flex;
	justify-content: flex-end;
}
.remark {
	margin-left: 30rpx;
	font-size: 28rpx;
	color: #1A1B1D;
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
