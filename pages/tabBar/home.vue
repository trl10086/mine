<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="wrap-in">
			<!-- 1. 轮播图 -->
			<view class="banner"><u-swiper :list="chiefBanner" name="pic_url"></u-swiper></view>

			<!-- 2. 通知 -->
			<view class="notices">
				<view class="notices-icon"><u-image src="/static/images/bell.png" width="40" height="40"></u-image></view>
				<text class="info" v-if="notice[0].content.length" :id="notice[0].id">{{ notice[0].content }}</text>
				<text class="info" v-else :id="notice[0].id">暂无公告</text>
			</view>
			<!-- 3. 动态排行榜 -->
			<view class="rank-list">
				<view class="header">
					<text class="title">动态排行榜</text>

					<navigator @click.stop="page_ranking()" class="load-more">更多 ></navigator>
				</view>
				<view class="card">
					<view v-if="cumulative_weight.length == 0 ? true : false">暂无排行</view>
					<view v-else class="item" v-for="(k, index) in cumulative_weight" :key="index" v-if="index < 3">
						<view class="box-flex">
							<view class="cover"><u-image shape="circle" height="132" width="132" :src="k.avatar"></u-image></view>
							<view class="username u-line-1">{{ k.nickname }}</view>
							<view class="total u-line-1">累计总量：{{ k.all_weight }}/斤</view>
							<view class="tag">
								<u-image v-if="index == 0" src="/static/images/jb1.png" width="59" height="56"></u-image>
								<u-image v-if="index == 1" src="/static/images/jb2.png" width="59" height="56"></u-image>
								<u-image v-if="index == 2" src="/static/images/jb3.png" width="59" height="56"></u-image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 往期钓鱼 -->
			<view>
				<view class="fishing-past-more">
					<text class="title ">往期放鱼数量</text>
					<text class="load-more" @click="$u.route('/pages/dynamicRank/oldFishNumber')">更多 ></text>
				</view>
				<view class="fishing-past-outer">
					<view class="fishing-past-inner">
						<view class="fishing-past-form">
							<view v-if="!releaseFish.length" class="being">未放鱼</view>
							<view v-else class="fishing-past-value" v-for="(item, index) in releaseFish" :key="item.id">
								<text style="margin-left: 28rpx;">{{ item.date }}</text>
								<text>{{ item.fish_type_name }}</text>
								<text style="margin-right: 50rpx;width: 140rpx;display: block;">{{ item.jin_number }}斤</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 4. 开钓付费 -->
			<view class="fish-charge">
				<view class="header">
					<text class="title">开钓付费</text>
					<view @click.stop="page_down()" class="load-more">更多 ></view>
				</view>
				<!-- <view class="card">
					<view class="item" v-for="(k, index) in PondList" :key="index">
						<u-image width="240" height="240" border-radius="8" :src="k.pic_url[0].url"></u-image>
						<view class="info">
							<view class="title">{{ k.name }}</view>
							<view class="short-title">{{ k.details }}</view>
							<view class="price-bt">
								价格：
								<text class="price">{{ k.price }}元</text>
							</view>
							<view class="tags">
								<u-tag text="提前结束" type="info" shape="circle" bg-color="#5d7291" color="#fff" mode="dark" />
								<u-tag text="更换位置" type="info" shape="circle" bg-color="#5d7291" color="#fff" mode="dark" />
								<u-tag text="续费" type="info" shape="circle" bg-color="#5d7291" color="#fff" mode="dark" />
							</view>
						</view>
					</view>
				</view> -->
				<!-- 开钓付费组件 -->
				<fishing ref="fishing"></fishing>
			</view>
			<!-- 5. 比赛预约 -->
			<view class="match-order">
				<view class="header">
					<text class="title">比赛预约</text>
					<navigator @click.stop="page_arrange()" class="load-more">更多 ></navigator>
				</view>
				<view class="card" v-for="match in getCompetitionList" :key="match.id">
					<view @click="navigation(match.is_end, match.id)">
						<view class="item">
							<view :class="[match.is_end == 1 ? 'end' : '']"><u-image width="664" height="316" border-radius="8" :src="match.pic_url[0].url"></u-image></view>
							<view class="title">{{ match.match_name }}</view>
							<view class="info u-line-4">
								{{ match.match_detail }}
								<text class="jzgd">更多</text>
							</view>
							<view class="footer">
								<view>
									<text class="bt">时间：</text>
									<text class="date">{{ match.created_at }}</text>
								</view>
								<view>
									<text class="bt">地点：</text>
									<text class="location">{{ match.address }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import fishing from '../../components/home/Pay-for-fishing.vue'; //首页的开钓付费
export default {
	components: {
		fishing
	},
	data() {
		return {
			cumulative_weight: [], //接收后端获取动态排行榜数据
			notice: [],
			chiefBanner: [],
			PondList: [],
			getCompetitionList: [],
			page: 1,
			current: 0,
			hasdata: false,
			releaseFish: [],
			list: [
				{
					image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
					title: '昨夜星辰昨夜风，画楼西畔桂堂东'
				},
				{
					image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
					title: '身无彩凤双飞翼，心有灵犀一点通'
				},
				{
					image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
					title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
				}
			]
		};
	},
	onShow() {
		this.competitionList(1);
		this.$refs.fishing.setApi({ api2: this.$u.api2, self: 1 });
		this.fishReleaseRecord();
	},
	onLoad() {
		this.shouYeLunBo();
		this.getProclamation();
		this.waterList();
		this.getCharts();
		
	},
	//下来刷新
	onPullDownRefresh() {
		this.getCompetitionList = [];
		this.page = 1;
		this.hasdata = false;
		this.competitionList(this.current + 1);
	},

	//上拉加载
	onReachBottom() {
		if (!this.hasdata) {
			return;
		}
		this.page++;
		this.competitionList(this.current + 1);
	},
	methods: {
		//放鱼记录
		async fishReleaseRecord() {
			let self = this;
			let res = await self.$u.api2.getFishReleaseRecord({ fish_type: 1, s_time: 0, e_time: 0, limit: 3, page: 0 });
			this.releaseFish = res.data.list;
			console.log(62411, res);
		},
		//活动结束禁止跳转
		navigation(end, id) {
			this.sLogin();
			// if (end == 1) {
			// 	uni.showModal({
			// 		title: '活动已结束',
			// 		content: '是否进入往期排行',
			// 		success: function(res) {
			// 			if (res.confirm) {
			// 				uni.navigateTo({
			// 					url: '../matchOrder/oldRank'
			// 				});
			// 			} else if (res.cancel) {
			// 	   console.log('用户点击取消');
			// 			}
			// 		}
			// 	});
			// uni.showToast({
			// 	title: '活动已结束',
			// 	icon: 'none',
			// 	duration: 2000
			// });
			// } else {
			uni.navigateTo({
				url: `/pages/matchOrder/matchOrder?id=${id}`
			});
			// }
			console.log(end);
		},
		//比赛列表API
		competitionList(page) {
			let self = this;
			this.$u.api2
				.getCompetition({ page: page, limit: 10 })
				.then(res => {
					if (self.page == 1) {
						self.getCompetitionList = [];
						self.getCompetitionList = res.data.list;
						console.log(1561, self.getCompetitionList);
					} else {
						self.getCompetitionList = self.getCompetitionList.concat(res.data.list);
					}
					console.log(res);
					self.hasdata = self.page < res.data.pagination.page_count;
					uni.stopPullDownRefresh();
				})
				.catch(err => {
					this.$refs.uToast.show({
						title: err.msg
					});
					console.log(err);
				});
		},
		//点击排行榜跳转到开钓付费页面
		page_arrange() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '../matchOrder/shakyList'
			});
		},
		//点击排行榜跳转到开钓付费页面
		page_ranking() {
			if (this.sLogin()) {
				return;
			}
			uni.navigateTo({
				url: '/pages/dynamicRank/dynamicRank'
			});
		},
		//点击鱼塘跳转到开钓付费页面
		page_down() {
			if (this.sLogin()) {
				return;
			} else {
				uni.navigateTo({
					url: '/pages/fishCharge/fishCharge'
				});
			}
		},
		//鱼塘列表API
		waterList() {
			this.$u.api2
				.getPondList({
					page: 1,
					limit: 10
				})
				.then(res => {
					this.PondList = res.data.list;
				})
				.catch(err => {
					console.log(err);
				});
		},
		//获取公告API
		getProclamation() {
			this.$u.api2
				.getNotice()
				.then(res => {
					this.notice = res.data;
				})
				.catch(err => {
					console.log(err);
				});
		},
		//获取排行榜API
		getCharts(index) {
			this.$u.api2
				.getrankingList({})
				.then(res => {
					this.cumulative_weight = res.data;
					console.log(154, res);
				})
				.catch(err => {
					console.log(err);
				});
		},
		//首页轮播图
		shouYeLunBo() {
			this.$u.api2
				.getShouYelunbo()
				.then(res => {
					this.chiefBanner = res.data.home_pages[0].banners;
				})
				.catch(err => {
					console.log(err);
				});
		},
		//游客模式
		sLogin() {
			if (this.token) {
				return false;
			} else {
				uni.navigateTo({
					url: '../login/login'
				});
				return true;
			}
		},
		onClick() {}
	}
};
</script>

