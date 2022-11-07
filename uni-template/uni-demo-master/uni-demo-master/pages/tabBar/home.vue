<template>
	<view>
		<u-toast ref="uToast" />
		<!-- 轮播图 -->
		<view class="mh32 mt21">
			<u-swiper :list="banner" height="300"></u-swiper>
		</view>
		<view class="mainRow mh32 mainRight mt24">
			<view class="color82 ">更多</view>
			<img class="imgright ml5 " src="../../static/jinru.png">
		</view>
		<view class="mainRow mt10 ml32">
			<view class="mainHItem mr16 mainColumn" v-for="(item) in banner">
				<u-image class="fcenter mt21 iconAvt" width="103" height="103"
					src="https://cdn.uviewui.com/uview/swiper/1.jpg" shape="circle"></u-image>
				<view class="text30 white fcenter mt21 textw600">杨小兰</view>
			</view>
		</view>

		<view class="mainRow mh32 mainRight mt24">
			<view>更多</view>
			<img class="imgright ml5 " src="../../static/jinru.png">
		</view>
		<view class="mainRow mt10 ml32">
			<view class="mainHItem1 mr16 mainColumn" v-for="(item) in data2">
				<u-image class="fcenter mt21" width="330" height="271" src="https://cdn.uviewui.com/uview/swiper/1.jpg">
				</u-image>
				<view class="text26 color82  mt21 textw600">刷卡POS机消费</view>
				<view class="text24 color82  mt21 textw600">陈俊豪 2021.4.31</view>
			</view>
		</view>

		<view class="mainRow mh32 mainRight mt24">
			<view>更多</view>
			<img class="imgright ml5 " src="../../static/jinru.png">
		</view>
		<view class="mainColumn mt10 ml32">
			<view class="mainHItem2 mr16 mainColumn mt10" v-for="(item) in data2">
				<u-image class="fcenter mt21" width="686" height="271" src="https://cdn.uviewui.com/uview/swiper/1.jpg">
				</u-image>
				<view class="text26 color82  mt21 textw600">刷卡POS机消费</view>
				<view class="text24 color82  mt21 textw600">陈俊豪 2021.4.31</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				banner: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
				data1: [],
				data2: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					}
				],
				list3: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					}
				],
				page: 1,
				size: 10,
				hasdata: true,
				list: []
			}
		},
		onTabItemTap(e) {
			// tab 点击时执行，此处直接接收单击事件
			console.log("54411")
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
				this.hasdata = true
				this.getList()
			},
			async getList() {
				const res = await this.$myRequest({
					url: this.$appUrl.main.list,
					data: {
						page: this.page,
						size: this.size,
					}
				})
				console.log(res)
				uni.stopPullDownRefresh()
				if (res.code == 0) {
					this.list = this.list.concat(res.data)
					if (res.data.length < this.size) {
						this.hasdata = false
					}
				} else {
					this.$refs.uToast.show({
						title: res.msg,
						type: 'error'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.mainHItem {
		width: 160rpx;
		height: 240rpx;
		background: #FF332D;
		border-radius: 10rpx;
	}

	.mainHItem1 {
		width: 328rpx;
		height: 410rpx;
		border-radius: 7rpx;
		-moz-box-shadow: 0 5rpx 5rpx #ebe5e8;
		-webkit-box-shadow: 0 5rpx 5rpx #ebe5e8;
		box-shadow: 0 5rpx 5rpx #ebe5e8;
	}
	
	.mainHItem2 {
		width: 686rpx;
		height: 420rpx;
		border-radius: 7rpx;
		-moz-box-shadow: 0 5rpx 5rpx #ebe5e8;
		-webkit-box-shadow: 0 5rpx 5rpx #ebe5e8;
		box-shadow: 0 5rpx 5rpx #ebe5e8;
	}
</style>
