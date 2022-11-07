<template>
	<view class="wrap">
		<view class="wrap-in">
			<view class="card" v-for="(item,index) in dataList" :key="index" @click="getShop(item)">
				<view class="left">
					<view class="fish-info">
						<view class="location">{{item.name}}</view>
						<view class="number">{{item.seat_id}}号钓位</view>
					</view>
					<view class="nickname">{{item.fish_order.nickname}}</view>
					<view class="tel">{{item.fish_order.mobile}}</view>
				</view>
				<view class="right">
					<view class="icon" v-if="item.status_content[0] != '空置'"><text>></text></view>
					<view class="tags">
						<u-tag v-if="item.fish_order.is_pay == 0 && item.status_content[0] != '待确认收款'" class="ml5" text="未付款" :show="true" mode="dark"
							bg-color="#FD4C00"></u-tag>
						<u-tag v-if="item.status_content[0] == '进行中'" class="ml5" text="进行中" mode="dark"
							bg-color="#68A4FD"></u-tag>
						<u-tag v-if="item.status_content[0] == '空置'" class="ml5" text="空置" mode="dark"
							bg-color="#F38B10"></u-tag>
						<u-tag v-if="item.status_content[0] == '超时'" class="ml5" text="超时" mode="dark"
							bg-color="#FF6929"></u-tag>
						<u-tag v-if="item.status_content[0] == '待确认收款'" class="ml5" text="待确认收款" :show="true" mode="dark"
							bg-color="#FD4C00"></u-tag>
					</view>
					<view class="text20" :class="{colorFF6 : item.status_content[0] == '超时'}" v-if="item.status != 0">
						截止时间：{{item.fish_order.end_time}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				//鱼塘id
				id: '',
			};
		},
		onLoad(e) {
			this.id = e.id
		},
		onShow() {
			this.getList(this.id)
		},
		methods: {
			getList(id) {
				let self = this
				self.$u.api.get_order_list({
					fish_pond_id: id
				}).then(res => {
					self.dataList = res.data
					console.log(6542,res)
				})
			},
			getShop(item) {
				if (item.status_content[0] != '空置') {
					const data = {}
					data.fish_pond_id = this.id
					data.fish_pond_seat_id = item.seat_id
					data.user_id = item.fish_order.user_id
					uni.navigateTo({
						url: './shopOrder?data=' + JSON.stringify(data)
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f8;
	}

	.colorFF6 {
		color: #FF6929;
	}

	.ml5 {
		margin-left: 5rpx;
	}

	.wrap {
		width: 100%;
		background-color: #f7f7f8;

		.wrap-in {
			width: 750rpx - 24*2;
			margin: 0 auto;

			.card {
				background-color: #fff;
				height: 162rpx;

				border-radius: 12rpx;
				padding: 16rpx 22rpx;
				margin-bottom: 12rpx;

				display: flex;
				justify-content: space-between;


				.left {
					display: flex;
					flex-direction: column;
					justify-content: center;

					.fish-info {
						display: flex;
						align-items: center;
						margin-bottom: 12rpx;

						.location {
							font-size: 36rpx;
							color: #1A1B1D;
							margin-right: 4rpx;
						}

						.number {
							font-size: 24rpx;
							color: #362C2C;

						}

					}

					.nickname {
						font-size: 28rpx;
						color: #362C2C;
						margin-bottom: 4rpx;

					}

					.tel {
						font-size: 24rpx;
						color: #626262;

					}

				}

				.right {
					display: flex;
					flex-direction: column;
					justify-content: center;

					.icon {
						display: flex;
						justify-content: flex-end;
						color: #969998;
						margin-bottom: 20rpx;
					}

					.tags {
						display: flex;
						justify-content: flex-end;
					}


				}

			}
		}
	}
</style>
