<template>
	<view class="wrap">
		<!-- 1. 留言列表 -->
		<view class="no_coupon" v-if="hasCoupon">
			<u-empty class="empty" icon-size="268" color="#1A1B1D" font-size="28" text="暂无优惠券可使用哦~"
				src="/static/images/no_coupon_default.png"></u-empty>
		</view>

		<!-- 2.  -->
		<view class="coupon_list_container" v-else>
			<!-- 2.1  -->
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#5d7291" :bar-width="138" inactive-color="#1a1b1d" ref="tabs" :list="list"
					:current="current" @change="change" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
			<!-- 2.2  -->
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width:100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<view class="card" v-for="(item,index) in dataList" :key="item.id">
								<view class="item">
									<view class="left">
										<text>{{item.fishPond.name}}</text>
										<text>{{item.fish_pond_seat_id}}号钓位</text>
									</view>
									<view class="middle">{{item.message}}</view>
									<navigator :url="`./messageDetail?id=${item.id}&name=${item.fishPond.name}`" class="right text24">查看
									</navigator>
								</view>
							</view>
							<u-loadmore :status="loadStatus[0]" bgColor="#fff"></u-loadmore>
						</view>
					</scroll-view>
				</swiper-item>

				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<view class="card" v-for="(item,index) in dataList" :key="item.id">
								<view>
									<view class="item">
										<view class="left">
											<text>{{item.fishPond.name}}</text>
											<text>{{item.handle_user_id}}号钓位</text>
										</view>
										<text class="middle u-line-1">{{item.message}}</text>
										<view class="right text24 restricted">{{item.handleUser.nickname}}</view>
									</view>
								</view>
							</view>
							<u-loadmore :status="loadStatus[0]" bgColor="#fff"></u-loadmore>
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
				status: 0, //处理状态
				limit: 10,
				page: 1,
				hasdata: false,
				orderList: [
					[],
					[],
					[],
					[]
				],
				dataList: [],
				list: [{
						name: '未处理'
					},
					{
						name: '已处理'
					}
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore']
			};
		},
		onShow() {
			this.retain(this.status, this.page);
		},
		// 下拉刷新：
		onPullDownRefresh() {
			this.dataList = [];
			this.page = 1;
			this.hasdata = false;
			this.swiperCurrent = this.status
			this.retain(this.status, this.page)
		},
		computed: {
			hasCoupon() {
				return false;
			}

			// // 价格小数
			// priceDecimal() {
			// 	return val => {
			// 		if (val !== parseInt(val)) return val.slice(-2);
			// 		else return '00';
			// 	};
			// },
			// // 价格整数
			// priceInt() {
			// 	return val => {
			// 		if (val !== parseInt(val)) return val.split('.')[0];
			// 		else return val;
			// 	};
			// }
		},
		methods: {
			//
			//留言API
			retain(status, page) {
				console.log(page)
				let self = this
				self.$u.api2
					.getRetain({
						page: page,
						limit: self.limit,
						status: status
					})
					.then(res => {
						if (self.page == 1) {
							self.dataList = []
							self.dataList = res.data.list

						} else {
							self.dataList = self.dataList.concat(res.data.list); //实际返回数据的字段
						}
						self.hasdata = self.page < res.data.pagination.page_count;
						console.log(self.hasdata)
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						console.log(err);
					});
			},
			//上拉加载
			reachBottom() {
				if (!this.hasdata) {
					return;
				}
				this.page++;
				this.retain(this.status, this.page)

			},
			// 页面数据
			// getOrderList(idx) {
			// 	for (let i = 0; i < 5; i++) {
			// 		let index = this.$u.random(0, this.dataList.length - 1);
			// 		let data = JSON.parse(JSON.stringify(this.dataList[index]));
			// 		data.id = this.$u.guid();
			// 		this.orderList[idx].push(data);
			// 	}

			// 	this.loadStatus.splice(this.current, 1, 'loadmore');
			// },
			// // 总价
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
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				this.status = index
				this.retain(index, this.page);
				console.log(index);
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	};
</script>

<style lang="scss">
	page {
		// background-color: #f7f7f8;
	}

	.restricted {
		overflow: hidden;
	}

	.wrap {
		width: 100%;
		// background-color: #f7f7f8;
	}
</style>

<style lang="scss" scoped>
	.wrap {
		width: 100%;
		// background-color: #f7f7f8;

		.no_coupon {
			.empty {
				padding-top: 56rpx;
			}
		}

		.swiper-box {
			margin-top: 26rpx;
			height: calc(100vh - var(--window-top) - 150rpx);

			.swiper-item {
				// background-color: #f7f7f8;

				.page-box {
					.card {
						.item {
								
							display: flex;
							align-items: center;
							padding: 20rpx 24rpx;
							margin-bottom: 20rpx;
							border-bottom: 1rpx solid #c4c4c4;

							.left {
								display: flex;
								flex-direction: column;
								margin-right: 48rpx;

								text:first-child {
									font-size: 32rpx;
									color: #1a1b1d;
									margin-bottom: 4rpx;
								}

								text:last-child {
									font-size: 24rpx;
									color: #626262;
								}
							}

							.middle {
								// width: 434rpx;
								flex: 1;
								max-width:434rpx;
								margin-right: 30rpx;
								font-size: 28rpx;
								color: #4f4f4f;
								line-height: 44rpx;
							}

							.right {
								max-width:126rpx;
								background-color: #4f4f4f;
								color: #fff;
								min-width:94rpx;
								height: 48rpx;
								line-height: 48rpx;
								text-align: center;
								border-radius: 4rpx;
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
