<template>
	<view>
		<view v-if="dataList.length==0?true:false">
		暂无用户拥有优惠卷
		</view>
	<view v-else>
		<view  v-for="item in dataList" :key='item.id'>
			<view class="accessory mh32">
				<view class="figure">
					<u-avatar :src="item.avatar" size="96"></u-avatar>
					<view class="ml16 textCrE">
						<view class="text32">{{item.user_name}}</view>
						<view class="text24">{{item.phone}}</view>
					</view>
				</view>
				<view class="discount" @click="$u.route('/pages/mine/coupon',{user_id:item.id})">
					<u-image width="44rpx" height="36rpx" src="@/static/images/Vector.png"></u-image>
					<view class="mt16 textCrE text24">查看优惠卷</view>
				</view>
			</view>
			<u-line color="#C4C4C4" margin="36rpx 0"></u-line>
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
	// 下拉刷新：
	onPullDownRefresh() {
		this.dataList = [];
		this.page = 1;
		this.hasdata = false;
		// this.getList();
	},
	// 上拉加载：
	onReachBottom() {
		if (!this.hasdata) {
			return;
		}
		this.page++;
		// this.getList();
	},
	onLoad() {
		this.discount();
	},
	methods: {
		discount() {
			let self = this;
			self.$u.api2
				.getDiscount({ page: self.page, limit: 8 })
				.then(res => {
					if (self.page == 1) {
						self.dataList = [];
						self.dataList = res.data.list; //实际返回数据的字段
					}else{
						 self.dataList = self.dataList.concat(res.data.list); //实际返回数据的字段
					}
					self.hasdata = self.page < res.data.pagination.page_count;
					uni.stopPullDownRefresh();
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
};
</script>

<style>
.accessory {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 44rpx;
}
.figure {
	display: flex;
	align-items: center;
}
.discount {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.textCrE {
	color: #1e1e1e;
}
</style>
