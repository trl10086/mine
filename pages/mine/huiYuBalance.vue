<template>
	<view class="wrap">
		<!-- 1. 回鱼收入统计 -->

		<view class="hy-total">
			<view class="item">
				<text>累计垂钓次数</text>
				<text>{{dataList.all_num}}</text>
			</view>
			<view class="item">
				<text>累计回鱼金额</text>
				<text>{{dataList.all_return_fish}}</text>
			</view>
			<view class="item">
				<text>累计垂钓重量</text>
				<text>{{dataList.all_fish_catch}}</text>
			</view>
			<view class="item">
				<text>累计回标总金额</text>
				<text>{{dataList.back_bid_price}}</text>
			</view>
		</view>


		<!-- 2. 回鱼收入列表 -->
		<view class="hy-list">
			<u-table color="#1A1B1D">
				<u-tr>
					<u-th>日期</u-th>
					<u-th>钓场</u-th>
					<u-th>鱼获</u-th>
					<u-th>回鱼收入</u-th>
					
				</u-tr>
				<u-tr v-for="(item,index) in dataList.list" :key="index">
					<u-td>{{item.created_at}}</u-td>
					<u-td>{{item.name}}</u-td>
					<u-td>{{item.fish_catch}}kg</u-td>
					<u-td>{{item.return_fish}}元</u-td>
				</u-tr>
			</u-table>

		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: []
			};
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList(){
				let self = this
				self.$u.api.user_fish_info().then(res=>{
					self.dataList = res.data
				})
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

		}

		.hy-total {
			display: flex;
			flex: 1;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
			padding: 0 24rpx;
			height: 172rpx;

			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				font-size: 27rpx;
				color: #1A1B1D;

				>text:first-child {
					margin-bottom: 18rpx;

				}
			}
		}

		.hy-list {
			// border: 1px solid red;
			margin-top: 20rpx;
		}


	}
</style>
