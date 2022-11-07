	<template>
	<view class="wrap">
		<view class="wrap-in">
			<!-- 1. 预约比赛信息 -->
			<view class="match-info">
				<view class="left">
					<text class="title">天鲤钓场比赛</text>
					<view class="date">活动时间：
						<view>{{lisdat.time_info.start_time}}——{{lisdat.time_info.end_time}}</view>
					</view>
				</view>
				<view class="right">
					<text class="yr-title">预约人数</text>
					<text class="number">{{lisdat.activity_num}}</text>
				</view>
			</view>

			<!-- 2. 用户列表 -->
			<view class="user-list" v-for="(item, index) in enrollList" :key="item.id">
				<view @click="shift(item.user_id)">
					<view class="item">
						<view class="left">
							<view class="cover">
								<u-image width="96" height="96" shape="circle"
									:src="item.userInfo.avatar"></u-image>
							</view>
							<view class="info">
								<view class="nickname">{{ item.name }}</view>
								<view class="tel">{{ item.mobile }}</view>
							</view>
						</view>
						<view class="right">
							<view class="title cer" v-if="item.fish_pond_seat == ''">已预约</view>
							<view v-else class="title cer">{{ item.fish_pond_seat }}号钓位</view>
							<view class="date">{{ item.created_at }}</view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<u-popup v-model="show" mode="center">
					<view class="frame">
						<view class="election text36">
							<text class="tet">重量：</text>
							<input type="text" v-model="scale" placeholder="请输入重量斤数" />
						</view>
						<view class="wire"></view>
						<view class="btn" @click="fillIn">确认</view>
					</view>
				</u-popup>
			</view>
			<!-- 3. 开始摇号 -->
			<button v-if="status == 0 ? true : false" @click="volution" class="start-shake" type="default">开始摇号</button>
			<button v-else-if="status == 1 ? true : false" @click="volution" class="start-shake "
				type="default">结束活动</button>
			<button v-else @click="volution(1)" class="start-shake" type="default "
				style="background-color: #969998;">结束已活动</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 0,
				s_id: '', //上个页面传来的id
				enrollList: [],
				status: '',
				show: false,
				scale: '',
				user_id: '',
				page: 1,
				hasdata: false,
				lisdat: '',
			};
		},
		onLoad(res) {
			this.s_id = res.id;
			this.status = res.status;
			console.log(res);
			this.enroll(this.page);
		},

		// 下拉刷新：
		onPullDownRefresh() {
			this.dataList = [];
			this.page = 1;
			this.hasdata = false
			this.enroll(this.page);
		},
		// 上拉加载：
		onReachBottom() {
			if (!this.hasdata) {
				return;
			}
			this.page++
			this.enroll(this.page);
		},
		methods: {
			//输入重量
			fillIn(id) {
				let self = this
				this.$u.api2
					.getScale({
						weight: self.scale,
						activity_id: self.s_id,
						user_id: self.user_id
					})
					.then(res => {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: 'none'
						});
						self.show = false
						console.log(res);
					})
					.catch(err => {
						console.log(err);
					});
			},
			//点击弹出框
			shift(id) {
				if (this.status == 1) {
					this.show = true;
					this.user_id = id
					console.log(id)
				}
			},
			//摇号
			volution() {
				if (this.status == 0) {
					this.$u.api2
						.getYaoHao({
							activity_id: this.s_id
						})
						.then(res => {
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: 'none'
							});
							this.status = 1;
							this.enroll(this.page);
						})
						.catch(err => {
							uni.showToast({
								title: err.msg,
								duration: 2000,
								icon: 'none'
							});
							console.log(err);
						});
				}
				if (this.status == 1) {
					this.$u.api2
						.getGaltUrl({
							id: this.s_id
						})
						.then(res => {
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: 'none'
							});
							console.log(res);
							this.status = 2;
							this.enroll();
						})
						.catch(err => {
							uni.showToast({
								title: err.msg,
								duration: 2000,
								icon: 'none'
							});

							console.log(err);
						});
				}
			},
			//活动报名列表API
			enroll(page) {
				let self = this
				self.$u.api2
					.getEnroll({
						id: self.s_id,
						page: page
					})
					.then(res => {
						self.lisdat = res.data
						if (self.page == 1) {
							self.enrollList = []
							self.enrollList = res.data.list;
							console.log(6325,self.enrollList)
						} else {
							self.enrollList = self.enrollList.concat(res.data.list); //实际返回数据的字段
						}
						self.hasdata = self.page < res.data.pagination.page_count;
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
	};
</script>

<style lang="scss">
	.frame {
		width: 560rpx;
		height: 362rpx;

		.wire {
			border-bottom: 1rpx solid #aaaaaa;
		}

		.tet {
			display: inline-block;
			width: 130rpx;
		}

		.election {
			display: flex;
			margin-left: 100rpx;
			padding-top: 106rpx;
			padding-bottom: 32rpx;
		}

		.btn {
			font-size: 36rpx;
			color: #5d7291;
			margin-top: 48rpx;
			float: right;
			margin-right: 100rpx;
		}
	}

	.cer {
		text-align: center;
	}

	.wrap {
		width: 100%;
		background-color: #f7f7f8;

		.wrap-in {
			width: 750rpx - 24 * 2;
			margin: 0 auto;

			.match-info {
				background-color: #30415b;
				color: #fce6cf;
				padding: 18rpx 24rpx;
				border-radius: 12rpx;
				margin-bottom: 24rpx;

				display: flex;
				justify-content: space-between;
				line-height: 44rpx;

				.left {
					display: flex;
					flex-direction: column;

					.title {
						font-size: 36rpx;
						margin-bottom: 8rpx;
					}

					.date {
						font-size: 24rpx;
					}
				}

				.right {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.yr-title {
						margin-bottom: 8rpx;
					}

					.number {}
				}
			}

			.user-list {
				.item {
					padding: 20rpx;
					border-bottom: 1rpx solid #aaa;
					background-color: #fff;

					display: flex;
					justify-content: space-between;

					.left {
						display: flex;

						.cover {
							margin-right: 14rpx;
						}

						.info {
							display: flex;
							flex-direction: column;
							color: #362c2c;

							.nickname {
								font-size: 28rpx;
								padding-bottom: 8rpx;
							}

							.tel {
								font-size: 24rpx;
							}
						}
					}

					.right {
						.title {
							font-size: 28rpx;
							color: #5d7291;
							padding-bottom: 8rpx;
						}

						.date {
							font-size: 24rpx;
							color: #362c2c;
						}
					}
				}
			}

			.start-shake {
				width: 632rpx;
				height: 88rpx;
				margin-top: 52rpx;
				line-height: 88rpx;
				text-align: center;
				border-radius: 44rpx;
				background-color: #282828;
				color: #fff;
			}
		}
	}
</style>
