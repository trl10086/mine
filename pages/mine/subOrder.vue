<template>
	<view class="wrap">
		<!-- 1. 暂无优惠券 -->
		<view class="no_coupon" v-if="hasCoupon">
			<u-empty class="empty" icon-size="268" color="#1A1B1D" font-size="28" text="暂无优惠券可使用哦~" src="/static/images/no_coupon_default.png"></u-empty>
		</view>

		<!-- 2. 优惠券列表 -->
		<view class="coupon_list_container" v-else>
			<!-- 2.1 切换栏 -->
			<view class="u-tabs-box">
				<u-tabs-swiper
					activeColor="#5d7291"
					:bar-width="138"
					inactive-color="#1a1b1d"
					ref="tabs"
					:list="list"
					:current="current"
					@change="change"
					:is-scroll="false"
					swiperWidth="750"
				></u-tabs-swiper>
			</view>
			<!-- 2.2 优惠券内容 -->
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="n in 2" :key="n">
					<scroll-view scroll-y style="height: 100%;width:100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<view class="card" v-for="(item, index) in order" :key="item.id">
								<view>
									<view class="order-item">
										<view class="body">
											<view class="left"><u-image width="240" height="240" :src="item.pic_url[0].url"></u-image></view>
											<view class="right">
												<view class="title">{{ item.name }}</view>
												<view class="short-cut">{{ item.details }}</view>

												<view class="price">
													价格：
													<text class="number">{{ item.activity_price }}</text>
													元/场
												</view>
												<!-- <view  class="shake-wrap"><view @click="start_up(item.pay_status_content,index) " class="shake-number shaking">{{item.pay_status_content}}</view></view> -->
												<view class="shake-wrap">
									
													<view  @click="start_up(index,item.fish_pond_seat)" :class="[ item.fish_pond_seat != '' ? 'shake-number shaking' : 'shake-number']">
														{{ item.pay_status_content }}
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<u-popup mode="center" v-model="show" border-radius="8">
									<view class="frame mh32">
										<view class="theme">{{ item.fish_pond_seat }}号</view>
										<view class="word">您的比赛预约钓位号出来了，请你准时参加哦！</view>
									</view>
								</u-popup>
							</view>
							<u-loadmore :status="loadStatus[0]" bgColor="#f7f7f8"></u-loadmore>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			rSelect: [],
			order: {},
			status: 1,
			judge: false,
			page: 1,
			dyeing:'',
			show: false,
			hasdata: false,
			dataList: [],
			list: [
				{
					name: '进行中'
				},
				{
					name: '已过期'
				}
			],
			current: 0,
			swiperCurrent: 0,
			tabsHeight: 0,
			dx: 0,
			loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore']
		};
	},
	// onLoad() {
	// this.getOrderList(0);
	// this.getOrderList(1);
	// this.getOrderList(3);
	// },
	onLoad() {
		this.dataList = [];
		this.page = 1;
		this.hasdata = false;
		this.reservationOrder(this.status);
		// this.getList(1);
	},
	// 下拉刷新
	onPullDownRefresh() {
		console.log('下拉')
		this.dataList = [];
		this.page = 1;
		this.hasdata = false;
		this.reservationOrder(this.current + 1);
	},
	// 上拉加载
	onReachBottom() {
		console.log('上拉')
		if (!this.hasdata) {
			return;
		}
		this.page++;
		this.reservationOrder(this.current + 1);
	},
	computed: {
		hasCoupon() {
			return false;
		}
	},
	methods: {
		//点击拨号
		start_up(e,seat) {
			console.log(66,seat)
			if(seat==''){
				uni.showToast({
					title: '等待工作人员摇号',
					duration: 2000,
					icon: 'none'
				});
				return
			}
			if(this.dyeing==1){
				return
			}
			if (this.rSelect.indexOf(e) == -1) {
				this.rSelect.push(e);
			}
			this.show = true;
		},
		
		//预约列表
		reservationOrder(status) {
			let self = this;
			self.$u.api2
				.getReservationOrder({ status, page: this.page })
				.then(res => {
					if (self.page == 1) {
						self.order = [];
						self.order = res.data.list;
						
					} else {
						self.order = self.order.concat(res.data.list); //实际返回数据的字段
					}
					self.hasdata = self.page < res.data.pagination.page_count;
					uni.stopPullDownRefresh();
					console.log(111, res.data.list);
				})
				.catch(err => {
					console.log(err);
				});
		},
		//可滑动视图，上拉加载
		reachBottom() {
			console.log('上拉')
				if (!this.hasdata) {
					return;
				}
				this.page++;
				this.reservationOrder(this.current + 1);
			},
		// 页面数据
		// getOrderList(idx) {
		// 	for (let i = 0; i < 5; i++) {
		// 		let index = this.$u.random(0, this.dataList.length - 1);
		// 		let data = JSON.parse(JSON.stringify(this.dataList[index]));
		// 		data.id = this.$u.guid();
		// 		this.orderList[idx].push(data);
		// 	}
		// 	this.loadStatus.splice(this.current, 1, "loadmore")
		// },
		// 总价
		// totalPrice(item) {
		// 	let price = 0;
		// 	item.map(val => {
		// 		price += parseFloat(val.price);
		// 	});
		// 	return price.toFixed(2);
		// },
		// // 总件数
		// totalNum(item) {
		// 	let num = 0;
		// 	item.map(val => {
		// 		num += val.number;
		// 	});
		// 	return num;
		// },

		//预约列表
		// getList(id) {
		// 	let self = this;
		// 	self.$u.api
		// 		.sign_up({
		// 			status: id,
		// 			page: self.page
		// 		})
		// 		.then(res => {
		// 			if (self.page == 1) {
		// 				self.dataList = [];
		// 				self.dataList = res.data.list;
		// 			} else {
		// 				self.dataList = self.dataList.concat(res.data.list);
		// 			}
		// 			self.hasdata = self.page < res.data.pagination.page_count;
		// 			uni.stopPullDownRefresh();
		// 		});
		// },

		// tab栏切换
		change(index) {
			this.swiperCurrent = index;
			// this.status = index + 1;
			// if (index == 1) {
			// 	this.dyeing=index
			// 	return
			// }
			// this.dyeing=index
			// this.reservationOrder(this.current + 1);
			// this.getOrderList(index);
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
			this.reservationOrder(this.current + 1);
		}
	}
};
</script>

