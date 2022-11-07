<template>
	<!-- 员工端——商品列表 -->
	<view class="wrap">
		<!-- 订单列表 -->
		<view class="coupon_list_container">
			<!--切换栏 -->
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
			<!--订单内容 -->
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="n in 3" :key="n">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
						<!-- 暂无订单 -->
						<view class="no_coupon" v-if="dataList.length == 0">
							<u-empty class="empty" icon-size="268" color="#1A1B1D" font-size="28" text="暂无订单哦~" mode="order"></u-empty>
						</view>
						<view class="page-box">
							<view class="card">
								<navigator :url="'./goodsDetails?id=' + item.id" class="item" v-for="(item, index) in dataList" :key="item.id">
									<view class="order-item">
										<view class="body">
											<view class="left"><u-image width="200" height="200" border-radius="8" :src="item.detail[0].goods_info.pic_url"></u-image></view>
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
													<!-- <view>数量：{{item.detail[0].goods_info.num}}</view> -->
												</view>
											</view>
										</view>

										<view class="mainRow sb mainAlignCenter mt16">
											<view>留言备注：{{ item.remark }}</view>
											<view v-show="swiperCurrent == 2 && item.payee != '' ? true : false">
												<view
													style="max-width: 300rpx;min-width: 92rpx; height: 48rpx; background: #4F4F4F; color: #FFFFFF;border-radius: 8rpx;overflow: hidden;line-height: 52rpx;text-align: center;    padding-left: 10rpx;
    padding-right: 10rpx;"
												>
													{{ item.payee }}
												</view>
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
	</view>
</template>

<script>
export default {
	data() {
		return {
			page: 1,
			hasdata: false,
			dataList: [],
			list: [
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
			dx: 0
		};
	},
	onShow() {
		this.dataList = [];
		this.page = 1;
		this.hasdata = false;
		switch (this.current) {
			case 0:
				this.getList(1);
				break;
			case 1:
				this.getList(2);
				break;
			case 2:
				this.getList(3);
				break;
		}
	},

	methods: {
		// tab栏切换
		change(index) {
			this.swiperCurrent = index;
			console.log(this.swiperCurrent);
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
			switch (current) {
				case 0:
					this.getList(1);
					break;
				case 1:
					this.getList(2);
					break;
				case 2:
					this.getList(3);
					break;
			}
		},
		//判断是否已付款
		isPay(text) {
			// is_sale
			switch (text) {
				case '待付款':
					return '未付';
					break;
				case '待收货':
					return '已付';
					break;
				case '已完成':
					return '已处理';
					break;
			}
		},
		//订单
		getList(id) {
			let self = this;
			self.$u.api
				.orderList({
					page: self.page,
					status: id,
					is_staff: 1
				})
				.then(res => {
					if (self.page == 1) {
						self.dataList = [];
						self.dataList = res.data.list;
					} else {
						self.dataList = self.dataList.concat(res.data.list);
					}
					self.hasdata = self.page < res.data.pagination.page_count;
					uni.stopPullDownRefresh();
				});
		},
		//可滑动视图，上拉加载
		onreachBottom() {
			if (!this.hasdata) {
				return;
			}
			this.page++;
			switch (this.current) {
				case 0:
					this.getList(1);
					break;
				case 1:
					this.getList(2);
					break;
				case 2:
					this.getList(3);
					break;
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.dataList = [];
			this.page = 1;
			this.hasdata = false;
			switch (this.current) {
				case 0:
					this.getList(1);
					break;
				case 1:
					this.getList(2);
					break;
				case 2:
					this.getList(3);
					break;
			}
		}
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
										font-size: 28rpx;
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
							display: flex;
							justify-content: flex-end;
							margin-top: 22rpx;

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

								.pay {
									margin-left: 26rpx;
									height: 48rpx;
									line-height: 48rpx;
									border-radius: 24rpx;
									border: 1px solid #5d7291;
									color: #5d7291;
									padding: 0 32rpx;
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

.swiper-item {
	height: 100%;
}
</style>
