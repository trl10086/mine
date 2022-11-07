<!-- 比赛预约页面 -->
<template>
	<view class="wrap">
		<view class="wrap-in">
			<view class="match-order">
				<view class="card" v-for="match in getCompetitionList" :key="match.id">
					<view  @click="navigation(match.is_end,match.id)">
						<view class="item">
								<view :class="[match.is_end==1?'end':'']"><u-image width="664" height="316" border-radius="8" :src="match.pic_url[0].url"></u-image></view>
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
	export default {
		data() {
			return {
				getCompetitionList: [],
				page:1,
				hasdata: false,
			};
		},
		onLoad() {
			this.competitionList(1)
		},
		// 下拉刷新：
		onPullDownRefresh() {
		 this.getCompetitionList = [];
		 this.page = 1;
		 this.hasdata = false
		 this.competitionList(this.page);
		},
		// 上拉加载：
		onReachBottom() {
		 if (!this.hasdata) {
		  return ;
		 }
		 this.page++
		 this.competitionList(this.page);
		},
		
		methods:{
			//活动结束禁止跳转
			navigation(end, id) {
			
					uni.navigateTo({
						url: `/pages/matchOrder/matchOrder?id=${id}`
					});
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
						} else {
							self.getCompetitionList = self.getCompetitionList.concat(res.data.list);
						}
						console.log(res)
						self.hasdata = self.page < res.data.pagination.page_count;
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						console.log(err);
					});
			},
		}
	}
</script>

<style lang="scss">
	.wrap{
		width: 100%;
		background-color: #f7f7f8;
		.wrap-in{
			width: 750rpx - 24 * 2;
			margin: 0 auto;
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
</style>
