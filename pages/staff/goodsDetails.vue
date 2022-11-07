<template>
	<!-- 员工端——商品详情 -->
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="wrap-in">
			<view style="height: 20rpx; background-color: #f7f7f8;"></view>
			<view style="background: #FFFFFF; padding: 20rpx;">
				<view class="mainRow">
					<u-image width="200" height="200" border-radius="8" :src="datalist.detail[0].goods_info.pic_url"></u-image>
					<view class="ml20">
						<view>{{ datalist.detail[0].goods_info.name }}</view>
						<view class="mt16" style="color: #F38B10; font-size: 36rpx;">
							<text class="text28">￥</text>
							{{ datalist.total_pay_price }}元
						</view>
					</view>
				</view>
				<view class="mainRow mainRight">
					<view class="mainColumn center" style="width: 120rpx; height: 48rpx; background: #4F4F4F; color: #FFFFFF;border-radius: 8rpx;">
						{{ isPay(datalist.status_text) }}
					</view>
				</view>
			</view>
			<view class="card mt21">
				<text>已选钓位</text>
				<view>{{ datalist.detail[0].fish_pond_seat_id }}号</view>
			</view>
			<view class="card order">
				<text>订单总价</text>
				<view>
					<text class="bt">¥</text>
					<text class="number">{{ datalist.total_pay_price }}元</text>
				</view>
			</view>
			<view class="cards message">
				<view class="fontwe">{{ datalist.detail[0].fish_pond_name }}</view>
				<view class="mt16">{{ datalist.detail[0].fish_pond_seat_id }}号钓位 {{ datalist.remark }}</view>
			</view>
			<view v-if="datalist.status_text == '待付款'">
				<button class="pay-btn" @click="btnBClick(1)">确认收款</button>
				<button class="pay-btz" @click="btnBClick">拒绝收款</button>
			</view>
			<button class="pay-btn" @click="order_complete" v-else-if="datalist.status_text == '待收货'">确认处理</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			datalist: '',
			status:0,//判断值
		};
	},
	onLoad(e) {
		this.getList(e.id);
	},
	methods: {
		isPay(text) {
			// is_sale
			switch (text) {
				case '待付款':
					return '未付款';
					break;
				case '待收货':
					return '已付款';
					break;
				case '已完成':
					return '已处理';
					break;
			}
		},
		iszhuangtai(text) {
			switch (text) {
				case '待付款':
					return '确认收款';
					break;
				case '待收货':
					return '确认处理';
					break;
				case '已完成':
					return '已处理';
					break;
			}
		},
		//订单详情
		getList(id) {
			let self = this;
			self.$u.api
				.detail({
					id
				})
				.then(res => {
					self.datalist = res.data;
				});
		},
		//确认处理
		order_complete() {
			let self = this;
			self.$u.api
				.goods_order_complete({
					id: self.datalist.id
				})
				.then(res => {
					self.$refs.uToast.show({
						title: res.msg,
						type: 'default',
						back: true
					});
				})
				.catch(err => {
					self.$refs.uToast.show({
						title: err.msg,
						type: 'default'
					});
				});
		},
		back() {
		    //@zxyuns 处理兼容，如果没有上一级界面则返回首页
		    const pages = getCurrentPages();
		    if (pages.length === 2) {
		     uni.navigateBack({
		      delta: 1
		     });
		    } else if (pages.length === 1) {
		     uni.switchTab({
		      url: '/pages/tabBar/home',
		     })
		    } else {
		     uni.navigateBack({
		      delta: 1
		     });
		    }
		   },
		   //防抖
		   btnBClick(e) {
		   	if(e){
				
		   		this.status=1
		   		this.$u.debounce(this.payOrder, 500)
		   	}else{
		   		this.$u.debounce(this.order_submit, 500)
		   		
		   	}
		   	
		   },
		//取消收款
		order_submit() {
			console.log(45122)
			if(this.status==1){
				return false
			}
			console.log('取消收款')
			let self = this;
				self.$u.api2
					.getCancel({
						order_type: 2,
						id: self.datalist.id,
						user_id: self.datalist.user_id,
						is_staff:1
					})
					.then(res => {
						self.back()
						console.log(res);
					})
					.catch(err => {
						console.log(err);
					});
			
		},
		//确认收款
		payOrder(){
			console.log(452)
			if(this.status!=1){
				return false
			}
			console.log('确认收款')
			let self = this;
			self.$u.api
				.pay_order({
					order_type: 2,
					id: self.datalist.id,
					user_id: self.datalist.user_id
				})
				.then(res => {
					self.$refs.uToast.show({
						title: res.msg,
						type: 'default',
						callback: (self.showPay = false),
						back: true
					});
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
		.pay-btz {
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

.cards {
	background-color: #fff;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
	padding-top: 14rpx;
	padding-left: 20rpx;
	padding-right: 20rpx;
	font-size: 28rpx;
	color: #1a1b1d;
	min-height: 80rpx;
	padding-top: 16rpx;
	padding-bottom: 16rpx;
}
</style>
