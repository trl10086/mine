<template>
	<view class="wrap">
		<view style="width: 100%; position: sticky;top: 0rpx;z-index: 1;">
			<!-- 1. 搜索栏 -->
			<view class="search">
				<u-search placeholder="关键字搜索" @change="schange" bg-color="#fff" v-model="keyword" :show-action="false">
				</u-search>
			</view>

			<!-- 2. 商品选项卡 -->
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#5d7291" bg-color="#F7F7F8" :bar-width="138" gutter="100"
					inactive-color="#1a1b1d" ref="tabs" :list="list" :current="current" @change="change"
					:is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
		</view>
		<!-- <view style="height: 160rpx;"></view> -->
		<view class="wrap-in">
			<!-- 3. 商品列表 -->
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="n in list.length" :key="n">
					<scroll-view scroll-y style="height: 100%;width:100%;" @scrolltolower="onreachBottom">
						<view class="page-box">
							<view class="card" style="margin-left: 24rpx; margin-right: 24rpx;">
								<view v-for="item in dataList" :key="item.id">
									<view class="item" @click="onClick(item)">
										<u-image height="340" width="340" border-radius="16" :src="item.cover_pic">
										</u-image>
										<view class="title u-line-2">{{item.name}}</view>
										<view class="price"><text class="bt">¥</text><text
												class="number">{{item.price}}元</text>
										</view>
									</view>
								</view>
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
				keyword: '',
				list: [{
						name: '渔具'
					},
					{
						name: '鱼饵'
					},
					{
						name: '饮料食物'
					},
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
				// 翻页
				page: 1,
				hasdata: false,
				//分类下商品列表
				dataList: [],
			};
		},
		onLoad() {
			this.shopList()
		},
		methods: {
			sLogin() {
				if (this.token) {
					return false
				} else {
					uni.navigateTo({
						url: '../login/login'
					})
					return true
				}
			},
			onClick(item) {
				if (this.sLogin()) {
					return
				}
				uni.navigateTo({
					url: '../shop/detail?id=' + item.id
				})
			},
			//搜索
			schange() {
				const ids = this.list[this.swiperCurrent].id
				this.getList(ids)
			},
			//获取分类
			shopList() {
				let self = this
				self.$u.api.shopList({}).then(res => {
					self.list = res.data.list
					self.change(0)
				})
			},
			//获取分类下的商品
			getList(id) {
				let self = this
				self.$u.api.shopGoods_list({
					cat_id: id,
					keyword: self.keyword,
					page: self.page
				}).then(res => {
					if (self.page == 1) {
						self.dataList = [];
						self.dataList = res.data.list
					} else {
						self.dataList = self.dataList.concat(res.data.list);
					}
					self.hasdata = self.page < res.data.pagination.page_count;
					uni.stopPullDownRefresh();
				})
			},
			// 下拉刷新
			onPullDownRefresh() {
				const ids = this.list[this.current].id
				this.dataList = [];
				this.page = 1;
				this.hasdata = false
				this.getList(ids)
			},
			//可滑动视图，上拉加载
			onreachBottom() {
				if (!this.hasdata) {
					return;
				}
				this.page++
				const ids = this.list[this.current].id
				this.getList(ids)
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				const ids = this.list[index].id
				this.getList(ids)
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish(e) {
				let current = e.detail.current;
				if (current != this.swiperCurrent) {
					const ids = this.list[current].id
					this.dataList = [];
					this.page = 1;
					this.hasdata = false
					this.getList(ids)
				}
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				
			}
		},
	};
</script>

<style lang="scss">
	.search{
		margin-top: 22rpx;
	}
	.wrap {
		width: 100%;
		background-color: #f7f7f8;
		.wrap-in {
			width: 750rpx;
			margin: 0 auto;
			.swiper-box {
				margin-top: 26rpx;
				height: calc(100vh - var(--window-top) - 150rpx);

				.swiper-item {
					background-color: #f7f7f8;
					
					.page-box {
						.card {
							display: flex;
							flex-wrap: wrap;
							justify-content: space-between;

							.item {
								background-color: #fff;
								height: 550rpx;
								width: 340rpx;
								margin-bottom: 18rpx;
								border-radius: 8rpx;

								.title {
									font-size: 28rpx;
									line-height: 44rpx;
									margin-top: 28rpx;
									margin-bottom: 18rpx;
									padding-left: 20rpx;
								}

								.price {
									padding-bottom: 18rpx;
									padding-left: 20rpx;

									.bt {
										font-size: 24rpx;
										color: #F38B10;
									}

									.number {
										font-size: 32rpx;
										color: #F38B10;
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
