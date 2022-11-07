<template>
	<view class="wrap">
		<view class="wrap-in">
			<view class="title">
				{{chtml.title}}
			</view>
			<u-parse :html="chtml.content"></u-parse>
			<!-- <view class="infos">
				本应用亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。任何本应用平台用户如从事上述活动，一经发现，本应用有权立即终止与该用户的服务协议。
			</view>
			<view class="infos">
				本应用收集的有关您的信息和资料将保存在本应用及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或本应用收集信息和资料所在地的境外并在境外被访问、存储和展示。
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chtml: '',
			};
		},
		onLoad() {
			this.agreement()
		},
		methods:{
			agreement(){
				let self = this
				self.$u.api.agreement().then(res=>{
					self.chtml = res.data
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.wrap {
		width: 100%;
		background-color: #fff;

		.wrap-in {
			width: 750rpx - 24*2;
			margin: 0 auto;

			.title{
				text-align: center;
				line-height: 100rpx;
				font-size: 36rpx;
				color: #1A1B1D;
				line-height: 44rpx;
				padding-top: 72rpx;
				padding-bottom: 40rpx;
				
			}
			.infos{
				font-size: 28rpx;
				line-height: 44rpx;
				color: #4A4A4A;
				text-indent: 2em;
				margin-bottom: 20rpx;
			}
		}

	}
</style>
