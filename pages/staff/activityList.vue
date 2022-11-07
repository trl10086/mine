<template>
	<view class="wrap">
		<view v-if="activityList.length==0?true:false">暂无活动</view>
		<view v-else class="wrap-in">
			<u-image :src="activityList[0].url[0].url" width="100%" height="316rpx" border-radius="8"></u-image>

			<view class="card" v-for="(item,index) in activityList" :key="k.id">
				<view class="item">
					<u-image
						width="240"
						height="240"
						border-radius="8"
						:src="activityList[index].url[0].url"
					></u-image>
					<view class="info">
						<view class="title">{{item.match[0].match_name}}</view>
						<view class="short-title">{{item.match[0].match_detail}}</view>
						<view class="price-bt">
							价格：
							<text class="price">{{item.price}}元</text>
						</view>
						<view class="tags"><view class="tag" @click="hotingHandler(Number(item.id),Number(item.status))">查看人数</view></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	methods: {
		hotingHandler(id,status) {
			uni.navigateTo({
				url: `./userList?id=${id}&status=${status}`
			});
		},
		//活动列表API
		activity() {
			this.$u.api2
				.getActivity({ id: this.s_id, page: 1, limit: 10 })
				.then(res => {
					this.activityList = res.data.list;
					this.activityList.forEach((k, index) => (this.activityList[index].url = JSON.parse(this.activityList[index].match[0].pic_url)));
					console.log(this.activityList);
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	onShow() {
		this.activity();
	},
	onLoad(res) {
		this.s_id = res.id;
		console.log(this.s_id);
	},
	data() {
		return {
			activityList: [], //活动列表
			s_id: '' //上个页面传过来的id
		};
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
