<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<!-- 2. 优惠券列表 -->
		<view class="coupon_list_container">
			<!-- 2.1 切换栏 -->
			<view class="u-tabs-box">
				<u-tabs-swiper
					activeColor="#5d7291"
					:bar-width="138"
					inactive-color="#1a1b1d"
					ref="tabs"
					:list="lists"
					:current="current"
					@change="change"
					:is-scroll="false"
					swiperWidth="750"
				></u-tabs-swiper>
			</view>
			<!-- 2.2 优惠券内容 -->
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="n in 3" :key="n" >
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
						<!-- 1. 暂无优惠券 -->
						<view class="no_coupon" v-if="dataList.length == 0">
							<u-empty class="empty" icon-size="268" color="#1A1B1D" font-size="28" text="暂无订单哦~" mode="order"></u-empty>
						</view>

						<view class="page-box">
							<view class="card">
								<navigator class="item" v-for="(item, index) in dataList" :key="item.id" @click="departure(item)">
									<view class="order-item">
										<view class="header">
											<view class="date">日期：{{ item.pay_time == '0000-00-00 00:00:00' ? item.created_at : item.pay_time }}</view>
											<view class="pay-status no-pay">{{ item.status_text }}</view>
										</view>
										<view class="body">
											<view class="left"><u-image width="200" height="200" :src="item.detail[0].goods_info.pic_url"></u-image></view>
											<view class="right">
												<view class="info">
													<view class="title">{{ item.detail[0].goods_info.name }}</view>
													<view class="fish-info">
														<view class="location">{{ item.detail[0].fish_pond_name }} ：{{ item.detail[0].fish_pond_seat_id }}号</view>
													</view>
													<view class="price">
														价格：
														<text class="bt">¥</text>
														<text class="number">{{ item.detail[0].unit_price }}</text>
														元
													</view>
													<view>数量：{{ item.detail[0].goods_info.num }}</view>
													<view class="footer">
														<view class="total">
															<view class="price-title">
																<text class="hj">合计：</text>
																<text class="bt">¥</text>
																<text class="number">{{ item.detail[0].total_price }}</text>
																元
															</view>
														</view>
													</view>
												</view>
											</view>
										</view>

										<view class="footsie">
											<view class="markup">留言备注：{{ item.remark }}</view>
											<view class="stay" v-if="item.is_pay==0?true:false">
												<view v-show="item.pay_type == 1 ? true : false" class="pays" @click="departure(item)">付款</view>
												<view class="pays" @click.stop="onpay(item)">取消</view>
												
											</view>
											<view class="stay" v-else>
												
												<view class="pays" >{{item.status_text}}</view>
											</view>
										</view>
									</view>
								</navigator>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 支付，暂时不能用 -->
		<!-- <u-popup v-model="showPay" mode="bottom">
			<view class="card">
				<view class="mt32 fontwe">
					{{discount_data.detail[0].goods_info.name}}
					<text class="text32 ml16" style="color: #F38B10;">￥{{discount_data.total_pay_price}}</text>
				</view>
				<view class="mt32">请选择支付方式</view>
				<u-cell-group>
					<u-cell-item title="微信支付" @click="payHandler" index="1" :arrow="false">
						<u-image width="28" height="28"
							:src="`/static/images/${selectedPay == '1' ? '' : 'no-'}pay-icon.png`"
							slot="right-icon">
						</u-image>
					</u-cell-item>
					<u-cell-item title="余额支付" @click="payHandler" index="3" :arrow="false">
						<u-image width="28" height="28"
							:src="`/static/images/${selectedPay == '3' ? '' : 'no-'}pay-icon.png`"
							slot="right-icon">
						</u-image>
					</u-cell-item>
				</u-cell-group>
				<button class="sub" @click="order_submit">立即支付</button>
			</view>
		</u-popup> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			page: 1,
			hasdata: false,
			dataList: [],
			lists: [
				{
					name: '待付款'
				},
				{
					name: '已付款'
				},
				{
					name: '已完成'
				}
			],
			current: 0,
			swiperCurrent: 0,
			tabsHeight: 0,
			dx: 0,
			loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
			showPay: false,
			selectedPay: 1,
			discount_data: ''
		};
	},
	onShow() {
		this.getList(1);
	},
	onLoad() {
		this.dataList = [];
		this.page = 1;
		this.hasdata = false;
	},
	methods: {
		//点击跳转
		departure(res) {
			const list = {};
			list.img = res.detail[0].goods_info.pic_url;
			list.name = res.detail[0].goods_info.name;
			list.guiGe = res.detail[0].goods_info.attr_list[0].attr_name;
			list.price = res.detail[0].unit_price;
			list.fish_pond_name = res.detail[0].fish_pond_name;
			list.fish_pond_id = res.detail[0].fish_pond_id;
			list.fish_pond_seat_id = res.detail[0].fish_pond_seat_id;
			list.id = res.detail[0].goods_id;
			list.attr_id = res.detail[0].goods_info.goods_attr.id;
			list.num = res.detail[0].goods_info.num;
			list.order_type = 2;
			list.pay_type = res.pay_type;
			list.remark = res.remark;
			list.send_time=res.send_time
			list.indent_id = res.id;
			console.log(652, list);
			if(this.swiperCurrent==2){
				uni.navigateTo({
					url:'./shopAccomplish?list='+ JSON.stringify(list)
				})
			}
			if(this.swiperCurrent==0){
				uni.navigateTo({
					// url: '../shop/order?list='+JSON.stringify(list)
					url: './order-payment?list=' + JSON.stringify(list)
				});
			}
			
		},
		// tab栏切换
		change(index) {
			this.swiperCurrent = index;
			console.log(this.swiperCurrent)
			// this.getList(index+1)
		},
		transition({ detail: { dx } }) {
			this.$refs.tabs.setDx(dx);
		},
		animationfinish({ detail: { current } }) {
			this.$refs.tabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
			this.dataList = [];
			this.page = 1;
			this.hasdata = false;
			this.getList(current + 1);
		},
		//订单
		getList(id) {
			let self = this;
			self.$u.api
				.orderList({
					page: self.page,
					status: id
				})
				.then(res => {
					if (self.page == 1) {
						self.dataList = [];
						self.dataList = res.data.list;
						console.log(11, self.dataList);
					} else {
						self.dataList = self.dataList.concat(res.data.list);
					}
					self.hasdata = self.page < res.data.pagination.page_count;
					uni.stopPullDownRefresh();
				});
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.dataList = [];
			this.page = 1;
			this.hasdata = false;
			this.getList(this.current + 1);
		},
		//可滑动视图，上拉加载
		onreachBottom() {
			if (!this.hasdata) {
				return;
			}
			this.page++;
			this.getList(this.current + 1);
		},

		//支付方式
		// payHandler(index) {
		// 	this.selectedPay = index;
		// },
		//取消
		onpay(item) {
			console.log(111,item,item.id)
			this.$u.api2
				.getCancel({order_type:2,id:item.id})
				.then(res => {
					this.$refs.uToast.show({
						title: '取消成功',
						
					});
					this.getList(this.page)
					console.log(res);
				})
				.catch(err => {
					this.$refs.uToast.show({
						title: err.msg,
						
					});
					this.getList(this.page)
					console.log(11,err);
				});
		}
		// order_submit() {
		// 	if (this.sLogin()) {
		// 		return;
		// 	}
		// 	let self = this
		// 	self.$u.api.pay_order({
		// 		order_type: 2,
		// 		id: self.discount_data.id
		// 	}).then(res => {
		// 		self.$refs.uToast.show({
		// 			title: '购买成功',
		// 			type: 'default',
		// 			callback: self.showPay = false
		// 		})
		// 		this.getList(this.current+1)
		// 	})
		// },
	}
};
</script>

