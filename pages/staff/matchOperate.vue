<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="wrap-in">
			<view class="card score">
				<view class="title">我的成绩</view>
				<view class="list">
					<view class="item">
						<text>鱼获</text>
						<text>{{ datalist.fish_catch }}</text>
					</view>
					<view class="item">
						<text>次数</text>
						<text>{{ datalist.num }}</text>
					</view>
					<view class="item">
						<text>过百</text>
						<text>{{ datalist.fish_over }}</text>
					</view>
					<view class="item">
						<text>坑冠</text>
						<text>{{ datalist.the_first_num }}</text>
					</view>
				</view>
			</view>

			<view class="card sr">
				<view class="title">我的收入</view>
				<view class="list balance">
					<view class="item ">
						<text>回鱼收入</text>
						<text>{{ datalist.return_fish }}</text>
					</view>
					<view class="item">
						<text>中标金额</text>
						<text>{{ datalist.back_bid_price }}</text>
					</view>
					<view class="item">
						<text>优惠券</text>
						<text>{{ datalist.coupon_num }}</text>
					</view>
				</view>
			</view>

			<view v-show="datali.status == 3 ? false : true">
				<view v-if="datali.status == 2 ? false : true">
					<view class="card match-op">
						<text>回鱼收入</text>
						<view class="add" @click="showA = true">增加</view>
					</view>

					<view class="card match-op">
						<text>鱼获</text>
						<view class="add" @click="showB = true">增加</view>
					</view>

					<view class="card match-op">
						<text>过百</text>
						<view class="add" @click="showC = true">增加</view>
					</view>
					<view class="card match-op">
						<text>中标金额</text>
						<view class="add" @click="showD = true">增加</view>
					</view>
					<view class="card match-op">
						<text>抵扣劵</text>
						<view class="add" @click="send_user_coupon">赠送</view>
					</view>
				</view>
				<view v-else>
					<view class="card match-op">
						<text>回鱼收入</text>
						<u-input v-model="mobileA" :type="text" :border="border" placeholder="请输入回鱼收入" />
					</view>

					<view class="card match-op">
						<text>鱼获</text>
						<u-input v-model="mobileB" :type="text" :border="border" placeholder="请输入鱼获" />
					</view>

					<view class="card match-op">
						<text>过百</text>
						<u-input v-model="mobileC" :type="text" :border="border" placeholder="请输入过百次数" />
					</view>
					<view class="card match-op">
						<text>中标金额</text>
						<u-input v-model="mobileD" :type="text" :border="border" placeholder="请输入金额" />
					</view>
					<view class="card match-op">
						<text>抵扣劵</text>
						<view class="add" @click="send_user_coupon">赠送</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 回鱼收入 -->

		<u-modal v-model="showA" :show-title="false" :show-cancel-button="true" @confirm="confirmA">
			<view class="mt60 mainRow center">
				<u-field
					v-model="mobileA"
					label-align="right"
					label-width="160"
					maxlength="15"
					:field-style="style"
					:clearable="false"
					label="回鱼收入:"
					placeholder="请输入回鱼收入"
				></u-field>
			</view>
		</u-modal>
		<!-- 鱼获 -->
		<u-modal v-model="showB" :show-title="false" :show-cancel-button="true" @confirm="confirmB">
			<view class="mt60 mainRow center">
				<u-field
					v-model="mobileB"
					label-align="right"
					label-width="160"
					maxlength="15"
					:field-style="style"
					:clearable="false"
					label="鱼获:"
					placeholder="请输入鱼获"
				></u-field>
			</view>
		</u-modal>
		<!-- 过百 -->
		<u-modal v-model="showC" :show-title="false" :show-cancel-button="true" @confirm="confirmC">
			<view class="mt60 mainRow center">
				<u-field
					v-model="mobileC"
					label-align="right"
					label-width="160"
					maxlength="15"
					:field-style="style"
					:clearable="false"
					label="过百:"
					placeholder="请输入过百次数"
				></u-field>
			</view>
		</u-modal>
		<!-- 中标jine -->
		<u-modal v-model="showD" :show-title="false" :show-cancel-button="true" @confirm="confirmD">
			<view class="mt60 mainRow center">
				<u-field
					v-model="mobileD"
					label-align="right"
					label-width="160"
					maxlength="15"
					:field-style="style"
					:clearable="false"
					label="中标金额:"
					placeholder="请输入金额"
				></u-field>
			</view>
		</u-modal>

		<view class="mh32" v-show="datali.status == 2 ? true : false">
			<u-button :custom-style="customStyle" throttle-time="1000" shape="circle" @click="btnClick">确认录入</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			value: '',
			type: 'textarea',
			border: true,

			autoHeight: true,
			showA: false,
			mobileA: '',
			showB: false,
			mobileB: '',
			showC: false,
			mobileC: '',
			showD: false,
			mobileD: '',
			datalist: '',
			datali: {},
			dataList: {},
			customStyle: {
				marginTop: '20px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				backgroundColor: '#282828',
				color: '#fff'
			},
			style: {
				fontSize: '32rpx'
			}
		};
	},
	onLoad(e) {
		console.log(15321, JSON.parse(e.data));
		this.datali = JSON.parse(e.data);
		this.achievement(JSON.parse(e.data));
	},
	methods: {
		//返回
		back() {
			//@zxyuns 处理兼容，如果没有上一级界面则返回首页
			const pages = getCurrentPages();
			if (pages.length === 2) {
				uni.navigateBack({
					delta: 1
				});
			} else if (pages.length === 1) {
				uni.switchTab({
					url: '/pages/tabBar/home'
				});
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		//点击录入
		btnClick() {
			let self = this;
			this.datali.return_fish = this.mobileA;
			this.datali.fish_catch = this.mobileB;
			this.datali.fish_over = this.mobileC;
			this.datali.back_bid_price = this.mobileD;
			this.$u.api.edit_user_achievement(this.datali).then(res => {
				uni.showModal({
					title: '录入成功',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							self.back();
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			});
			console.log(124, this.datali);
		},
		// 修改
		confirmA() {
			this.editAchievement(1);
		},
		confirmB() {
			this.editAchievement(2);
		},
		confirmC() {
			this.editAchievement(3);
		},
		confirmD() {
			this.editAchievement(4);
		},
		// 成绩
		achievement(data) {
			let self = this;
			self.$u.api.get_user_achievement(data).then(res => {
				this.datalist = res.data;
				console.log(4512, this.datalist);
			});
		},
		//修改用户成绩
		editAchievement(type) {
			let self = this;
			// self.datali=datali.back_bid_price
			const data = self.datali;
			
			switch (type) {
				case 1:
					data.return_fish = self.mobileA;
					break;
				case 2:
					data.fish_catch = self.mobileB;
					break;
				case 3:
					data.fish_over = self.mobileC;
					break;
				case 4:
					data.back_bid_price = self.mobileD;
					break;
			}
			console.log(4545,data)
			self.$u.api.edit_user_achievement(data).then(res => {
				self.$refs.uToast.show({
					title: '添加成功',
					type: 'default'
				});
				self.achievement(self.datali);
				self.mobileA = '';
				self.mobileB = '';
				self.mobileC = '';
			});
		},
		//赠送优惠卷
		send_user_coupon() {
			let self = this;
			self.$u.api
				.send_user_coupon({
					fish_pond_id: self.datali.fish_pond_id,
					user_id: self.datali.user_id
				})
				.then(res => {
					self.$refs.uToast.show({
						title: res.msg,
						type: 'default'
					});
					this.achievement(self.datali);
				})
				.catch(err => {
					self.$refs.uToast.show({
						title: err.msg,
						type: 'default'
					});
				});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f7f7f8;
}

.mt16 {
	margin-bottom: 16rpx;
}

.wrap {
	width: 100%;
	background-color: #f7f7f8;

	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;

		.card {
			background-color: #30415b;
			border-radius: 12rpx;
			padding: 22rpx 20rpx;
			margin-bottom: 16rpx;
			color: #fff;

			&.sr {
				margin-bottom: 46rpx;
			}

			&.match-op {
				height: 88rpx;
				background-color: #fff;
				margin-bottom: 16rpx;
				color: #1a1b1d;
				font-size: 36rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.add {
					width: 100rpx;
					height: 48rpx;
					line-height: 48rpx;
					text-align: center;
					border-radius: 4rpx;
					background: #5d7291;
					font-size: 30rpx;
					color: #fff;
				}
			}

			&.score {
				margin-top: 20rpx;
			}

			.title {
				font-size: 32rpx;
				padding-bottom: 32rpx;
			}

			.list {
				display: flex;
				justify-content: space-between;
				line-height: 44rpx;

				&.balance {
					justify-content: space-between;
				}

				.item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					&.yhsr {
						margin-right: 156rpx;
					}

					text:first-child {
						margin-bottom: 12rpx;
					}
				}
			}
		}
	}
}
</style>
