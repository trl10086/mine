<template>
	<view>
		<view class="wrap">
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
			<swiper  class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<!-- 本月累计重量 -->
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%; width: 100%" @scrolltolower="reachBottom">
						<view class="page-box">
							<view class="rank-list">
								<view class="card">
									<view v-if="cumulative_weight.length==0?true:false">暂无数据，快来当冠军</view>
									<view class="item" v-for="(k, index) in cumulative_weight" :key="index">
										<u-image class="cover" shape="circle" height="132" width="132" :src="k.avatar"></u-image>
										<view class="username">{{ k.nickname }}</view>
										<view class="total">累计总量：{{ k.all_weight }}/斤</view>
										<view class="tag">
											<u-image v-if="index == 0" src="/static/images/jb1.png" width="59" height="56"></u-image>
											<u-image v-if="index == 1" src="/static/images/jb2.png" width="59" height="56"></u-image>
											<u-image v-if="index == 2" src="/static/images/jb3.png" width="59" height="56"></u-image>
										</view>
									</view>
								</view>
							</view>

							<u-loadmore :status="loadStatus[0]" bgColor="#f2f2f2"></u-loadmore>
						</view>
					</scroll-view>
				</swiper-item>

				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%; width: 100%" @scrolltolower="reachBottom">
						<view class="page-box">
							<view class="rank-list">
								<view class="card">
									<view class="item" v-for="(i, index) in cumulative_weight" :key="index">
										<u-image class="cover" shape="circle" height="132" width="132" :src="i.avatar"></u-image>
										<view class="username">{{ i.nickname }}</view>
										<view class="total">累计次数：{{ i.all_num }}次</view>
									</view>
								</view>
							</view>

							<u-loadmore :status="loadStatus[1]" bgColor="#f2f2f2"></u-loadmore>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>
,
<script>
export default {
	data() {
		return {
			page: 1,
			hasdata: false,
			cumulative_weight: [], //接收后端获取动态排行榜数据
			length: '',

			list: [
				{
					name: '本月累计重量'
				},
				{
					name: '本月累计次数'
				}
			],
			current: 0,
			swiperCurrent: 0,
			tabsHeight: 0,
			dx: 0,
			loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore']
		};
	},
	onLoad() {
		this.getOrderList(0);
		this.getOrderList(1);
		this.getOrderList(3);
		this.getCharts();
	},
	computed: {
		// 价格小数
		priceDecimal() {
			return val => {
				if (val !== parseInt(val)) return val.slice(-2);
				else return '00';
			};
		},
		// 价格整数
		priceInt() {
			return val => {
				if (val !== parseInt(val)) return val.split('.')[0];
				else return val;
			};
		}
	},
	//下拉刷新
	onPullDownRefresh() {
		this.cumulative_weight = [];
		this.page = 1;
		this.hasdata = false;
		this.current=0
		this.getCharts(0)
	},
	methods: {
		reachBottom() {
			if (!this.hasdata) {
				return;
			}
			this.page++;
			this.getList(this.current + 1);
			// 此tab为空数据
			if (this.current != 2) {
				this.loadStatus.splice(this.current, 1, 'loading');
				setTimeout(() => {
					this.getOrderList(this.current);
				}, 1200);
			}
		},
		// 页面数据
		getOrderList(idx) {},
		// 总价
		totalPrice(item) {
			let price = 0;
			item.map(val => {
				price += parseFloat(val.price);
			});
			return price.toFixed(2);
		},
		// 总件数
		totalNum(item) {
			let num = 0;
			item.map(val => {
				num += val.number;
			});
			return num;
		},
		// tab栏切换
		change(index) {
			this.getCharts(index); //获取动态排行榜
			this.swiperCurrent = index;
			this.getOrderList(index);
		},
		// 获取动态排行榜
		getCharts(index) {
			let i = 1;
			if (index == 1) {
				i = 2;
			}
			let self = this;
			this.$u.api2
				.getrankingList({
					type: i,
					page: 99
				})
				.then(res => {
					self.cumulative_weight = res.data;
					console.log(res.data);
				})
				.catch(err => {
					console.log(err);
				});
		},
		transition({ detail: { dx } }) {
			this.$refs.tabs.setDx(dx);
		},
		animationfinish({ detail: { current } }) {
			console.log(current);
			this.$refs.tabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
			this.cumulative_weight = [];
			this.page = 1;
			this.hasdata = false;
			this.getCharts(current);
		}
	}
};
</script>

