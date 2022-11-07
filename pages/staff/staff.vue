<template>
	<view class="wrap">
		<view class=" wrap-in">
			<view class="card">
				<navigator url="./userOrderList">
					<view class="item">
						<u-badge class="badge" :count="datalist.user_order_num" absolute :offset="[0, 0]"></u-badge>
						<u-image width="116rpx" height="116rpx" src="/static/images/user-order.png"></u-image>
						<text>用户订单</text>
					</view>
				</navigator>
				<navigator url="./matchActivity">
					<view class="item">
						<u-badge class="badge" :count="datalist.activity_order_num" absolute :offset="[0, 0]"></u-badge>
						<u-image width="116rpx" height="116rpx" src="/static/images/match-order.png"></u-image>
						<text>比赛订单</text>
					</view>
				</navigator>
			</view>

			<view class="card">
				<navigator url="./ordersForGoods">
					<view class="item">
						<u-badge class="badge" :count="datalist.goods_order_num" absolute :offset="[0, 0]"></u-badge>
						<u-image width="116rpx" height="116rpx" src="/static/images/shop-order.png"></u-image>
						<text>商品订单</text>
					</view>
				</navigator>
				<navigator url="./messageList">
					<view class="item">
						<u-badge class="badge" :count="datalist.leave_message_num" absolute :offset="[0, 0]"></u-badge>
						<u-image width="116rpx" height="116rpx" src="/static/images/message-list.png"></u-image>
						<text>留言列表</text>
					</view>
				</navigator>
			</view>
			<view class="card">
				<navigator url="./orderManagement">
					<view class="item">
						
						<u-image width="116rpx" height="116rpx" src="/static/images/md1.png"></u-image>
						<text>订单管理</text>
					</view>
				</navigator>
				<navigator url="./couponCenter">
					<view class="item">
						<u-image width="116rpx" height="116rpx" src="/static/images/md4.png"></u-image>
						<text>优惠劵中心</text>
					</view>
				</navigator>
			</view>
			<view class="card">
				<navigator url="./fishPondCenter">
					<view class="item">
						<u-image width="116rpx" height="116rpx" src="/static/images/md3.png"></u-image>
						<text>鱼塘数据中心</text>
					</view>
				</navigator>
				<navigator url="./shopCentralManagement">
					<view class="item">
						<u-image width="116rpx" height="116rpx" src="/static/images/md2.png"></u-image>
						<text>商城收益中心</text>
					</view>
				</navigator>
			</view>
		</view>
		<view class="bottomNavigation">
			<view class="fhis-btn" @click="$u.route('/pages/staff/releaseFish')">
				<!-- <view class="btn">+</view> -->
				<view class="fish-add">
					<u-image src="/static/images/md5.png" width="88rpx" height="88rpx"></u-image>
					<text class="black text28">今日放鱼</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			datalist: ''
		};
	},
	onShow() {
		this.getList();
	},
	methods: {
		getList() {
			let self = this;
			self.$u.api.get_order_num_list().then(res => {
				self.datalist = res.list;
			});
		}
	}
};
</script>

<style lang="scss">
.bottomNavigation {
	position: fixed;
	bottom: 0;
	/* margin: 0 auto; */
	width: 100%;
	height: 98rpx;
	background-color: #fff;
	.fhis-btn {
		.fish-add {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: absolute;
			left: 50%;
			top: -44rpx;
			transform: translate(-50%);
		}
	}
}
page {
	background-color: #f7f7f8;
}

.wrap {
	width: 100%;
	background-color: #f7f7f8;

	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;

		.card {
			margin-top: 28rpx;
			height: 244rpx;
			border-radius: 12rpx;

			background-color: #fff;
			display: flex;
			justify-content: space-around;

			.item {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-top: 38rpx;
				.badge {
					background-color: red;
					color: white;
				}
				text {
					margin-top: 10rpx;
				}
			}
		}
	}
}
</style>
