<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="wrap-in">
			<u-form class="messageForm">
				<u-form-item
					class="item"
					label="鱼塘位置"
					:label-style="{ color: '#151817' }"
					:label-width="150"
					:border-bottom="false"
					right-icon="arrow-right"
					:right-icon-style="{ color: '#4f4f4f' }"
				>
					<u-input type="select" v-model="messageForm.location" placeholder="请选择鱼塘" @click="fishLocationShow = true" />
					<u-action-sheet :list="fish_pond" v-model="fishLocationShow" @click="selectFishLocationSheetCallback"></u-action-sheet>
				</u-form-item>
				<view style="width: 100%; height: 16rpx; background-color: #f7f7f8;"></view>

				<u-form-item
					class="item"
					label="钓位"
					:label-style="{ color: '#151817' }"
					:label-width="150"
					:border-bottom="false"
					right-icon="arrow-right"
					:right-icon-style="{ color: '#4f4f4f' }"
				>
					<u-input type="select" v-model="messageForm.fishNumber" placeholder="请选择钓位" @click="fishNumbrShow = true" />
					<!-- <u-action-sheet  :list="seat_id" v-model="fishNumbrShow" @click="selectFishNumberSheetCallback"></u-action-sheet> -->
					<u-modal v-model="fishNumbrShow" :show-title="false" mask-close-able="false" show-cancel-button="true" @confirm="selectFishNumberSheetCallback">
						<view v-if="decide==0?true:false" class="decide">请选择鱼塘</view>
						<scroll-view v-else scroll-y="true" style="height: 600rpx;">
							<view>
								<view
									:class="click_id == item.seat_id ? 'bouncing colorRed' : 'bouncing'"
									v-for="(item, index) in seat_id"
									@click="identification(item)"
									:id="item.id"
								>
									<view >{{ item.seat_id }}</view>
								</view>
							</view>
						</scroll-view>
					</u-modal>
				</u-form-item>
				<view style="width: 100%; height: 16rpx; background-color: #f7f7f8;"></view>

				<u-form-item class="last-item" label="留言备注" :label-style="{ color: '#151817' }" :label-width="150" :border-bottom="false" label-position="top">
					<u-input
						:custom-style="{ backgroundColor: '#fff', padding: '24rpx 20rpx' }"
						height="700"
						v-model="messageForm.markUp"
						type="textarea"
						placeholder="请输入你的想要说的话"
						:clearable="false"
					/>
				</u-form-item>

				<view class="subBtn"><u-button type="default" @click="handleMessage">确认</u-button></view>
			</u-form>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			decide:0,//判断选择鱼塘位置
			content: '东临碣石，以观沧海',
			fish_pond: [], //鱼塘列表
			seat_id: [], //钓位号
			get_fish_pond: '', //选择鱼塘id
			get_seat_id: '', //选择钓位号
			click_id: '', //点击id
			pool: [],
			labelStyle: {
				backgroundColor: '#fff',
				color: 'red'
			},
			messageForm: {
				location: '',
				fishNumber: [],
				markUp: ''
			},
			fishLocationShow: false,
			fishNumbrShow: false,
			fishNumbrSheetList: [
				{
					text: 1
				},
				{
					text: 2
				},
				{
					text: 3
				}
			],
			fishLocationSheetList: [
				{
					text: '鲤鱼塘'
				},
				{
					text: '综合塘'
				},
				{
					text: '鲢鱼塘'
				}
			]
		};
	},
	onLoad(options) {
		this.pondList();
	},
	methods: {
		//点击
		identification(item) {
			this.click_id = item.seat_id;
			this.get_seat_id = this.click_id;
			this.messageForm.fishNumber = item.seat_id;
			console.log(this.click_id);
		},
		//鱼塘列表
		pondList() {
			this.$u.api2
				.getPondList({ page: 1 })
				.then(res => {
					this.fish_pond = res.data.list;
					for (let i = 0; i < this.fish_pond.length; i++) {
						this.fish_pond[i].text = this.fish_pond[i].name;
					}
					console.log(this.fish_pond);
				})
				.catch(err => {
					console.log(err);
				});
		},
		//判断是否登录
		sLogin() {
			//游客模式
			if (this.token) {
				return false;
			} else {
				uni.navigateTo({
					url: '../login/login'
				});
				return true;
			}
		},

		selectFishLocationSheetCallback(index) {
			this.decide=1
			this.get_fish_pond = this.fish_pond[index].id;
			this.fishingPosition(this.fish_pond[index].id);
			this.messageForm.location = this.fish_pond[index].text;
		},
		//获取鱼塘钓位列表
		fishingPosition(index) {
			this.$u.api2
				.getFishingPosition({ id: index })
				.then(res => {
					this.seat_id = res.data;
					for (let i = 0; i < res.data.length; i++) {
						// this.seat_id[i].text = this.seat_id[i].id;
						this.seat_id[i].text = this.seat_id[i].seat_id;
					}
					this.messageForm.fishNumber = ' ';
					console.log(77, this.seat_id);
				})
				.catch(err => {
					console.log(err);
				});
		},
		selectFishNumberSheetCallback() {
			this.get_seat_id = this.click_id;
			this.messageForm.fishNumber = this.click_id;
			console.log(25442, index);
		},

		handleMessage() {
			if (this.sLogin()) {
				return;
			}
			if (this.messageForm.location == '') {
				this.$u.toast('请选择鱼塘位置');
				return;
			}
			if (this.messageForm.fishNumber == '') {
				this.$u.toast('请选择钓位');
				return;
			}
			if (this.messageForm.markUp == '') {
				this.$u.toast('请输入留言内容');
				return;
			}

			this.$u.api2
				.getMessage({ fish_pond_id: this.get_fish_pond, fish_pond_seat_id: this.get_seat_id, message: this.messageForm.markUp })
				.then(res => {
					console.log(res);
					this.$refs.uToast.show({
						title: res.msg,
						duration: 500
					});
				})
				.catch(err => {
					this.$refs.uToast.show({
						title: err.msg,
						duration: 500
					});
					console.log(err);
				});
			this.messageForm = {
				location: '',
				fishNumber: '',
				markUp: ''
			};
		}
	}
};
</script>

<style lang="scss">
	.decide{
		    text-align: center;
	}
page {
	background-color: #f7f7f8;
}
.bouncing {
	text-align: center;
	height: 74rpx;
}
.colorRed {
	color: red;
}
.wrap {
	width: 100%;
	background-color: #f7f7f8;

	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 40rpx auto;

		.messageForm {
			.item .u-input__right-icon {
				display: none;
			}

			.item > .u-form-item {
				padding-left: 10rpx;
				padding-right: 10rpx;

				border-radius: 8rpx;
				background-color: #fff;
			}

			.last-item > .u-form-item {
				background-color: #f7f7f8;
			}

			.subBtn {
				margin-top: 40rpx;

				button {
					background-color: #282828;
					color: #fff;
					width: 634rpx;
					height: 90rpx;
					border-radius: 45rpx;
				}
			}
		}
	}
}
</style>
