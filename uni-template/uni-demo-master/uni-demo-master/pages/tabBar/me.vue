<template>
	<view>
		<view class="mainRow mh32 mainAlignCenter mt24">
			<u-image class="fcenter mt21 iconAvt" width="140" height="140"
				src="https://cdn.uviewui.com/uview/swiper/1.jpg" shape="circle"></u-image>
			<view class="ml16 colorA6 text26">登陆/注册</view>
		</view>
		<view class="mainRow mh32 mainAlignCenter mt24">
			<view class="flex mainColumn mainAlignCenter">
				<view class="colorA6 text24">0</view>
				<view class="colorA6 text24">关注</view>
			</view>
			<view class="flex mainColumn mainAlignCenter">
				<view class="colorA6 text24">0</view>
				<view class="colorA6 text24">粉丝</view>
			</view>
			<view class="flex mainColumn mainAlignCenter">
				<view class="colorA6 text24">0</view>
				<view class="colorA6 text24">积分</view>
			</view>
		</view>
		<u-cell-group class="mt32">
			<u-cell-item @click="clcik(1)" title="我的个人宣言" :arrow="true"></u-cell-item>
			<u-cell-item @click="clcik(2)" title="我的项目" :arrow="true"></u-cell-item>
			<u-cell-item @click="clcik(3)" title="我的客服" :arrow="true"></u-cell-item>
			<u-cell-item @click="clcik(4)" title="我的收藏" :arrow="true"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onTabItemTap(e) {
			// tab 点击时执行，此处直接接收单击事件
			console.log("544")
		},
		methods: {
			clcik(index) {
				switch (index) {
					case 1:
						uni.navigateTo({
							url: '../my/persionDetail'
						})
						break
					case 2:

						break
					case 3:

						break
					case 4:

						break
				}
			}
		}
	}
</script>

<style>

</style>
