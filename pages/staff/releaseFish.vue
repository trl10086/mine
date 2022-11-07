<template>
	<view>
		<u-toast ref="uToast" />
		<view class="content mh32">
			<ren-calendar ref="ren" :markDays="markDays" :open="true" :disabledAfter="true" @onDayClick="onDayClick"></ren-calendar>

			<!-- <view class="change">选中日期：{{ curDate }}</view> -->
		</view>
		<view>
			<view class="mh32 text32 title">今日放鱼数量</view>
			<view @click="show = true" class="seat mh32">
				<view class="seat-position">
					<text>{{ tell }}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view style="background-color: #FFFFFF;margin-top: 20rpx;" class="mh32">
				<u-input v-model="free.jin_number" :type="text" style="display: block;margin-left: 20rpx;" placeholder="请输入数量斤数"/>
			</view>
		</view>
		<u-select v-model="show" :list="fishFry" @confirm="fish" value-name="id" label-name="fish_type_name"></u-select>
		<button class="pay-btn" @click="acquittal">确认放鱼</button>
	</view>
</template>

<script>
import RenCalendar from '@/components/ren-calendar/ren-calendar.vue';
export default {
	data() {
		return {
			curDate: '',
			markDays: [],
			tell: '鱼种',
			fishFry: [],
			show: false,
			value: '',
			type: 'text',
			free: {
				date: '',
				fish_type_id: '',
				jin_number: ''
			},
			status:'',//选择状态
			page:'1'
		};
	},
	onReady() {
		let today = this.$refs.ren.getToday().date;
		this.curDate = today;
		this.markDays.push(today);
		this.free.date = today;
	},
	onLoad() {
		this.configuration();
	},
	methods: {
	
		//获取鱼种
		async configuration() {
			let res = await this.$u.api2.getconfiguration();
			this.fishFry = res.data.fish_type_list;
			console.log(32154, this.fishFry);
		},
		fish(res) {
			this.tell = res[0].label;
			this.free.fish_type_id = res[0].value;
			console.log(res);
		},
		open() {
			// console.log('open');
		},
		close() {
			this.show = false;
			// console.log('close');
		},
		onDayClick(data) {
			this.curDate = data.date;
			this.free.date = data.date;
		},
		acquittal() {
			let self = this;
			if(!this.free.fish_type_id){
				this.$refs.uToast.show({
					title:'未选择鱼塘位置',
					type: 'error',
				});
				return false
			}
			self.$u.api2
				.getGoAway(self.free)
				.then(res => {
					uni.showModal({
					    title: res.msg,
					    // content: '这是一个模态弹窗',
						showCancel:false,
					    complete: function (res) {
					        if (res.confirm) {
					            self.free.fish_type_id=''
					            self.free.jin_number=''
					            self.tell= '鱼塘位置',
					            console.log(res);
					        } 
					    }
					});
					// this.$refs.uToast.show({
					// 	title: res.msg,
					// 	type: 'success',
					// });
					// self.free.date=''
					
				})
				.catch(err => {
					this.$refs.uToast.show({
						title:err.msg,
						type: 'error',
					});
					console.log(err);
				});
			console.log(11, this.free);
		}
	},
	components: {
		RenCalendar
	}
};
</script>

<style lang="scss">
page {
	background-color: #f2f2f2;
}
.title {
	margin-top: 36rpx;
	margin-bottom: 24rpx;
}
.seat {
	background: #fff;
	.seat-position {
		border-radius: 8rpx;
		display: flex;
		height: 82rpx;
		justify-content: space-between;
		align-items: center;
		color: #4f4f4f;
		margin: 0 20rpx;
	}
}
.content {
	.change {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		margin-top: 100rpx;
		height: 100rpx;
		color: #b89249;
		background-color: #21191b;
	}
}
.pay-btn {
	margin-top: 80rpx;
	width: 632rpx;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	background-color: #282828;
	color: #fff;
}
</style>
