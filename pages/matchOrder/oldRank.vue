<template>
	<view class="wrap" >
		<view class="wrap-in" style="background: url(../../static/images/pm_bg.png) no-repeat top center #01174a;" :style="{height}">
		<view  :style="{height}">
			<view class="header" >
				<view class="title">天鲤钓场比赛</view>
				<view class="old-rank">往期活动排行</view>
				<view class="date">活动时间：{{updated_at}}</view>
			</view>
			<view class="rank-user-list" >
				<view class="item" v-for="(item,index) in dataList " :key='index'>
					<view class="left">
						<view :class='index+1==1?"number first":(index+1==2?"number second":(index+1==3?"number third":"number four"))'>{{index+1}}</view>
						<view class="user-info">
							<view class="avatar">
								<u-image width="88" height="88" shape="circle" :src="item.avatar"></u-image>
							</view>
							<view class="username u-line-1">{{item.nickname}}</view>
						</view>
					</view>
					<view class="total">重量：{{item.all_weight}}/斤</view>
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
			height:'',//屏幕高度
			page: 1,
			hasdata: false,
			dataList: [],
			data:{},
			updated_at:''//活动时间
		};
	},
	onLoad(res) {
		
		// this.obj=JSON.parse(res)
		this.data.match_id=res.match_id
		this.data.activity_id=res.activity_id
		this.data.fish_pond_id=res.fish_pond_id
		this.updated_at=res.updated_at.slice(0,10)
		// console.log(46451,res.updated_at,this.updated_at.slice(0,10))
		this.previousRanking(this.page)
	},
	// 下拉刷新：
	onPullDownRefresh() {
	 this.dataList = [];
	 this.page = 1;
	 this.hasdata = false
	 this.previousRanking(this.page);
	},
	// 上拉加载：
	onReachBottom() {
	 if (!this.hasdata) {
	  return ;
	 }
	 this.page++
	 this.previousRanking(this.page);
	},
	methods: {
		previousRanking(page) {
			let self = this;
			uni.getSystemInfo({
				success: function (res) {
					self.height=res.windowHeight*2+'rpx'
					console.log('屏幕高度',self.height);
				}
			});
			
			self.$u.api2
				.getPreviousRanking(this.data)
				.then(res => {
					 self.dataList = res.data //实际返回数据的字段
					
					console.log(2656,self.dataList);
				})
				.catch(err => {
					uni.showModal({
					    title: err.msg,
					    content: '按确认返回',
						showCancel:false,
					    complete: function (res) {
					        if (res.confirm) {
					            self.back()
					        } 
					    }
					});
					console.log(14745,err);
				});
		},
		back() {
		    //@zxyuns 处理兼容，如果没有上一级界面则返回首页
		    const pages = getCurrentPages();
		    if (pages.length === 2) {
		     uni.navigateBack({
		      delta: 1
		     });
		    } else if (pages.length === 1) {
		     uni.switchTab({
		      url: '/pages/tabBar/home',
		     })
		    } else {
		     uni.navigateBack({
		      delta: 1
		     });
		    }
		   },
	}
};
</script>

<style lang="scss">
.wrap {
	width: 100%;
	background-color: #f7f7f8;

	.wrap-in {
		
		background-size: 750rpx 1574rpx;
		.header {
			color: #fce6cf;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-bottom: 78rpx;
			height: 40%;
			.title {
				font-size: 72rpx;
				padding-top: 124rpx;
				padding-bottom: 24rpx;
			}

			.old-rank {
				font-size: 40rpx;
				padding-bottom: 34rpx;
			}

			.date {
				width: 454rpx;
				height: 68rpx;
				line-height: 68rpx;
				text-align: center;
				border-radius: 8rpx;
				background: rgba(255, 236, 216, 0.2);
				font-size: 32rpx;
			}
		}

		.rank-user-list {
			height: 60%;
			background-color: #fff;
			border-radius: 16px 16px 0 0;

			width: 750rpx - 24 * 2;
			margin: 0 auto;

			padding-bottom: 140rpx;

			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #e6e6e6;
				padding-top: 32rpx;
				padding-bottom: 20rpx;

				.left {
					display: flex;
					align-items: center;

					.number {
						margin-right: 56rpx;
						margin-left: 20rpx;
						width: 60rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						font-size: 36rpx;
						color: #fff;
						
					}

					.first {
						background: url(../../static/images/pm1.png) no-repeat center center;
						background-size: 60rpx 60rpx;
					}

					.second {
						background: url(../../static/images/pm2.png) no-repeat center center;
						background-size: 60rpx 60rpx;
					}

					.third {
						background: url(../../static/images/pm3.png) no-repeat center center;
						background-size: 60rpx 60rpx;
					}
					.four{
						background: url(../../static/images/pm4.png) no-repeat center center;
						background-size: 60rpx 60rpx;
					}

					.user-info {
						display: flex;
						align-items: center;

						.avatar {
							margin-right: 20rpx;
						}

						.username {
							width: 242rpx;
							font-size: 32rpx;
							color: #01174a;
						}
					}
				}

				.total {
					height: 48rpx;
					line-height: 48rpx;
					border-radius: 8rpx;
					padding: 0 20rpx;
					background-color: #333333;
					font-size: 24rpx;
					color: #fff;
					margin-right: 20rpx;
				}
			}
		}
	}
}
</style>
