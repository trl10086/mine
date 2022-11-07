<template>
	<view class="husband">
		<view class="wall">
			<image class="seat" src="../../static/images/paihang.png" mode=""></image>
			<view class="head">
				<view class="writing">天鲤钓场比赛</view>
				<view class="packing">往期活动排行榜</view>
				<view class="standard"><view class="dyestuff">活动时间：2021-11-12</view></view>
			</view>
			<view class="middle mh32">
				<view class="hero" v-for="(item,index) in rankingList" :key='item.id' v-if="index<9?true:false">
					<view class="adult">
						<view class="pag">
							<image  v-if="index<=3" class="pag_pic" :src="`../../static/images/pm${index+1}.png`" mode=""></image>
							<image v-else class="pag_pic" :src="`../../static/images/pm4.png`" mode=""></image>
							<view class="punctuate">{{index+1}}</view>
						</view>
						<view class="prince">
							<image class="pic" :src="item.userInfo.avatar" mode=""></image>
							<view class="sage">{{item.name}}</view>
						</view>
					</view>

					<view class="bearing text24">重量：{{item.weight}}/斤</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			rankingList:[]
		};
	},
	onLoad() {
		this.ranking();
	},
	methods: {
		//排行榜API
		ranking() {
			let self = this;
			this.$u.api2
				.getRanking({ page: 1, limit: 10 })
				.then(res => {
					self.rankingList=res.data.list
					console.log(res.data.list);
				})
				.catch(err => console.log(err));
		}
	}
};
</script>

<style lang="scss">
.wall {
	width: 100%;
	height: 100%;
	position: relative;
	.seat {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -2;
	}
	.head {
		padding-top: 38rpx;
		text-align: center;
		.writing {
			font-size: 72rpx;
			margin-bottom: 28rpx;
			background: linear-gradient(180deg, #fce6cf 100%, #fde9d1 100%, #cbb4a4 0%);
			-webkit-background-clip: text;
			color: transparent;
			font-family: 'PingFang SC-Bold';
			font-weight: bold;
		}
		.packing {
			font-size: 40rpx;
			margin-bottom: 40rpx;
			font-family: 'PingFang SC-Bold';
			background: linear-gradient(180deg, #fce6cf 100%, #fde9d1 100%, #cbb4a4 0%);
			-webkit-background-clip: text;
			color: transparent;
			font-weight: Regular;
		}
		.standard {
			text-align: center;
			line-height: 68rpx;
			margin: 0 auto;
			width: 454rpx;
			height: 68rpx;
			border-radius: 8rpx;
			background-color: rgba(255, 236, 216, 0.23999999463558197);
			margin-bottom: 123rpx;
			.dyestuff {
				background: linear-gradient(180deg, #fce6cf 100%, #fde9d1 100%, #cbb4a4 0%);
				-webkit-background-clip: text;
				color: transparent;
			}
		}
	}
	.middle {
		background-color: #ffffff;
		border-radius: 16rpx;
		height: 1262rpx;

		.hero {
			padding-bottom: 18rpx;
			border-bottom: 1rpx solid #e6e6e6;
			padding-top: 32rpx;
			margin-left: 20rpx;
			margin-right: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.adult {
				display: flex;
				align-items: center;
			}
			.pag {
				width: 60rpx;
				height: 60rpx;
				text-align: center;
				line-height: 60rpx;
				position: relative;
				.pag_pic {
					width: 60rpx;
					height: 60rpx;

					left: 10rpx;
				}
				.punctuate {
					position: absolute;
					color: #ffffff;
					font-size: 36rpx;

					top: 0%;
					left: 30%;
				}
			}
			.prince {
				margin-left: 56rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.sage {
				margin-left: 20rpx;
				font-size: 32rpx;
				color: #01174a;
				font-family: PingFang SC-Medium;
				font-weight: Medium;
			}
			.pic {
				width: 88rpx;
				height: 88rpx;
			}
			.bearing {
				width: 180rpx;
				height: 48rpx;
				border-radius: 8rpx;
				background-color: #333333;
				color: #f1f1f1;
				text-align: center;
				line-height: 48rpx;
			}
		}
	}
}
</style>
