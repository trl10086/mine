<template>
	<view class="wrap">
		<view class="activity-info" style=" background: url(https://0042.cxycoder.com/web/uploads/thumbs/mall1/20211204/095ce6b412ad743f7196156223d70201.png) no-repeat #01174a;">
			<view class="h-title">钓鱼场活动重磅来袭</view>
			<view class="conver"><u-image width="100%" height="344" :src="fishPond[0].url"></u-image></view>
			<view class="descp">
				<view class="info">
					{{PondList[index].match[0].match_detail}}
				</view>

			</view>
			<view class="location">
				地点：{{PondList[index].match[0].address}}
				<text>（本次活动开放{{PondList[index].seat_num}}个钓位！）</text>
			</view>
			<view class="footer">
				<view class="date">时间：{{PondList[index].match[0].created_at}}</view>
				<view class="price">本次活动金额：{{PondList[index].price}}元</view>
			</view>
			<u-image width="100%" height="344" :src="fishPond[0].url"></u-image>
		</view>

		<view class="wrap-in">
			<view class="activity-form">
				<view class="title">预约登记</view>
				<view class="u-input username">
					<view class="label">
						姓名
						<text>*</text>
					</view>
					<u-input v-model="nature" :type="type" :border="true" placeholder="请输入姓名" />
				</view>
				<view class="u-input">
					<view class="label">
						手机号
						<text>*</text>
					</view>
					<u-input v-model="phone" :type="type" :border="true" placeholder="请输入手机号" />
				</view>
				<view class="notice">
					注意：
					<text class="info">用户可摇签抽号，由工作人员开发钓位数量，预约成功后不可更改钓位，预付成功后不可退款。</text>
				</view>
				<div class="sub-wrap" @click="subscribe"><button class="sub">立即付款预约</button></div>
				<view><u-toast ref="uToast" /></view>
			</view>
		</view>
		<view>
			<u-popup v-model="show" mode="center" border-radius="8" @close="backflow">
				<view class="eject">
					<view>预约成功</view>
					<view>等待工作人员抽签放号</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			title: '预约成功',
			content: '等待工作人员抽签放号',
			match_id: '',
			activity_id: '',
			fish_pond_id: '',
			nature: '',
			phone: '',
			s_id:'',//鱼塘id
			PondList:[],
			fishPond:[],
			zf_list:{},
			index:'',
		};
	},
	onLoad(res) {
		this.match_id = res.match_id;
		this.activity_id = res.activity_id;
		this.fish_pond_id = res.fish_pond_id;
		this.s_id = res.s_id
		this.index=res.index
		this.activityList()
		console.log(res)
	},
	methods: {
		//付款后返回上一级
		backflow(){
			uni.navigateBack({
			    delta: 1
			});
		},
		//活动报名列表API
		activityList() {
			let self=this
		  this.$u.api2
		    .getActivity({
				id:this.s_id,
		      page: 1,
		      limit: 10,
		    })
		    .then((res) => {
		      this.PondList = res.data.list;
			  this.fishPond = JSON.parse(res.data.list[self.index].match[0].pic_url);
		      console.log(1154,this.PondList);
		      for (var i = 0; i < this.PondList.length; i++) {
		        this.PondList[i].imgs = JSON.parse(
		          this.PondList[i].fishPond.pic_url
		        );
		      }
		    })
		    .catch((err) => {
		      console.log(err);
		    });
		},
		//点击付款预约
		subscribe() {
			let self=this
			if (/^s*$/.test(this.nature) || /^s*$/.test(this.phone)) {
				console.log(/^s*$/.test(this.nature));
				this.$refs.uToast.show({
					title: '姓名没填或手机号有误'
				});
			} else if (this.$u.test.mobile(this.phone) == false) {
				this.$refs.uToast.show({
					title: '手机号不正确'
				});
			} else {
				this.$u.api2
					.getSubscribe({
						match_id: this.match_id,
						activity_id: this.activity_id,
						fish_pond_id: this.fish_pond_id,
						name: this.nature,
						mobile: this.phone
					})
					.then(res => {
						console.log(451,res)
							// self.queue_id = res.data.list.queue_id;
							// self.token = res.data.list.token;
							self.zf_list = res.data;
							self.WxPaymentTwo();
					})
					.catch(err => {
						console.log(11,err);
						this.$refs.uToast.show({
							title: err.msg
						});
					});
			}
		},
		//微信支付第二部
		WxPaymentTwo() {
			let self = this;
			console.log(2,self.zf_lis);
			self.$u.api2
				.getWxPaymentTwo(self.zf_list)
				.then(res => {
					console.log(244, res.data.retry,res.data.retry==1);
					if(res.data.retry){
						self.WxPaymentTwo()
						console.log(111)
					}else{
						self.wxTow_id = res.data.id;
						console.log(2, res);
						self.wxPaymentThree();
					}
				})
				.catch(err => {
					console.log(154,err);
				});
		},
		//微信支付第三步
		wxPaymentThree() {
			console.log(3);
			let self = this;
			self.$u.api2
				.getWxPaymentThree({ id: self.wxTow_id })
				.then(res => {
					self.pay_type = res.data.list[0].key;
					console.log(3, res.data.list[0].key);
					self.wxPaymentFour();
				})
				.catch(err => {
					console.log(15694,err);
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
								self.show = true;
								 self.match_id='',
								 self.activity_id='',
								 self.fish_pond_id='',
								 self.nature='',
								 self.phone='',
								// console.log(res);
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
		}
	}
};
</script>

<style lang="scss" scoped>
	.eject{
		display: block;
		background-color: #000000;
		border: 1 solid #000000;
		color: #FFFFFF;
		font-size: 32rpx;
		padding-top: 48rpx;
		text-align: center;
		opacity: 0.8;
		width: 576rpx;
		height: 182rpx;
	}
.wrap {
	.activity-info {
		background-size: 750rpx 1574rpx;

		padding: 26rpx 24rpx;
		color: #fff;

		.h-title {
			font-size: 40rpx;
			text-align: center;
			margin-bottom: 34rpx;
		}
		.conver {
			margin-bottom: 32rpx;
		}
		.descp {
			.info {
				font-size: 28rpx;
				line-height: 36rpx;
				margin-bottom: 16rpx;
				text-indent: 2em;
			}
		}
		.location {
			font-size: 32rpx;
			margin-bottom: 8rpx;
			text {
				font-size: 28rpx;
			}
		}
		.footer {
			font-size: 28rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 16rpx;
			.date {
			}
			.price {
				color: #ff0c0c;
			}
		}
	}

	.wrap-in {
		width: 750rpx - 24 * 2;
		margin: 0 auto;

		.activity-form {
			.title {
				font-size: 36rpx;
				color: #1a1b1d;
				border-bottom: 2px solid #c2c2c2;
				padding-bottom: 28rpx;
				padding-top: 28rpx;
				margin-bottom: 32rpx;
			}
			.username {
				margin-bottom: 32rpx;
			}
			.u-input {
				.label {
					font-size: 32rpx;
					color: #1a1b1d;
					margin-bottom: 20rpx;

					text {
						color: #cf1e25;
					}
				}
			}

			.notice {
				color: #1a1b1d;
				font-size: 28rpx;
				font-weight: 500;
				border-bottom: 2rpx solid #d8d8d8;

				margin-top: 28rpx;
				margin-bottom: 16rpx;
				padding-bottom: 48rpx;

				.info {
					font-size: 24rpx;
					color: #424242;
					line-height: 44rpx;
				}
			}
			.sub-wrap {
				padding-bottom: 32rpx;
				.sub {
					width: 632rpx;
					height: 72rpx;
					line-height: 72rpx;
					border-radius: 36rpx;
					background-color: #282828;
					color: #fff;
					font-size: 32rpx;
					margin-top: 16rpx;
				}
			}
		}
	}
}
</style>
