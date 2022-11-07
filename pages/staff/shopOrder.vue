<template>
	<view class="wrap" :style="{ height: t_height }">
		<u-toast ref="uToast" />
		<view class="wrap-in">
			<view class="user-info" @click="usero">
				<view class="left"><u-avatar :src="datalist.avatar" mode="circle" size="96"></u-avatar></view>
				<view class="right">
					<view class="top">
						<view class="title">{{ datalist.nickname }}</view>
						<view>></view>
					</view>
					<view class="short-cut">{{ datalist.mobile }}</view>
				</view>
			</view>
			<view class="fish-info">
				<view class="left"><u-image width="226" height="226" :src="datalist.pic_url[0].url">s</u-image></view>
				<view class="right">
					<view class="title">{{ datalist.name }}</view>
					<view class="short-cut">{{ datalist.details }}</view>

					<view class="time">今日钓鱼{{ datalist.fish_time }}个钟</view>
				</view>
			</view>
			<view class="card order">
				<text>订单总价</text>
				<view>
					<text class="bt">¥</text>
					<text class="number">{{ datalist.total_pay_price }}元</text>
				</view>
			</view>

			<view class="card">
				<text>已选钓位</text>
				<view>{{ datalist.fish_pond_seat_id }}号</view>
			</view>
			<view class="card message">
				<text>留言备注：{{ datalist.remark }}</text>
			</view>

			<view class="card pay-time">
				<text>支付时间：{{ datalist.pay_time }}</text>
			</view>
			<view v-show="datalist.pay_type == 4 ? true : false">
				<button class="pay-btn" v-if="datalist.status_content != '待付款'" @click="end_fish_order">结束订单</button>
				<view v-else>
					<button class="pay-btn" @click="btnBClick(1)">确认收款</button>
					<button class="end-btn" @click="btnBClick()">拒绝收款</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			t_height: '',
			datalist: '',
			status:0,//判断值
		};
	},
	onLoad(e) {
		this.getList(JSON.parse(e.data));
		this.screen_height();
	},
	methods: {
		//返回上一级
		back() {
			//@zxyuns 处理兼容，如果没有上一级界面则返回首页
			const pages = getCurrentPages();
			if (pages.length === 2) {
				uni.navigateBack({
					delta: 1
				});
			} else if (pages.length === 1) {
				uni.switchTab({
					url: '/pages/tabBar/home'
				});
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		//动态获取屏幕高度
		screen_height() {
			let self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.t_height = res.windowHeight * 2 + 'rpx';
					console.log(445, self.t_height);
				}
			});
		},
		//订单详情
		getList(data) {
			let self = this;
			self.$u.api.get_order_detail(data).then(res => {
				this.datalist = res.data;
				console.log(554, res);
			});
		},
		//取消订单
		end_submit() {
			console.log('')
			if(this.status==1){
				return false
			}
			console.log('取消订单')
			let self = this;
			self.$u.api2
				.getCancel({ order_type: 1, fish_pond_id: self.datalist.fish_pond_id, user_id: self.datalist.user_id })
				.then(res => {
					uni.showModal({
						title: res.msg,
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								self.back();
								console.log('用户点击确定');
							}
						}
					});
					console.log(114, res);
				})
				.catch(err => {
					uni.showToast({
						title: err.msg,
						duration: 2000
					});
					console.log(err);
				});
		},
		//结束订单
		end_fish_order() {
			let self = this;
			self.$u.api
				.end_fish_order({
					fish_pond_id: self.datalist.fish_pond_id,
					user_id: self.datalist.user_id
				})
				.then(res => {
					self.$refs.uToast.show({
						title: '结束成功',
						type: 'default',
						back: true
					});
				});
		},
		//防抖
		btnBClick(e) {
			if(e){
				this.status=1
				this.$u.debounce(this.order_submit, 500)
			}else{
				this.$u.debounce(this.end_submit, 500)
				
			}
			
		},
		//确认收款
		order_submit() {
			console.log(45122)
			if(this.status!=1){
				return false
			}
			console.log('取消订单')
			let self = this;
			self.$u.api
				.pay_order({
					is_staff:1,
					order_type: 1,
					fish_pond_id: self.datalist.fish_pond_id,
					user_id: self.datalist.user_id
				})
				.then(res => {
					self.$refs.uToast.show({
						title: '确认收款',
						callback: (self.showPay = false),
						back: true
					});
				})
				.catch(err => {
					self.$refs.uToast.show({
						title: err.msg,
						back: true
					});
				});
		},
		usero() {
			const data = {};
			data.fish_pond_seat_id = this.datalist.fish_pond_seat_id;
			data.order_no = this.datalist.order_no;
			data.fish_pond_id = this.datalist.fish_pond_id;
			data.user_id = this.datalist.user_id;
			uni.navigateTo({
				url: './matchOperate?data=' + JSON.stringify(data)
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f7f7f8;
}

.wrap {
	width: 100%;
	padding-top: 10rpx;
	background-color: #f7f7f8;

	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;

		.user-info {
			display: flex;
			background-color: #fff;
			margin-bottom: 16rpx;
			border-radius: 12rpx;

			padding: 34rpx 18rpx 26rpx;
			margin-top: 16rpx;

			.left {
				margin-right: 14rpx;
			}

			.right {
				flex: 1;

				.top {
					width: 100%;
					display: flex;
					justify-content: space-between;

					.title {
						font-size: 28rpx;
						color: #362c2c;
						font-weight: 500;
						line-height: 44rpx;
						margin-bottom: 10rpx;
					}
				}

				.short-cut {
					color: #362c2c;
					font-size: 24rpx;
					line-height: 36rpx;
					padding-bottom: 24rpx;
				}
			}
		}

		.fish-info {
			display: flex;
			background-color: #fff;
			margin-bottom: 16rpx;
			border-radius: 12rpx;

			padding: 34rpx 18rpx 26rpx;

			.left {
				margin-right: 30rpx;
			}

			.right {
				flex: 1;

				.top {
					width: 100%;
					display: flex;
					justify-content: space-between;
				}

				.title {
					font-size: 44rpx;
					color: #1a1b1d;
					font-weight: 500;
					line-height: 44rpx;
					margin-bottom: 10rpx;
				}

				.short-cut {
					color: #424242;
					font-size: 24rpx;
					line-height: 36rpx;
					padding-bottom: 24rpx;
				}

				.time {
					height: 62rpx;
					line-height: 62rpx;
					border-radius: 4rpx;
					font-size: 28rpx;
					background-color: #5d7291;
					color: #fff;
					text-align: center;
				}
			}
		}

		.card {
			background-color: #fff;
			border-radius: 12rpx;
			margin-bottom: 16rpx;
			padding-top: 14rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;

			font-size: 28rpx;
			color: #1a1b1d;
			min-height: 80rpx;
			display: flex;

			justify-content: space-between;

			&.order {
				.bt {
					color: #f38b10;
					font-size: 24rpx;
				}
				.number {
					font-size: 36rpx;
					color: #f38b10;
				}
			}

			&.message {
				color: #404040;
			}
			&.pay-time {
				color: #404040;
			}
		}
		.end-btn {
			margin-top: 40rpx;
			width: 632rpx;
			height: 88rpx;
			line-height: 88rpx;
			border-radius: 44rpx;
			background-color: #282828;
			color: #fff;
		}
		.pay-btn {
			margin-top: 80rpx;
			width: 632rpx;
			height: 88rpx;
			line-height: 88rpx;
			border-radius: 44rpx;
			background-color: #282828;
			color: #fff;
		}
	}
}
</style>
