<template>
	<view class="Pay-for-fishing">
		<view class="wrap">
			<view class="wrap-in">
				<!-- 开钓付费 -->
				<view class="fish-charge">
					<view class="list">
						<view v-if="index<2?true:false" v-for="(k, index) in PondList" :key="index" @click.stop="page_down(k.id, index,k.is_order)">
							<view class="item" :id="k.id">
								<u-image width="240" height="240" border-radius="8" :src="k.pic_url[0].url" mode=""></u-image>
								<view class="info">
									<view class="title">{{ k.name }}</view>
									<view class="short-cut">{{ k.details }}</view>
									<view class="price">
										<text class="bt">价格：</text>
										<text class="number">{{ k.price }}</text>
									</view>
									<view v-if="k.is_order ==2?true:false"  class="tags" catchtap="son" hover-stop-propagation="true">
										<u-tag text="提前结束" @click="modalHandler(k.id)" type="info" shape="circle" bg-color="#5d7291" color="#fff" mode="dark" />
										<u-tag text="更换位置" @click="changeLocation(k.id)" type="info" shape="circle" bg-color="#5d7291" color="#fff" mode="dark" />
										<u-tag text="续费" @click="rechargeHandler(k.id, index)" type="info" shape="circle" bg-color="#5d7291" color="#fff" mode="dark" />
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<u-modal
					v-model="showModal"
					:show-confirm-button="true"
					:show-cancel-button="true"
					:show-title="false"
					:content="modalContent"
					@confirm="confirmHandler"
					@cancel="cancelHandler"
				></u-modal>

				<u-popup v-model="showPopup" mode="bottom" border-radius="20" :closeable="true">
					<view class="card">
						<view class="item">
							<u-image width="226" height="226" border-radius="8" :src="unfold.pic_url[0].url" mode=""></u-image>

							<view class="info">
								<view class="title">{{ unfold.name }}</view>
								<view class="short-cut">{{ unfold.details }}</view>
								<view class="price-bt">
									价格：
									<!-- 做判断点击全场出现全场价格 -->
									<text v-if="choose == 1 ? true : false" class="price">{{ renewList.full_court.price }}元</text>
									<text v-else class="price">{{ renewList.half_court.price }}元</text>
								</view>
							</view>
						</view>
						<view class="xf-date">选择续费时间</view>
						<view class="select-time">
							<view @click="selection(1)" :class="[choose == 1 ? 'active' : '']">{{ renewList.full_court.fish_time }}个钟/场</view>
							<view @click="selection(2)" :class="[choose == 2 ? 'active' : '']">{{ renewList.half_court.fish_time }}个钟/半场</view>
						</view>

						<button class="sub" @click="orderCharge()">确认</button>
					</view>
				</u-popup>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'Pay-for-fishing',
	data() {
		return {
			choose: '1',
			showModal: false,
			showPopup: false,
			modalContent: '是否提前结束呢？',
			PondList: [], //鱼塘列表API
			renew: {}, //续费API
			renewList: {}, //续费列表
			unfold: {}, //续费弹出框
			order_id: '',
			bigness: '', //续费价格
			hours: '', //续费时间
			page: 1,
			hasdata: false,
			SeatId:'',
			is_renew:1,
		};
	},
	created() {
	},
	beforeCreate() {},
	props: { 
	},
	
	methods: {
		sLogin() {
			if (this.token) {
				return false;
			} else {
				uni.navigateTo({
					url: '../login/login'
				});
				return true;
			}
		},
		setApi(res){
			this.api2=res.api2
			this.self=res.self
			this.waterList();
			console.log(1111)
			
		},
		//续费选择续费时间
		selection(choose) {
			switch (choose) {
				case 1:
					this.hours = this.renewList.full_court.fish_time;
					this.bigness = this.renewList.full_court.price;
					this.is_renew = 1;
					break;
				case 2:
					this.hours = this.renewList.half_court.fish_time;
					this.bigness = this.renewList.half_court.price;
					this.is_renew = 2;
					break;
			}
			console.log(this.renewList);
			this.choose = choose;
		},
		//跳转选择钓位号页面
		page_down(id, index,is_order) {
			if (this.sLogin()) {
				return;
			}
			switch(is_order){
				case 1:
				uni.showToast({
				    title: '有未支付的开钓订单',
					icon:'none',
				    duration: 2000
				});
				break
				case 2:
				this.rechargeHandler(id, index);
				break
				case 3:
				this.rechargeHandler(id, index);
				break
			}
		},
		//鱼塘列表API
		waterList() {
		 
			this.api2
				.getPondList({
					page: 1,
					limit: 10
				})
				.then(res => {
					this.PondList = res.data.list;
					console.log(this.PondList);
				})
				.catch(err => {
					console.log(err);
				});
		},
		//提前结束
		modalHandler(id) {
			let taht=this
			let self =this.api2
			uni.showModal({
				title: '是否提前结束',
				success: function(res) {
					if (res.confirm) {
						self
							.getEnd({ fish_pond_id: id })
							.then(res => {
								uni.showToast({
									title: res.msg,
									duration: 2000,
									icon: 'none'
								});
								taht.waterList();
								console.log(res);
							})
							.catch(err => {
								uni.showToast({
									title: '没有订单',
									duration: 2000,
									icon: 'none'
								});
								console.log(err);
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//更换位置
		changeLocation(position) {
			console.log(position);
			uni.navigateTo({
				url: '../../pages/fishCharge/changeLocation' + `?id=${position}&sentence=${-2}`
			});
		},
		//续费
		//续费
		rechargeHandler(id, index) {
			let position = id;
			//判断是否续费API
			this.$u.api2
				.getRenew({ fish_pond_id: id })
				.then(res => {
					this.renew = res.data;
					this.renewList = res.data.list;
					this.both_aspects(position, index);
					this.order_id = res.data.list.order_id;
					this.SeatId=res.data.list.fish_pond_seat_id
					console.log(19456,res.data.list.fish_pond_seat_id)
					console.log(78941,this.order_id);
				})
				.catch(err => {
					console.log(err);
				});
		},// 判断客户是否下单
		both_aspects(position, index) {
			if (this.renew.is_renew == 2) {
				uni.showModal({
					title: '未下单',
					content: '是否进入支付',
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '../../pages/fishCharge/changeLocation'+ `?id=${position}` 
							});
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			} else {
				this.showPopup = true;
				this.unfold = this.PondList[index];
				this.speech = index;
			}
		},
		confirmHandler() {
			console.log('confirmHandler');
		},
		cancelHandler() {
			console.log('cancelHandler');
		},
		orderCharge() {
			console.log(this.choose);
			if (this.choose == -1) {
				uni.showToast({
					title: '请选择持续时间',
					duration: 2000,
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url:"../../pages/fishCharge/orderCharge" +
					`?fish=${this.unfold.id}&id=${this.SeatId}&order_id=${this.order_id}&bigness=${this.bigness}&hours=${this.hours}&is_renew=${this.is_renew}&jup=${5}`
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f7f7f8;
}

.Pay-for-fishing {
	width: 100%;

	background-color: #f7f7f8;
	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;
		.fish-charge {
			margin-top: 18rpx;
			.list {
				border-radius: 16rpx;
				.item {
					display: flex;
					background-color: #fff;
					margin-bottom: 40rpx;
					padding: 40rpx 18rpx;
					image {
						width: 240rpx;
						height: 240rpx;
					}
					.info {
						flex: 1;
						padding-left: 20rpx;
						.title {
							font-size: 32rpx;
							color: #1a1b1d;
							font-weight: 500;
						}
						.short-cut {
							font-size: 24rpx;
							color: #424242;
							line-height: 36rpx;
						}
						.price {
							margin: 6rpx 0;
							.bt {
								font-size: 28rpx;
								font-weight: 500;
							}
							.number {
								font-size: 36rpx;
								color: #f38b11;
							}
						}
						.tags {
							display: flex;
							justify-content: space-around;
						}
					}
				}
			}
		}
	}
}

.card {
	border-radius: 12rpx;
	padding: 44rpx 18rpx;
	background-color: #fff;
	.item {
		display: flex;
		background-color: #fff;
		margin-bottom: 40rpx;
		image {
			width: 240rpx;
			height: 240rpx;
		}
		.info {
			flex: 1;
			padding-left: 20rpx;
			.title,
			.price-bt {
				font-size: 30rpx;
				color: #1a1b1d;
				font-weight: bold;
			}
			.title {
				font-size: 40rpx;
				color: #1a1b1d;
				font-weight: 500;
				margin-bottom: 20rpx;
			}
			.short-cut {
				font-size: 28rpx;
				color: #525252;
				line-height: 36rpx;
			}
			.price {
				font-size: 30rpx;
				color: #f38b11;
				line-height: 64rpx;
			}
			.tags {
				display: flex;
				justify-content: space-around;
			}
		}
	}
	.xf-date {
		font-size: 32rpx;
		color: #1a1b1d;
		margin-top: 20rpx;
		margin-bottom: 34rpx;
	}
	.select-time {
		display: flex;
		justify-content: space-around;
		margin-bottom: 20rpx;
		view {
			width: 216rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			font-size: 28rpx;
			border-radius: 4rpx;
			background-color: #f1f1f1;
			&.active {
				background-color: #5d7291;
				color: #fff;
			}
		}
	}
	.sub {
		width: 632rpx;
		height: 72rpx;
		border-radius: 36rpx;
		line-height: 72rpx;
		background-color: #282828;
		color: #fff;
		font-size: 32rpx;
	}
}
</style>
