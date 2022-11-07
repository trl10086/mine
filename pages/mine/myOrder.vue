<template>
	<view class="wrap">
		<!-- 2. 优惠券列表 -->
		<view class="coupon_list_container">
			<!-- 2.1 切换栏 -->
			<view class="u-tabs-box">
				<u-tabs-swiper
					activeColor="#5d7291"
					:bar-width="138"
					inactive-color="#1a1b1d"
					ref="tabs"
					:list="list"
					:current="current"
					@change="change"
					:is-scroll="false"
					swiperWidth="750"
				></u-tabs-swiper>
			</view>
			<!-- 2.2 优惠券内容 -->
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="n in 3" :key="n">
					<scroll-view scroll-y style="height: 100%;width:100%;" @scrolltolower="reachBottom">
						<!-- 1. 暂无优惠券 -->
						<view class="no_coupon" v-if="Fish_pond_order_list.length == 0 ? true : false">
							<u-empty class="empty" icon-size="268" color="#1A1B1D" font-size="28" text="暂无订单哦~" mode="order"></u-empty>
						</view>

						<view v-else class="page-box">
							<view class="card">
								<view v-for="n in 1" class="item" :key="n">
									<view class="order-item" v-for="(item, index) in Fish_pond_order_list" :key="item.id">
										<view class="header">
											<view class="date">日期：{{ item.created_at }}</view>
											<view class="pay-status no-pay">{{ item.pay_status_content }}</view>
										</view>
										<view class="body">
											<view class="left"><u-image width="200" height="200" :src="item.pic_url[0].url"></u-image></view>
											<view class="right">
												<view class="info">
													<view class="title">{{ item.name }}</view>
													<view class="tags ellipsis">{{ item.details }}</view>
													<view class="fish-info">
														<view class="time">今日钓鱼{{ item.fish_time }}个钟</view>
														<view class="location">钓位：{{ item.fish_pond_seat_id }}号</view>
													</view>
													<view class="price">
														价格：
														<text class="bt">¥</text>
														<text class="number">{{ item.fish_pond_price }}</text>
														元/场
													</view>
													<view>数量：{{ item.num }}场</view>
												</view>
											</view>
										</view>
										<view class="footer">
											<view class="total">
												<view class="price-title">
													<text class="hj">合计：</text>
													<text class="bt">¥</text>
													<text class="number">{{ item.total_price }}</text>
													元
												</view>
												<view v-show="status == 1 ? (item.pay_status_content=='待付款' ?  true:false ):false">
													<view v-show="item.pay_type == 1 ? true : false" class="pay" @click="paymentClick(item.order_id)">
														{{ item.pay_status_content }}
													</view>
												</view>
												<view v-if="item.pay_status_content == '待付款' ? false : true" class="pay">{{ item.pay_status_content }}</view>
												<view v-else @click="cancel(item.order_type, item.fish_pond_id)" class="pay">{{ item.cancel }}</view>
											</view>
										</view>
										<view class="markup">留言备注：{{ item.remark }}</view>
									</view>
								</view>
							</view>
							<u-loadmore :status="loadStatus[0]" bgColor="#f7f7f8"></u-loadmore>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderList: [],
			page: 1,
			hasdata: false,
			status: '1',
			Fish_pond_order_list: [],
			dataList: [],
			list: [
				{
					name: '待付款'
				},
				{
					name: '已付款'
				},
				{
					name: '已完成'
				}
			],
			current: 0,
			swiperCurrent: 0,
			tabsHeight: 0,
			dx: 0,
			wxTow_id: '', //微信id
			loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore']
		};
	},
	onLoad() {
		// this.getList()
		/* this.getOrderList(0);
			this.getOrderList(1);
			this.getOrderList(3); */
		this.commodityOrder(this.page);
	},
	// 下拉刷新：
	onPullDownRefresh() {
		console.log('下拉');
		this.Fish_pond_order_list = [];
		this.page = 1;
		this.hasdata = false;
		this.commodityOrder(this.current + 1);
	},
	// 上拉加载：
	// onReachBottom() {
	// 	console.log('上拉');
	// 	if (!this.hasdata) {
	// 		return;
	// 	}
	// 	this.page++;
	// 	this.commodityOrder(this.page);
	// },
	methods: {
		//wx支付
		paymentClick(id) {
			let self = this;
			console.log(id);
			this.$u.api2
				.getWxPaymentGive({ id: id })
				.then(res => {
					if(res.data.retry==1){
						uni.showToast({
						    title: '当前网络繁忙',
						    duration: 2000
						})} else{
							self.wxTow_id = res.data.id;
							self.wxPaymentThree();
							console.log(res);
						}
					
				})
				.catch(err => {
					console.log(err);
				});
		},
		//微信支付第三步
		wxPaymentThree() {
			let self = this;
			self.$u.api2
				.getWxPaymentThree({ id: self.wxTow_id })
				.then(res => {
					self.pay_type = res.data.list[0].key;
					console.log(3, res.data.list[0].key);
					self.wxPaymentFour();
				})
				.catch(err => {
					console.log(err);
				});
		},
		//微信支付第四步
		wxPaymentFour() {
			let self = this;
			self.$u.api2
				.getWxPaymentFour({
					id: self.wxTow_id,
					pay_type: self.pay_type
				})
				.then(res => {
					self.wxPayment = res.data;
					console.log(4, self.wxPayment);
					if (res.code == 0) {
						// 仅作为示例，非真实参数信息。
						uni.requestPayment({
							appid: self.wxPayment.appId,
							id: self.wxPayment.id,
							provider: 'wxpay',
							timeStamp: self.wxPayment.timeStamp,
							nonceStr: self.wxPayment.nonceStr,
							package: self.wxPayment.package,
							signType: self.wxPayment.signType,
							paySign: self.wxPayment.paySign,

							success: function(res) {
								self.commodityOrder(self.page);
								console.log('success:' + JSON.stringify(res));
							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
							}
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		//取消订单
		cancel(order_type, fish_pond_id) {
			console.log(order_type, fish_pond_id);
			this.$u.api2
				.getCancel({
					order_type: order_type,
					fish_pond_id: fish_pond_id
				})
				.then(res => {
					uni.showToast({
						title: '取消成功',
						duration: 2000,
						icon: 'none'
					});
					this.commodityOrder(this.page);
					console.log(res);
				})
				.catch(err => {
					uni.showToast({
						title: err.msg,
						duration: 2000,
						icon: 'none'
					});
					console.log(err);
				});
		},
		// tab栏切换
		change(index) {
			this.swiperCurrent = index;
			// this.status = index + 1;
			// this.commodityOrder(index + 1);
			console.log(this.status);
			// this.getOrderList(index);
		},
		transition({ detail: { dx } }) {
			this.$refs.tabs.setDx(dx);
		},
		animationfinish({ detail: { current } }) {
			this.$refs.tabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
			this.Fish_pond_order_list = [];
			this.page = 1;
			this.hasdata = false;
			this.commodityOrder(this.current + 1);
		},
		//鱼塘列表
		commodityOrder(status) {
			let self = this;
			self.$u.api2
				.get_Fish_pond_order({ status, page: self.page })
				.then(res => {
					if (self.page) {
						self.Fish_pond_order_list = res.data.list;
						for (let i = 0; i < res.data.list.length; i++) {
							self.Fish_pond_order_list[i].cancel = '取消';
						}
					} else {
						self.Fish_pond_order_list = self.Fish_pond_order_list.concat(res.data.list); //实际返回数据的字段
					}
					console.log(557, self.Fish_pond_order_list);
				})
				.catch(err => {
					console.log(err);
				});
		},
		reachBottom() {
			console.log('上拉');
			if (!this.hasdata) {
				return;
			}
			this.page++;
			this.Fish_pond_order_list(this.current + 1);
		}
		//订单
		// getList(){
		// 	let self = this
		// 	self.$u.api.order_list({
		// 		status: 3
		// 	}).then(res=>{

		// 	})
		// }

		/* reachBottom() {
				// 此tab为空数据
				if (this.current != 2) {
					this.loadStatus.splice(this.current, 1, "loading")
					setTimeout(() => {
						this.getOrderList(this.current);
					}, 1200);
				}
			},
			// 页面数据
			getOrderList(idx) {
				for (let i = 0; i < 5; i++) {
					let index = this.$u.random(0, this.dataList.length - 1);
					let data = JSON.parse(JSON.stringify(this.dataList[index]));
					data.id = this.$u.guid();
					this.orderList[idx].push(data);
				}
				this.loadStatus.splice(this.current, 1, "loadmore")
			},
			// 总价
			totalPrice(item) {
				let price = 0;
				item.map(val => {
					price += parseFloat(val.price);
				});
				return price.toFixed(2);
			},
			// 总件数
			totalNum(item) {
				let num = 0;
				item.map(val => {
					num += val.number;
				});
				return num;
			}, */
	}
	/* computed: {
			hasCoupon() {
				return false;
			},
		
			// 价格小数
			priceDecimal() {
				return val => {
					if (val !== parseInt(val)) return val.slice(-2);
					else return '00';
				};
			},
			// 价格整数
			priceInt() {
				return val => {
					if (val !== parseInt(val)) return val.split('.')[0];
					else return val;
				};
			}
		}, */
};
</script>

<style lang="scss">
page {
	background-color: #f7f7f8;
}

.wrap {
	width: 100%;
	background-color: #f7f7f8;
}
</style>

<style lang="scss" scoped>
.wrap {
	width: 100%;
	background-color: #f7f7f8;

	.no_coupon {
		.empty {
			padding-top: 56rpx;
		}
	}
	//多行省略
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
	.swiper-box {
		margin-top: 26rpx;
		height: calc(100vh - var(--window-top) - 150rpx);
		padding: 0 24rpx;

		.swiper-item {
			background-color: #f7f7f8;

			.page-box {
				.card {
					.order-item {
						padding: 24rpx;
						background-color: #fff;
						margin-bottom: 16rpx;
						border-radius: 12rpx;

						.header {
							display: flex;
							justify-content: space-between;
							color: #1a1b1d;
							font-size: 24rpx;
							margin-bottom: 34rpx;

							.date {
							}

							.pay-status {
								color: #f38b10;
							}
						}

						.body {
							display: flex;

							.left {
								margin-right: 50rpx;
							}

							.right {
								color: #1a1b1d;
								line-height: 44rpx;
								font-size: 24rpx;

								.info {
									.title {
										font-size: 32rpx;
									}
									.tags {
										font-size: 24rpx;
									}
									.substance {
										color: #1a1b1d;
										font-size: 28rpx;
									}
								}

								.fish-info {
									display: flex;
									align-items: center;
									.time {
										height: 48rpx;
										line-height: 48rpx;
										background-color: #5d7291;
										padding: 0 8rpx;
										color: #fff;
										border-radius: 4rpx;
										margin-right: 16rpx;
									}
									.location {
										font-size: 24rpx;
									}
								}

								.price {
									font-size: 28rpx;
									.bt {
										color: #f38b10;
										font-size: 24rpx;
									}
									.number {
										font-size: 32rpx;
										color: #f38b10;
									}
								}
							}
						}
						.amount {
							margin-top: 22rpx;
							margin-left: 330rpx;
							.hj {
								color: #1a1b1d;
								font-size: 28rpx;
							}
							.bt {
								font-size: 24rpx;
								color: #f38b10;
							}
							.number {
								font-size: 32rpx;
								color: #f38b10;
							}
						}
						.footer {
							display: flex;
							justify-content: flex-end;
							margin-top: 22rpx;
							.total {
								display: flex;
								align-items: center;
								.price-title {
									.hj {
										color: #1a1b1d;
										font-size: 28rpx;
									}
									.bt {
										font-size: 24rpx;
										color: #f38b10;
									}
									.number {
										font-size: 32rpx;
										color: #f38b10;
									}
								}
								.pay {
									margin-left: 26rpx;
									height: 48rpx;
									line-height: 48rpx;
									border-radius: 24rpx;
									border: 1px solid #5d7291;
									color: #5d7291;
									padding: 0 32rpx;
								}
							}
						}

						.markup {
							font-size: 24rpx;
							color: #1a1b1d;
						}
					}
				}
			}
		}
	}
}

.swiper-item {
	height: 100%;
}
</style>
