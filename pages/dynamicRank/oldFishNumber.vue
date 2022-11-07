<template>
	<view>
		<!-- 头部 -->
		<view>
			<view><uni-datetime-picker v-model="datetimerange" type="daterange" return-type="" rangeSeparator="至" @change="timechange" /></view>

			<view>
				<view class="fish">
					<text class="sign">放鱼时间</text>
					<text class="sign">鱼种</text>
					<text class="sign">数量</text>
				</view>
				<view v-if="destiny.length == 0 ? true : false" >暂无放鱼</view>
				<view v-else class="fish-table" v-for="item in destiny" :key="item.id">
					<text class="sign">{{ item.date }}</text>
					<text class="sign">{{ item.fish_type_name }}</text>
					<text class="sign">{{ item.jin_number }}斤</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			page: '1',
			dateForm: {
				s_time: '', //开始选择日期
				e_time: '', //结束选择日期
				limit: '10',
				page: '1',
				fish_type: '2'
			},
			hasdata: false,
			destiny: [] //选择日期数据
		};
	},
	onReady() {
		// let today = this.$refs.ren.getToday().date;
		// this.curDate = today;
		// this.markDays.push(today);
		this.selectDate(1);
	},
	// 下拉刷新：
	onPullDownRefresh() {
		this.dataList = [];
		this.page = 1;
		this.hasdata = false;
	},
	// 上拉加载：
	onReachBottom() {
		if (!this.hasdata) {
			console.log(!this.hasdata);
			return;
		}
		this.page++;
	},
	methods: {
		// 选择日期
		selectDate(page) {
			let self = this;
			self.dateForm.page = page;
			self.$u.api2
				.getFishReleaseRecord(self.dateForm)
				.then(res => {
					if (self.page == 1) {
						self.destiny = [];
						self.destiny = res.data.list;
					} else {
						self.destiny = self.destiny.concat(res.data.list);
					}
					self.hasdata = self.page < res.data.pagination.page_count;
					uni.stopPullDownRefresh();
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		},
		timechange(e) {
			this.daterange = e;
			this.dateForm.s_time = e[0];
			this.dateForm.e_time = e[1];
			this.selectDate(1);
			console.log(e, 111, this.dateForm);
		}
		// onDayClicks(data) {
		// 	this.curDate = data.date;
		// }
	}
};
</script>

<style lang="scss">

.sign {
	flex: 1;
	display: block;
}
.fish {
	height: 76rpx;
	background-color: #5d7291;
	display: flex;
	/* justify-content: space-around; */
	align-items: center;
	color: #fff;
	font-size: 28rpx;
	text-align: center;
}
.fish-table {
	display: flex;
	text-align: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #efefef;
	text {
		color: #1e1e1e;
	}
}
.calendar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 68rpx;
	border: 1rpx solid #c4c4c4;
	margin: 0 24rpx;
	margin-bottom: 16rpx;
	border-radius: 8rpx;
	.calendar-start {
		display: flex;
		margin-left: 20rpx;
		color: #606060;
		font-size: 28rpx;
	}
	.calendar-end {
		margin-right: 20rpx;
		color: #606060;
		font-size: 28rpx;
	}
}
</style>
