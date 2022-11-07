<template>
	<view class="wrap">
		<view class="wrap-in">
			<view class="card">
				<view class="item" @click="goshop(item)" v-for="item in dataList" :key="item.id">
					<u-image width="188" height="188" border-radius="8"
						:src="item.cover_pic"
						mode=""></u-image>
					<view class="info">
						<view class="title">{{item.name}}</view>
						<view class="price"><text class="bt">¥</text><text class="number">{{item.price}}元</text></view>
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
				page: 1,
				hasdata: false,
				dataList: []
			};
		},
		onLoad() {
			this.getList()
		},
		methods:{
			goshop(item){
				uni.navigateTo({
					url: '../shop/detail?id=' + item.id
				})
			},
			getList(){
				let self = this
				self.$u.api.shopGoods({
					page:self.page
				}).then(res=>{
					if(self.page == 1){
						self.dataList = []
						self.dataList = res.data
					}else{
						self.dataList = self.dataList.concat(res.data.list); 
					}
					self.hasdata = self.page < res.all_page_num;
					uni.stopPullDownRefresh();
				})
			},
			// 下拉刷新
			onPullDownRefresh() {
			 this.dataList = [];
			 this.page = 1;
			 this.hasdata = false
			 this.getList();
			},
			// 上拉加载
			onReachBottom() {
			 if (!this.hasdata) {
			  return ;
			 }
			 this.page++
			 this.getList();
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

			.card {
				margin-top: 16rpx;

				.item {
					width: 100%;
					display: flex;
					background-color: #fff;
					padding: 16rpx 44rpx;
					margin-bottom: 16rpx;
					border-radius: 8rpx;

					.info {
						flex: 1;
						padding-left: 62rpx;

						.title {
							font-size: 32rpx;
							color: #1A1B1D;
							line-height: 44rpx;
							margin-bottom: 40rpx;
						}

						.price {
							color: #F38B10;

							.bt {
								font-size: 24rpx;
							}

							.number {
								font-size: 32rpx;

							}

						}



					}
				}
			}
		}

	}
</style>
