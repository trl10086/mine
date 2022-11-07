<template>
	<view class="wrap">
		<!-- 2. 优惠券列表 -->
		<view class="coupon_list_container">
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
				<swiper-item class="swiper-item" v-for="n in 3" :key="n">
					<scroll-view scroll-y @scrolltolower="onreachBottom" style="height: 100%;width:100%;">
						<!-- 1. 暂无优惠券 -->
						<view class="no_coupon" v-if="dataList.length == 0">
							<u-empty class="empty" icon-size="268" color="#1A1B1D" font-size="28" text="无优惠券哦~" src="/static/images/no_coupon_default.png"></u-empty>
						</view>
						<view class="page-box">
							<view class="card">
								<navigator v-for="(item, index) in dataList" :key="item.coupon_id" class="item" @click="getchange(item, index)">
									<view class="coupon-card">
										<view class="left">
											<view class="header">
												<view class="icon" :class="{ expire: item.is_overdue == 1 }">优惠券</view>
												<view class="title">{{ item.coupon.name }}</view>
											</view>
											<view class="body">{{ item.end_time }}到期</view>
											<view class="footer">使用规则：{{ item.coupon.rule }}</view>
										</view>
										<view class="right" :class="{ expire: item.is_overdue == 1 }">
											<view class="price">
												<text class="bt">¥</text>
												<text class="number">{{ item.sub_price }}</text>
											</view>
											<view class="go-use" :class="{ expire: item.is_overdue == 1 }">
												{{ item.is_overdue == 1 ? '已过期' : item.is_use == 0 ? '去使用' : '已使用' }}
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
			fishpondid: '',
			list: [
				{
					name: '未使用'
				},
				{
					name: '已使用'
				},
				{
					name: '已过期'
				}
			],
			current: 0,
			swiperCurrent: 0,
			tabsHeight: 0,
			dx: 0,
			page: 1,
			hasdata: false,
			dataList: [],
			fishpondid: ' ',
			//判断是否从订单里跳转过来的
			two_sided: '',
			up_index: 0,
			data: {},
			user_id: ''
		};
	},
	onLoad(res) {
		console.log(1412, res);
		
		this.user_id = res.user_id;
		this.two_sided = res.id;
		this.fishpondid = res.fishpondid;
		this.up_index = res.index;
		console.log(res);
		this.getList(this.current + 1);
	},
	methods: {
		//跳到鱼塘详情页
		getchange(item, index) {
			console.log(item);
			if (item.is_overdue == 1 || item.is_use == 1) {
				return;
			}
			if (this.two_sided == 1) {
				uni.navigateTo({
					url: '/pages/fishCharge/changeLocation' + `?id=${item.fish_pond_id}`
				});
			} else {
				this.$u.route({ type: 'back' });
				uni.$emit('coupon', this.dataList[index], this.dataList.length, 4);
			}
		},
		//优惠劵列表
		getList(type) {
			let self = this;
			console.log(type);
			if(self.user_id='undefined'){
				self.user_id=0
			}
			const data = {
				page: self.page,
				status: type,
				user_id: self.user_id
			};
			if (this.up_index == 1) {
				data.fish_pond_id = self.fishpondid;
			}

			self.$u.api.user_coupon(data).then(res => {
				if (self.page == 1) {
					self.dataList = [];
					self.dataList = res.data.list;
					console.log(1542, self.dataList);
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

			// this.dataList = [];
			// this.page = 1;
			// this.hasdata = false;
			// this.getList(this.current + 1);
		},
		//可滑动视图，上拉加载
		onreachBottom() {
			if (!this.hasdata) {
				return;
			}
			this.page++;
			this.getList(this.current + 1);
		},
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
			this.getList(current + 1);
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
					.item {
						background-color: #fff;
						height: 180rpx;
						margin-bottom: 16rpx;
						border-radius: 12rpx;

						.coupon-card {
							display: flex;

							.left {
								width: 536rpx;
								height: 180rpx;

								.header {
									display: flex;
									height: 42rpx;
									line-height: 42rpx;
									margin-top: 26rpx;
									padding-left: 32rpx;

									.icon {
										width: 86rpx;
										text-align: center;
										border-radius: 8rpx;
										background-color: #ff8f00;
										color: #fff;
										font-size: 24rpx;

										&.expire {
											background-color: #969998;
										}
									}

									.title {
										font-size: 26rpx;
										font-weight: bold;
										padding-left: 22rpx;
									}
								}

								.body,
								.footer {
									padding-left: 32rpx;
									color: #b0b2b1;
									line-height: 44rpx;
								}

								.body {
									margin-top: 10rpx;
								}
							}

							.right {
								width: 166rpx;
								height: 180rpx;
								background-color: #ffb300;
								color: #fff;

								display: flex;
								flex-direction: column;
								justify-content: space-around;
								align-items: center;

								&.expire {
									background-color: #969998;
								}

								.price {
									.bt {
										font-size: 18rpx;
									}

									.number {
										font-size: 30rpx;
									}
								}

								.go-use {
									font-size: 24rpx;
									width: 100rpx;
									height: 40rpx;
									border-radius: 4rpx;

									line-height: 40rpx;
									text-align: center;

									background-color: #fff;
									color: #f38b11;

									&.expire {
										color: #969998;
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
