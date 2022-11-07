<template>
	<view>
		<view class="mh32" style="padding-bottom: 44rpx;">
			<view><uni-datetime-picker v-model="datetimerange" type="daterange" return-type="" rangeSeparator="至" @change="timechange" /></view>
			<view>
				<view class="bgWhite layout">
					<view class="mh32" style="padding-top: 32rpx;padding-bottom: 20rpx;">
						<text class="title">商城订单</text>
						<view>
							<view class="totalIncome">
								<text class=" testColor" style="font-size: 52rpx;">
									<text class="text28">￥</text>
									{{orderManagementList.all_order_price}}
								</text>
								<text class="rental">总收款</text>
							</view>
						</view>
						<view class="single">
							<dl>
								<dt class="text32 textColor41">今日开单</dt>
								<dd class="text_center mt28 text32 textwbold testColor">{{orderManagementList.num}}笔</dd>
							</dl>
							<dl>
								<dt class="text32 textColor41">线上总金额</dt>
								<dd class="text_center mt28 text32 textwbold testColor">￥{{orderManagementList.on_line_price}}</dd>
							</dl>
							<dl>
								<dt class="text32 textColor41">线下总金额</dt>
								<dd class="text_center mt28 text32 textwbold testColor">￥{{orderManagementList.offline_price}}</dd>
							</dl>
						</view>
					</view>
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
					range: '', //开始选择日期
					maximum: '', //结束选择日期
					limit: '10',
					page: '1',
					order_type: '2'
				},
				hasdata: false,
				destiny: [] ,//选择日期数据
				orderManagementList:[]
			}
		},
		onLoad() {
			this.orderManagement()
		}
		,
		methods: {
			//商城总收入
			async orderManagement() {
				let self = this;
				let res = await self.$u.api2.getorderRevenue({ order_type: self.dateForm.order_type, s_time: self.dateForm.range, e_time: self.dateForm.maximum });
				self.orderManagementList = res.data[0];
				console.log(124, self.orderManagementList);
			},
			// 选择日期
			selectDate(page) {
				let self = this;
				self.dateForm.page = page;
			},
			timechange(e) {
				this.daterange = e;
				this.dateForm.range = e[0];
				this.dateForm.maximum = e[1];
				this.orderManagement()
				console.log(e, 111, this.dateForm);
			}
		}
	}
</script>

<style lang="scss">
page {
	background-color: #f7f7f8;
}
.title {
	color: #000000;
	font-size: 40rpx;
}
.totalIncome {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}
.single {
	display: flex;
	justify-content: space-between;
}
.rental {
	margin-top: 14rpx;
	color: #000;
	font-size: 36rpx;
	margin-bottom: 50rpx;
}
.layout {
	border-radius: 16rpx;
	margin-top: 20rpx;
}
.testColor {
	color: #ffb300;
}
.textColor41 {
	color: #414141;
}

.bgWhite {
	background-color: #ffffff;
}
</style>