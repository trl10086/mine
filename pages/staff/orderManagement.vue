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

			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="n in 3" :key="n">
					<scroll-view scroll-y style="height: 100%;width:100%;" @scrolltolower="reachBottom">
						<view class="no_coupon" v-if="dataList.length == 0 ? true : false">
							<u-empty class="empty" icon-size="268" color="#1A1B1D" font-size="28" text="暂无订单哦~" mode="order"></u-empty>
						</view>

						<view v-else class="page-box">
							<view class="card">
								<view  class="item" >
									<view class="order-item" v-for="(item, index) in dataList" :key="item.user_id">
										<view class="header" @click="adaptation(item)">
											<view class="date">
												<view class="figure">
													<u-avatar :src="item.avatar"></u-avatar>
													<view class="message text28">
														<text style="margin-bottom: 8rpx;">{{item.nickname}}</text>
														<text>{{item.mobile}}</text>
													</view>
												</view>
												<u-icon name="arrow-right" size="36rpx" color="#362C2C"></u-icon>
											</view>
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
										<view>支付时间：{{item.pa_time}}</view>
										<view class="footer">
											<view class="total">
												<view class="price-title">
													<text class="hj">合计：</text>
													<text class="bt">¥</text>
													<text class="number">{{ item.total_price }}</text>
													元
												</view>
												<view v-show="status!=1?true:false" >
													<!-- <view v-show="status == 1 ? (item.pay_status_content == '待付款' ? true : false) : false">
														<view v-show="item.pay_type == 1 ? true : false" class="pay">{{ item.pay_status_content }}</view>
													</view> -->
													<!-- <view v-if="item.pay_status_content == '待付款' ? false : true" class="pay">{{ item.pay_status_content }}545</view> -->
													<view v-show="item.payee.length" class="place">{{ item.payee }}</view>
													<!-- <view v-else @click="cancel(item.order_type, item.fish_pond_id)" class="pay">{{ item.cancel }}</view> -->
												</view>
											</view>
										</view>
										<view class="write">
											<view class="markup">留言备注：{{ item.remark }}</view>
											<view class="orientation" v-show="status==3?true:false">
												<text>成绩录入员</text>
												<text class="place">{{item.note_taker}}</text>
											</view>
										</view>
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
					name: '进行中'
				},
				{
					name: '已结算'
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
			loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
			time:[]
		};
	},
	onShow() {
		this.orderManagementList(this.status);
	}
	,
	// 下拉刷新：
	onPullDownRefresh() {
		console.log('下拉');
		this.Fish_pond_order_list = [];
		this.page = 1;
		this.hasdata = false;
		// this.commodityOrder(this.current + 1);
		this.orderManagementList(this.current + 1);
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
		//获取订单管理列表
		orderManagementList(status) {
			console.log(this.page)
			let self = this;
			self.$u.api2
				.getOrderManagement({ status: status, page: self.page })
				.then(res => {
					if (self.page == 1) {
						self.dataList = [];
						self.dataList = res.data.list; //实际返回数据的字段
						//分割日期和时间
						self.dataList.forEach((item)=>{
							let res=item.pay_time.split(' ')
							item.pa_time=res[0]
						})
						console.log(4147, self.dataList);
					} else {
						self.dataList = self.dataList.concat(res.data.list); //实际返回数据的字段
						//分割日期和时间
						self.dataList.forEach((item)=>{
							let res=item.pay_time.split(' ')
							item.pa_time=res[0]
						})
						console.log('sad', self.dataList);
					}
					self.hasdata = self.page < res.data.pagination.page_count;
					uni.stopPullDownRefresh();
					
				})
				.catch(err => {
					console.log(3214, err);
				});
		},
		//点击头像
		adaptation(e) {
			console.log(1412,e)
			const data = {};
			data.fish_pond_id = e.fish_pond_id;
			data.user_id = e.user_id;
			data.fish_pond_seat_id = e.fish_pond_seat_id;
			data.order_no = e.order_no;
			data.status=this.status
			uni.navigateTo({
				url: `matchOperate?data=${JSON.stringify(data)}`
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
			this.status = index + 1;
			// this.commodityOrder(index + 1);
			console.log(this.swiperCurrent);
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
			// this.commodityOrder(this.current + 1);
			this.orderManagementList(this.current + 1);
		},
		//鱼塘列表
		commodityOrder(status) {
			console.log(6214, status);
			let self = this;
			self.$u.api2
				.get_Fish_pond_order({ status, page: self.page })
				.then(res => {
					if (self.page==1) {
						self.Fish_pond_order_list = res.data.list;
						for (let i = 0; i < res.data.list.length; i++) {
							self.Fish_pond_order_list[i].cancel = '取消';
						}
					} else {
						self.Fish_pond_order_list = self.Fish_pond_order_list.concat(res.data.list); //实际返回数据的字段
					}
					console.log(557, self.page);
				})
				.catch(err => {
					console.log(err);
				});
		},
		reachBottom() {
			console.log('上拉',!this.hasdata);
			if (!this.hasdata) {
				return;
			}
			this.page++;
			this.orderManagementList(this.current + 1);
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
.orientation {
	display: flex;
	align-items: center;
}
.place {
	height: 48rpx;
	max-width: 190rpx;
	background-color: #5d7291;
	font-size: 24rpx;
	display: block;
	text-align: center;
	padding: 0 18rpx;
	line-height: 48rpx;
	margin-left: 26rpx;
	border-radius: 4rpx;
	margin-top: 12rpx;
	color: #fff;
}
.wrap {
	width: 100%;
	background-color: #f7f7f8;
}
</style>

<style lang="scss" scoped>
.write {
	display: flex;
	justify-content: space-between;
}
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
								display: flex;
								justify-content: space-between;
								width: 100%;
								.figure {
									display: flex;
									align-items: center;
									.message {
										margin-left: 14rpx;
										color: #362c2c;
										display: flex;
										flex-direction: column;
									}
								}
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
							align-items: center;
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