<style>
/* #ifndef H5 */

page {
	height: 100%;
	background-color: #f2f2f2;
}
/* #endif */
</style>

<style lang="scss" scoped>
.rank-list {
	margin-top: 20rpx;
	background-color: #fff;
	padding: 0 20rpx 40rpx;
	background-color: #f7f7f8;
	.card {
		&::after {
			display: block;
			content: '';
			clear: both;
		}
		.item {
			background-color: #fff;
			float: left;
			margin-right: 13rpx;
			padding-top: 44rpx;
			width: 224rpx;
			height: 352rpx;
			margin-bottom: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			.username {
				font-size: 28rpx;
				color: #1a1b1d;
				padding-top: 26rpx;
				line-height: 44rpx;
			}
			.total {
				font-size: 22rpx;
				color: #a1a1a1;
				line-height: 44rpx;
				padding-bottom: 10rpx;
			}
			.tag {
				position: absolute;
				left: 0;
				top: 0;
				width: 59rpx;
				height: 56rpx;
			}
		}
	}
}

.order {
	width: 710rpx;
	background-color: #ffffff;
	margin: 20rpx auto;
	border-radius: 20rpx;
	box-sizing: border-box;
	padding: 20rpx;
	font-size: 28rpx;
	.top {
		display: flex;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			.store {
				margin: 0 10rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.right {
			color: $u-type-warning-dark;
		}
	}
	.item {
		display: flex;
		margin: 20rpx 0 0;
		.left {
			margin-right: 20rpx;
			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
		}
		.content {
			.title {
				font-size: 28rpx;
				line-height: 50rpx;
			}
			.type {
				margin: 10rpx 0;
				font-size: 24rpx;
				color: $u-tips-color;
			}
			.delivery-time {
				color: #e5d001;
				font-size: 24rpx;
			}
		}
		.right {
			margin-left: 10rpx;
			padding-top: 20rpx;
			text-align: right;
			.decimal {
				font-size: 24rpx;
				margin-top: 4rpx;
			}
			.number {
				color: $u-tips-color;
				font-size: 24rpx;
			}
		}
	}
	.total {
		margin-top: 20rpx;
		text-align: right;
		font-size: 24rpx;
		.total-price {
			font-size: 32rpx;
		}
	}
	.bottom {
		display: flex;
		margin-top: 40rpx;
		padding: 0 10rpx;
		justify-content: space-between;
		align-items: center;
		.btn {
			line-height: 52rpx;
			width: 160rpx;
			border-radius: 26rpx;
			border: 2rpx solid $u-border-color;
			font-size: 26rpx;
			text-align: center;
			color: $u-type-info-dark;
		}
		.evaluate {
			color: $u-type-warning-dark;
			border-color: $u-type-warning-dark;
		}
	}
}

.centre {
	text-align: center;
	margin: 200rpx auto;
	font-size: 32rpx;
	image {
		width: 164rpx;
		height: 164rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
	}
	.tips {
		font-size: 24rpx;
		color: #999999;
		margin-top: 20rpx;
	}
	.btn {
		margin: 80rpx auto;
		width: 200rpx;
		border-radius: 32rpx;
		line-height: 64rpx;
		color: #ffffff;
		font-size: 26rpx;
		background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
	}
}

.wrap {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}

.swiper-box {
	flex: 1;
}

.swiper-item {
	height: 100%;
}
</style>
