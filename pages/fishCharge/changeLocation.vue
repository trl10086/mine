<template>
	<view class="wrap">
		<!-- 1. 头图 -->
		<u-image :src="incoming_data.pic_url[0].url" width="100%" height="300rpx"></u-image>

		<view class="wrap-in">
			<view class="card">
				<view class="title">{{ incoming_data.name }}</view>
				<view class="descp">{{ incoming_data.details }}</view>
				<view class="price">
					<text class="bt">价格：</text>
					<text class="number">{{ incoming_data.price }}元</text>
				</view>
				<view class="time">
					<view class="active">今日钓鱼{{ incoming_data.fish_time }}个钟</view>
				</view>
			</view>
			<view class="selection">
				<view class="title">选择你的钓位</view>
				<view class="numbers">
					<!-- 动态钓鱼位使用这个 -->
					<view
						:class="[n.status == 0 ? (judge == n.seat_id ? 'item selected' : 'item') : 'item active']"
						v-for="(n, index) in seat_list"
						@click="point_position(n.seat_id, index, n.fish_pond_id)"
						:key="n.seat_id"
						:id="n.id"
					>
						{{ n.seat_id }}
					</view>
				</view>
				<view class="markup">
					<view class="select">
						<view></view>
						<text>白色可选</text>
					</view>
					<view class="no-select">
						<view></view>
						<text>红色不可选</text>
					</view>
				</view>
			</view>
			<view class="footer">
				<view class="selected">
					已选：
					<text class="number">{{ selected }}</text>
					号位
				</view>
				<button @click="confirm(judge, pond, sentence)" class="sub">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			judge: '-1', //选位判断
			selected: '0', //已选判断

			cut_mark: true, //点击切换钓鱼钟的颜色
			pond: '', //池塘id
			incoming_data: {}, //鱼塘详情后端数据API
			seat_list: [], //后台钓位列表API
			sentence: ''
		};
	},
	onLoad(res) {
		if(this.$u.test.isEmpty(res.scene)) {
			let cr_id = res.id;
			this.sentence = res.sentence;
			this.reservoirDetails(cr_id);
		} else {
			let id = decodeURIComponent(res.scene).split('=')[1];
			this.reservoirDetails(id);
		}
		
	},

	methods: {
		//点击确认
		confirm(id, k, sentence) {
			console.log(sentence);
			if (sentence == -2) {
				if (k != '') {
					this.$u.api2
						.getExchange({
							fish_pond_id: this.pond,
							fish_pond_new_seat_id: this.judge
						})
						.then(res => {
							uni.showModal({
								title: '成功换位',
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										uni.navigateBack({
											delta: 1
										});
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						})
						.catch(err => {
							uni.showToast({
								title: '无订单',
								duration: 2000,
								icon: 'none'
							});
						});
				} else {
					uni.showToast({
						title: '请选择钓位',
						duration: 2000,
						icon: 'none'
					});
				}
				console.log(this.judge);
			} else {
				if (k != '') {
					uni.navigateTo({
						url: './orderCharge' + `?id=${id}&fish=${k}`
					});
				} else {
					uni.showToast({
						title: '请选择钓位',
						duration: 2000,
						icon: 'none'
					});
				}
			}
		},
		//点击选择钓位
		point_position(id, index, fish) {
			if (this.seat_list[index].status == 1) {
				return;
			}
			this.pond = fish;
			this.judge = id;
			this.selected = id ;
		},
		//鱼塘详情API
		reservoirDetails(id) {
			this.$u.api2
				.getReservoirDetails({ id: id })
				.then(res => {
					this.incoming_data = res.data.detail;
					this.seat_list = res.data.seat_list;
					console.log(542,this.seat_list);
				})
				.catch(err => {
					console.log(err);
				});
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

	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;

		.card {
			background-color: #ffff;                                                 
			margin-bottom: 30rpx;
			padding: 22rpx 20rpx;
			margin-top: 16rpx;
			border-radius: 16rpx;

			.title {
				font-size: 40rpx;
				font-size: 500;
				color: #1a1b1d;
				line-height: 44rpx;
				margin-top: 38rpx;
				margin-bottom: 20rpx;
			}

			.descp {
				font-size: 28rpx;
				line-height: 36rpx;
				color: #525252;
				margin-bottom: 22rpx;
			}

			.price {
				font-size: 28rpx;
				color: #1a1b1d;
				margin-bottom: 52rpx;

				.bt {
					font-size: 28rpx;
					font-weight: 500;
					color: #1a1b1d;
				}

				.number {
					font-size: 36rpx;
					color: #f38b10;
				}
			}

			.time {
				display: flex;

				view {
					background-color: #f1f1f1;
					padding: 0 26rpx;
					height: 62rpx;
					line-height: 62rpx;
					border-radius: 4rpx;

					&:first-child {
						margin-right: 24rpx;
					}

					&.active {
						background-color: #5d7291;
						color: #fff;
					}
				}
			}
		}

		.selection {
			margin-bottom: 54rpx;
			.title {
				border-left: #5d7291 solid 10rpx;
				padding-left: 12rpx;
				color: #31425b;
				font-size: 28rpx;
				margin-bottom: 20rpx;
			}

			.numbers {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;

				.item {
					width: 70rpx;
					height: 70rpx;
					line-height: 60rpx;
					text-align: center;
					border-radius: 8rpx;
					background-color: #fff;
					margin: 5rpx;
					color: #30415b;
					font-size: 28rpx;

					&.active {
						background-color: #ce1b22;
						color: #fff;
					}

					&.selected {
						background: url(../../static/images/check-icon.png) no-repeat center #fff;
						background-size: 32rpx 21rpx;
						text-indent: -9999999em;
						overflow: hidden;
					}
				}
			}

			.markup {
				display: flex;

				.select {
					display: flex;
					align-items: center;
					margin-right: 40rpx;

					> view {
						width: 20rpx;
						height: 20rpx;
						background-color: #fff;
						margin-right: 20rpx;
					}
				}

				.no-select {
					display: flex;
					align-items: center;

					> view {
						width: 20rpx;
						height: 20rpx;
						background-color: #ce1b22;
						margin-right: 20rpx;
					}
				}
			}
		}

		.footer {
			display: flex;
			height: 100rpx;
			line-height: 100rpx;
			align-items: center;
			font-size: 28rpx;

			.selected {
				background-color: red;
				background: url(../../static/images/selected-icon.png) no-repeat left center #f7f7f8;
				background-size: 36rpx 36rpx;
				padding-left: 40rpx;
			}

			.number {
				font-size: 36rpx;
				color: #30415b;
				font-weight: 600;
			}

			.sub {
				width: 432rpx;
				height: 72rpx;
				line-height: 72rpx;
				border-radius: 32rpx;
				background-color: #282828;
				color: #fff;
				margin-right: 0;
			}
		}
	}
}
</style>
