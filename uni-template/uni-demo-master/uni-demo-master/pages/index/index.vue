<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">1</text>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				size: 10,
				hasdata: false,
				list: [],
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			
			//用户上拉触底事件
			onReachBottom() {
				if (!this.hasdata) {
					return
				}
				this.page++
				this.getList()
			},
			onPullDownRefresh() {
				this.list = []
				this.page = 1
				this.getList()
			},
			getList() {
				var self = this;
				this.$u.api.getBooksList({
					size: 10,
					page: self.page,
					type:'1',
				}).then(res => {
					self.list = res.list;
					self.hasdata = self.page < res.p_num;
					uni.stopPullDownRefresh()
				}).catch(err => {
					this.$refs.uToast.show({
						title: err.msg,
						type: 'error'
					})
					uni.stopPullDownRefresh()
				})
				
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