<style lang="scss">
.being {
	text-align: center;
	font-size: 36rpx;
	line-height: 174rpx;
}
.fishing-past-value {
	display: flex;
	justify-content: space-between;
	padding-top: 18rpx;
	font-size: 28rpx;
	color: #31425b;
}
.fishing-past-more {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 38rpx 20rpx 18rpx 20rpx;
	.title {
		font-size: 36rpx;
		color: #151817;
		padding: 16rpx 0;
		font-weight: 500;
	}
	.load-more {
		font-size: 24rpx;
		color: #969998;
	}
}
.fishing-past-outer {
	height: 230rpx;
	background-color: #3a5680;
	border: 1rpx solid;
	border-radius: 16rpx;
	.fishing-past-inner {
		height: 184rpx;
		background-color: #fff;
		margin: 20rpx;
		border-radius: 16rpx;
	}
}
.box-flex {
	align-items: center;
	flex-direction: column;
	display: flex;
	width: 100%;
}
.wrap {
	width: 100%;
	background-color: #f7f7f8;
	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;
		.banner {
			width: 100%;
			height: 256rpx;
			margin: 16rpx 0;
			border-radius: 12rpx;
		}
		.notices {
			display: flex;
			margin-top: 25rpx;
			border-radius: 8rpx;
			background-color: #fff;
			.notices-icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
				margin-top: 10rpx;
			}
			.info {
				flex: 1;
				height: 58rpx;
				line-height: 58rpx;
			}
		}
		.rank-list {
			margin-top: 20rpx;
			background-color: #fff;
			padding: 0 20rpx 40rpx;
			border-radius: 16rpx;
			.header {
				display: flex;
				justify-content: space-between;
				.title {
					padding: 28rpx 0 22rpx;
					font-size: 36rpx;
					color: #151817;
					line-height: 44rpx;
					font-weight: 500;
				}
				.load-more {
					padding: 28rpx 0 22rpx;
					font-size: 24rpx;
					color: #969998;
				}
			}
			.card {
				display: flex;
				.item {
					// margin-right: 20rpx;
					margin-right: 6rpx;
					margin-left: 6rpx;
					height: 354rpx;
					padding-top: 44rpx;
					width: 208rpx;
					box-shadow: 4px 4px 16px 2px rgba(0, 0, 0, 0.25);
					display: flex;
					flex-direction: column;
					align-items: center;
					position: relative;
					.username {
						width: 100%;
						text-align: center;
						font-size: 28rpx;
						color: #1a1b1d;
						padding-top: 26rpx;
						line-height: 44rpx;
					}
					.total {
						width: 100%;
						text-align: center;
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
		.fish-charge {
			margin-top: 24rpx;
			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title {
					font-size: 36rpx;
					color: #151817;
					// padding: 16rpx 0;
					padding-top: 16rpx;
					padding-left: 16rpx;
					font-weight: 500;
				}
				.load-more {
					font-size: 24rpx;
					color: #969998;
					// padding: 22rpx 20rpx;
					padding-top: 22rpx;
					padding-right: 20rpx;
				}
			}
			.card {
				border-radius: 12rpx;
				padding: 44rpx 18rpx;
				background-color: #fff;
				.item:first-child {
					margin-bottom: 72rpx;
				}
				.item {
					display: flex;
					background-color: #fff;
					.info {
						flex: 1;
						padding-left: 14rpx;
						.title,
						.price-bt {
							font-size: 32rpx;
							color: #1a1b1d;
							font-weight: 500;
						}
						.title {
							color: #1a1b1d;
						}
						.short-title {
							font-size: 24rpx;
							color: #424242;
							line-height: 36rpx;
						}
						.price {
							font-size: 36rpx;
							color: #f38b11;
						}
						.tags {
							display: flex;
							justify-content: space-around;
						}
					}
				}
			}
		}
		.match-order {
			margin-top: 40rpx;
			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-left: 16rpx;
				.title {
					font-size: 36rpx;
					color: #151817;
					font-weight: 500;
				}
				.load-more {
					padding-right: 20rpx;
					font-size: 24rpx;
					color: #969998;
					padding: 20rpx;
				}
			}
			.card {
				.item {
					background-color: #fff;
					padding: 20rpx 18rpx;
					border-radius: 16rpx;
					margin-bottom: 16rpx;
					.end {
						position: relative;
						&::after {
							position: absolute;
							top: 0;
							right: 0;
							content: '';
							width: 164rpx;
							height: 164rpx;
							background: url(../../static/images/activity-end.png) no-repeat;
							background-size: 164rpx 164rpx;
						}
					}
					.title {
						font-size: 32rpx;
						color: #151817;
						font-weight: 500;
						line-height: 44rpx;
						margin-top: 20rpx;
						margin-bottom: 8rpx;
					}
					.info {
						font-size: 24rpx;
						color: #424242;
						line-height: 36rpx;
						margin-bottom: 8rpx;
						.jzgd {
							font-size: 30rpx;
							color: #5d7291;
						}
					}
					.footer {
						display: flex;
						justify-content: space-between;
						.bt {
							color: #151817;
						}
						.date,
						.location {
							font-size: 24rpx;
							color: #5d7291;
						}
					}
				}
			}
		}
	}
}
</style>