<style lang="scss">
.frame {
	width: 560rpx;
	height: 364rpx;
	overflow-x: hidden;
	overflow-y: scroll;
	.theme {
		text-align: center;
		margin-top: 106rpx;
		margin-bottom: 60rpx;
		color: #5d7291;
		font-size: 48rpx;
		font-weight: bold;
	}
	.word {
		font-size: 28rpx;
		text-align: center;
		width: 448rpx;
		margin: 0 auto;
	}
}
page {
	background-color: #f7f7f8;
}

.wrap {
	width: 100%;
	background-color: #f7f7f8;
}
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
						padding: 24rpx 18rpx;
						background-color: #fff;
						margin-bottom: 20rpx;
						border-radius: 12rpx;

						.body {
							display: flex;

							.left {
								margin-right: 26rpx;
							}

							.right {
								.title {
									font-size: 32rpx;
									color: #1a1b1d;
									font-weight: 500;
									line-height: 44rpx;
								}
								.short-cut {
									color: #424242;
									font-size: 24rpx;
									line-height: 36rpx;
									padding-bottom: 24rpx;
								}
								.price {
									font-size: 28rpx;
									.number {
										font-size: 36rpx;
										color: #f38b10;
									}
								}
								.shake-wrap {
									padding-top: 20rpx;

									display: flex;
									justify-content: flex-end;
									.shake-number {
										height: 56rpx;
										line-height: 56rpx;
										border-radius: 28rpx;
										padding: 0 60rpx;
										background-color: #f1f1f1;
										color: #1a1b1d;
										&.shaking {
											background-color: #5d7291;
											color: #fff;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

.swiper-item {
	height: 100%;
}
</style>
