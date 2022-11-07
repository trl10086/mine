<template>
	<view class="wrap" :style="[style]">
		<view v-if="PondList.length == 0 ? true : false" :style="[style]" style="display: flex;justify-content: center;align-items: center;">
			<view class="sprint">
				<image src="../../static/images/b1.png" mode="" class="competition"></image>
				<view class="inscription">暂无比赛预约</view>
			</view>
		</view>
		<view class="wrap-in" v-else>
			<!-- 1. 头图 -->
			<u-image :src="fishPond[0].url" width="100%" height="316rpx" border-radius="8"></u-image>
			<!-- 鱼塘 -->
			<view class="card">
				<view class="item" v-for="(item, index) in PondList" :key="item">
					<u-image width="240" height="240" border-radius="8" :src="item.imgs[0].url"></u-image>
					<view class="info">
						<view class="title">{{ item.fishPond.name }}</view>
						<view class="short-title">{{ item.fishPond.details }}</view>
						<view class="price-bt">
							价格：
							<text class="price">{{ item.price }}元</text>
						</view>
						<view class="tags">
							<view class="tag" @click="hotingHandler(item.match_id, item.id, item.fishPond.id, item.is_activity, item.status, index, item.updated_at)">
								{{ item.status == 2 ? '往期排行' : '火热进行' }}
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
			PondList: [],
			fishPond: [],
			picture: {},
			s_id: '', //上页传的数据
			talent: '', //判断活动是否结束
			style: { height: '' },
			style_A: {
				textAlign: 'center',
				lineHeight: '',
				fontSize: '86rpx'
			}
		};
	},
	onReady() {
		let self = this;
		uni.getSystemInfo({
			success: function(res) {
				self.style.height = res.windowHeight + 'px';
				self.style_A.lineHeight = res.windowHeight + 'px';
				console.log(4512154, self.style.height);
			}
		});
	},
	onLoad(res) {
		this.s_id = res.id;
	},
	onShow() {
		this.activityList();
	},
	methods: {
		//活动报名列表API
		activityList() {
			this.$u.api2
				.getActivity({
					id: this.s_id,
					page: 1,
					limit: 10
				})
				.then(res => {
					this.PondList = res.data.list;
					this.fishPond = JSON.parse(res.data.list[0].match[0].pic_url);
					for (var i = 0; i < this.PondList.length; i++) {
						this.PondList[i].imgs = JSON.parse(this.PondList[i].fishPond.pic_url);
					}
					this.match_id = res.data.list[0].match_id;
					console.log(this.PondList);
				})
				.catch(err => {
					console.log(15412, this.PondList);
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
		hotingHandler(match_id, activity_id, fish_pond_id, is_activity, status, index, updated_at) {
			let self = this;
			console.log(updated_at);
			if (this.sLogin()) {
				return;
			}
			switch (Number(status)) {
				case 0:
					if (is_activity == 1) {
						uni.showToast({
							title: '您已经参加活动',
							icon: 'none',
							duration: 2000
						});
						return false;
					}
					console.log(111, is_activity);
					uni.navigateTo({
						url: './activityDetail' + `?match_id=${match_id}&activity_id=${activity_id}&fish_pond_id=${fish_pond_id}&s_id=${this.s_id}&index=${index}`
					});
					break;
				case 1:
					if (is_activity == 1) {
						uni.showToast({
							title: '您已经参加活动',
							icon: 'none',
							duration: 2000
						});
						return false;
					} else {
						uni.showToast({
							title: '活动正在进行时',
							icon: 'none',
							duration: 2000
						});
					}

				case 2:
					self.$u.api2
						.getPreviousRanking({
							match_id,
							activity_id,
							fish_pond_id
						})
						.then(res => {
							self.talent = res.data.length;
							console.log(res, self.talent);
							if (Number(self.talent) != 0) {
								uni.navigateTo({
									// url: './activityDetail' + `?match_id=${match_id}&activity_id=${activity_id}&fish_pond_id=${fish_pond_id}&s_id=${this.s_id}`
									url: `./oldRank?match_id=${match_id}&activity_id=${activity_id}&fish_pond_id=${fish_pond_id}&updated_at=${updated_at}`
								});
							} else {
								uni.showToast({
									title: '暂无排行',
									icon: 'none',
									duration: 2000
								});
							}
						});
					break;
			}
		},

		oldRankHandler() {
			uni.navigateTo({
				url: './oldRank'
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f7f7f8;
}
.inscription{
	color: #1A1B1D;
	font-size: 48rpx;
	margin-top: 42rpx;
}
.sprint{
	    display: flex;
		flex-flow: column;
		 align-items: center;
	
}
.competition{
	width: 188rpx;
	height: 188rpx;
}
.wrap {
	width: 100%;
	background-color: #f7f7f8;

	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;
	}
}

.card {
	border-radius: 16rpx;
	padding: 36rpx 20rpx;
	background-color: #fff;
	margin-top: 16rpx;

	.item {
		width: 100%;
		display: flex;
		background-color: #fff;

		.info {
			flex: 1;
			padding-left: 26rpx;

			.title {
				font-size: 30rpx;
				color: #1a1b1d;
				font-weight: 500;
			}

			.short-title {
				font-size: 22rpx;
				color: #727272;
				line-height: 36rpx;
			}

			.price-bt {
				font-size: 28rpx;
				color: #1a1b1d;
				font-weight: 500;
			}

			.price {
				font-size: 36rpx;
				color: #f38b11;
				line-height: 64rpx;
			}

			.tags {
				display: flex;
				justify-content: flex-end;

				.tag {
					height: 56rpx;
					padding: 0 46rpx;
					line-height: 56rpx;
					text-align: center;
					border-radius: 28rpx;
					background-color: #5d7291;
					color: #fff;
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
