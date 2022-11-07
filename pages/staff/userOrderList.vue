<template>
	<view class="wrap">

		<view class="wrap-in">
			<view class="card">
				<navigator :url="'./userOrderDetail?id=' + item.id" v-for="(item,index) in dataList" :key="item.id">
					<view class="item">
						<view class="left">
							<u-image width="240" height="240"
								:src="item.pic_url[0].url">
							</u-image>
						</view>
						<view class="right">
							<view class="title">{{item.name}}</view>
							<view class="short-cut">{{item.details}}</view>
							<view class="price">
								价格：<text class="number">{{item.price}}</text>元
							</view>
						</view>
					</view>
				</navigator>
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
				dataList: [],
			};
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList(){
				let self = this
				self.$u.api2.getPondList({
					page: self.page
				}).then(res=>{
					if (self.page == 1) {
						self.dataList = [];
						self.dataList = res.data.list
					} else {
						self.dataList = self.dataList.concat(res.data.list);
					}
					self.hasdata = self.page < res.data.pagination.page_count;
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
					return;
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
			
			.item {
				display: flex;
				background-color: #fff;
				margin-bottom: 16rpx;
				border-radius: 12rpx;
				
				padding: 34rpx 18rpx 26rpx;
				
				.left {
					margin-right: 26rpx;
				}
			
				.right {
					.title {
						font-size: 32rpx;
						color: #1A1B1D;
						font-weight: 500;
						line-height: 44rpx;
			
					}
			
					.short-cut {
						color: #424242;
						font-size: 24rpx;
						line-height: 36rpx;
						padding-bottom: 24rpx;
			
					}
			
					.price {
						font-size: 28rpx;
			
						.number {
							font-size: 36rpx;
							color: #F38B10;
			
						}
					}
				}
			
			}
			
		}
	}

	
</style>