<style lang="scss">
page {
	background-color: #f7f7f8;
}

.wrap {
	width: 100%;
	background-color: #f7f7f8;
}
</style>

<style lang="scss" scoped>
.wrap {
	width: 100%;
	background-color: #f7f7f8;

	.no_coupon {
		.empty {
			padding-top: 56rpx;
		}
	}

	.swiper-box {
		margin-top: 26rpx;
		height: calc(100vh - var(--window-top) - 150rpx);
		padding: 0 24rpx;

		.swiper-item {
			background-color: #f7f7f8;

			.page-box {
				.card {
					.order-item {
						padding: 24rpx;
						background-color: #fff;
						margin-bottom: 16rpx;
						border-radius: 12rpx;

						.header {
							display: flex;
							justify-content: space-between;
							color: #1a1b1d;
							font-size: 24rpx;
							margin-bottom: 34rpx;

							.date {
							}

							.pay-status {
								color: #f38b10;
							}
						}

						.body {
							display: flex;

							.left {
								margin-right: 50rpx;
							}

							.right {
								color: #1a1b1d;
								line-height: 44rpx;
								font-size: 24rpx;

								.info {
									.title {
										font-size: 32rpx;
									}

									.tags {
										font-size: 24rpx;
									}
								}

								.fish-info {
									display: flex;
									align-items: center;

									.time {
										height: 48rpx;
										line-height: 48rpx;
										background-color: #5d7291;
										padding: 0 8rpx;
										color: #fff;
										border-radius: 4rpx;
										margin-right: 16rpx;
									}

									.location {
										font-size: 24rpx;
									}
								}

								.price {
									font-size: 28rpx;

									.bt {
										color: #f38b10;
										font-size: 24rpx;
									}

									.number {
										font-size: 32rpx;
										color: #f38b10;
									}
								}
							}
						}

						.footer {
							.total {
								display: flex;
								align-items: center;

								.price-title {
									.hj {
										color: #1a1b1d;
										font-size: 28rpx;
									}

									.bt {
										font-size: 24rpx;
										color: #f38b10;
									}

									.number {
										font-size: 32rpx;
										color: #f38b10;
									}
								}
							}
						}

						.markup {
							margin-top: 18rpx;
							font-size: 24rpx;
							color: #1a1b1d;
						}
					}
				}
			}
		}
	}
}
.footsie {
	height: 98rpx;
	background-color: #ffffff;
	align-items: center;
	justify-content: space-between;
	display: flex;
	.stay {
		display: flex;
		align-content: center;
		justify-content: space-around;
		margin-top: 18rpx;
		.pays {
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
}

.swiper-item {
	height: 100%;
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
