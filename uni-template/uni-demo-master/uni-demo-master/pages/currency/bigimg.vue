<template>
	<view class="app">
		<u-swiper :list="banner" :height="height" img-mode="aspectFit"></u-swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				banner: [],
				height: 0
			}
		},
		onLoad(e) {
			var that = this
			var data = JSON.parse(e.list); // 字符串转对象
			this.banner = data
			uni.getSystemInfo({
				success: function(e) {
					console.log(e)
					that.height = (e.windowHeight - e.statusBarHeight) * 2;
					console.log(that.height)
				}
			})
		},
		methods: {

		}
	}
</script>

<style>
	.app {
		width: 100%;
		height: 100%;
		
	}
</style>
