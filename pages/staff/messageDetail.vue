<template>
	<view class="wrap">
		<view class="wrap-in">
			<view class="card">
				<text>鱼塘</text>
				<text>{{ name }}</text>
			</view>

			<view class="card">
				<text>钓位</text>
				<text>{{ message.fish_pond_seat_id }}号</text>
			</view>
			<view class="markup">
				<text class="info">留言备注</text>
				<view class="message">{{ message.message }}</view>
			</view>
			<button class="sub" @click="handle(message.id)" type="default">处理</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id:'',//上个页面传过来的id
			message: {},
			name:'',
		};
	},
	onLoad(res) {
		this.id = res.id;
		this.name=res.name
		this.oralMessage(res.id);
	},
	methods: {
		//处理留言API
		handle(id) {
			this.$u.api2
				.getHandle({id:id})
				.then(res => {
					uni.showModal({
					    title: res.msg,
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateBack({
									delta:1
								})
					            console.log('用户点击确定');
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					
				})
				.catch(err => {
					uni.showToast({
					    title: err.msg,
					    duration: 2000,
						icon:'none'
					});
					console.log(err);
				});
		},
		//留言详情API
		oralMessage(id) {
			console.log(id)
			this.$u.api2
				.getOralMessage({ id: id })
				.then(res => {
					this.message = res.data;
					console.log(15421,res.data);
				})
				.catch(err => {
					uni.showToast({
					    title: err.msg,
					    duration: 2000,
						icon:'none'
					});
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
			height: 80rpx;
			line-height: 80rpx;
			padding-left: 18rpx;

			background-color: #fff;

			margin-top: 28rpx;
			margin-bottom: 16rpx;
			border-radius: 12rpx;

			text:first-child {
				font-size: 32rpx;
				color: #151817;
				margin-right: 40rpx;
			}

			text:last-child {
				font-size: 28rpx;
				color: #1a1b1d;
			}
		}

		.markup {
			.info {
				color: #151817;
				font-size: 28rpx;
			}

			.message {
				margin-top: 8rpx;
				height: 638rpx;
				padding: 20rpx;
				color: #362c2c;
				font-size: 24rpx;
				background-color: #fff;
				border-radius: 14rpx;
				line-height: 44rpx;
			}
		}

		.sub {
			margin-top: 60rpx;
			width: 632rpx;
			height: 88rpx;
			border-radius: 44rpx;
			line-height: 88rpx;
			text-align: center;
			background-color: #282828;
			color: #fff;
		}
	}
}
</style>
