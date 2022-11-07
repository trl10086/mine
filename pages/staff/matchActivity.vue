<template>
	<view class="wrap">
		<view class="wrap-in">
			<view class="match-order">
				<view class="card" v-for="(item,index) in getCompetitionList" :key='item.id'>
					<navigator :url="`/pages/staff/activityList?id=${item.id}`" >
						<view class="item">
									<view :class="[match.is_end==1?'end':'']"><u-image width="664" height="316" border-radius="8" :src="item.pic_url[0].url"></u-image></view>
							<view class="title">
								{{item.match_name}}
							</view>
							<view class="info u-line-4">
								{{item.match_detail}} <text class="jzgd">更多</text>
							</view>
							<view class="footer">
								<view><text class="bt">时间：</text><text class="date">{{item.updated_at}}</text></view>
								<view><text class="bt">地点：</text><text class="location">{{item.address}}</text></view>

							</view>
						</view>
					</navigator>

				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			getCompetitionList:[]
			}
		},
		
		onLoad(){
			this.competitionList()
		},
		methods:{
			//比赛预约
		competitionList() {
		  this.$u.api2
		    .getCompetition({ page: 1, limit: 10 })
		    .then((res) => {
		      this.getCompetitionList = res.data.list;
		      console.log(res.data.list);
		    })
		    .catch((err) => {
		      console.log(err);
		    });
		},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f8;
	}

	.wrap {
		width: 100%;
		background-color: #f7f7f8;

		.wrap-in {
			width: 750rpx - 24*2;
			margin: 0 auto;

			.match-order {
				margin-top: 16rpx;

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
								color: #5D7291;
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
