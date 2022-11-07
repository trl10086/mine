<template>
	<view>
		<view class="mainRow mh32 mainAlignCenter mt24">
			<u-image class="fcenter mt21 iconAvt" width="140" height="140"
				src="https://cdn.uviewui.com/uview/swiper/1.jpg" shape="circle"></u-image>
			<view>
				<view class="ml16 black text36 textwbold">登陆/注册</view>
				<view class="bgSound mainRow sound  mainAlignCenter  ml16 mt10">
					<image class="img19 mr32 ml10" src="../../static/logo.png" mode="aspectFill"></image>
					<view class="text12 white">33S</view>
				</view>
			</view>
		</view>
		<view class="pDetails circle text_center ml32 mt32 textwbold">
			个人简介
		</view>
		<view class="mh32 colorB1 text24 mt10">{{detail}}</view>
		<view class="pDetails circle text_center ml32 mt32 textwbold">
			个人图片展示
		</view>
		<u-grid :col="3" :border="isborder">
			<u-grid-item @click="imgClick(index)" v-for="(item ,index)  in data2" :custom-style="custom">
				<u-image class="fcenter mt21 iconAvt" width="200" height="200" :src="item.image"></u-image>
			</u-grid-item>
		</u-grid>
		<view class="pDetails circle text_center ml32 mt32 textwbold">
			个人视频展示
		</view>
		<video class="video fcenter mh32 mt10" :autoplay="false" show-fullscreen-btn :src="video" :controls="true"
			direction="0" @timeupdate='timeupdate'></video>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isborder: false,
				data2: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					}, {
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					}, {
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					}, {
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
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
				custom: {
					padding: '0rpx 0'
				},
				detail: '但求日积月累，收货于细微，不要左顾右盼专注于自我',
				video: 'http://domhttp.kksmg.com/2019/07/20/h264_450k_mp4_SHNews15000002019072032738822091_aac.mp4'
			}
		},
		methods: {
			imgClick(index) {
				console.log(index)
				uni.navigateTo({
					url:'../currency/bigimg?list='+encodeURIComponent(JSON.stringify(this.data2))
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sound {
		width: 160rpx;
		height: 32rpx;
	}

	.pDetails {
		width: 216rpx;
		height: 50rpx;
	}

	.video {
		width: 687rpx;
		height: 387rpx;
	}
</style>
