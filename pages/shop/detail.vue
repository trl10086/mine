<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="goods-info">
			<u-swiper :list="datalist.pic_url" name="pic_url" height="508" width="100%"></u-swiper>
			<view class="info">
				<view class="title">{{ datalist.name }}</view>
				<view class="short-title">{{ datalist.subtitle }}</view>
				<view class="price">
					<text class="bt">¥</text>
					<text class="number">{{ datalist.price }}元</text>
				</view>
			</view>
		</view>
		<view class="sku goods-info">
			<u-cell-group><u-cell-item title="选择规格" @click="skuHandler"></u-cell-item></u-cell-group>
		</view>
		<view class="descp">
			<u-cell-group :border="false"><u-cell-item :border-bottom="false" :arrow="false" title="商品详情"></u-cell-item></u-cell-group>
			<view class="details"><u-parse :html="datalist.detail"></u-parse></view>
		</view>
		<view class="footer">
			<view v-if="datalist.is_favorite != 1" class="fav-icon" @click="shopAdd"></view>
			<view v-else @click="vanish(datalist.id)" class="fav-icon selected"></view>
			<button class="sub" @click="skuHandler">立即购买</button>
		</view>
		<u-popup 
		v-model="showPopup" 
		mode="bottom" 
		:safe-area-inset-bottom="true" 
		border-radius="20" 
		:closeable="true">
			<view class="sku-select">
				<!-- 1. 商品简介 -->
				<view class="short-cut">
					<view class="cover">
						<u-image width="232" height="232" 
						border-radius="8" :src="datalist.cover_pic">
						</u-image>
						</view>

					<view class="info">
						<view class="title">{{ datalist.name }}</view>
						<view class="price">
							<text class="bt">¥</text>
							<text class="number">{{ price }}元</text>
						</view>
					</view>
				</view>

				<!-- 2. sku 列表 -->
				<view class="list">
					<view class="item" v-for="(item, index) in datalist.attr_groups" :key="index">
						<view class="title">{{ item.attr_group_name }}</view>
						<view class="tags">
							<view class="tag" @click="clcik(item1, index)" v-for="(item1, index1) in item.attr_list" :key="index1" :class="{ active: item1.attr_id == arr[index] }">
								<text>{{ item1.attr_name }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 3. 购买数量 -->
				<view class="buy-counter">
					<text>数量</text>
					<u-number-box v-model="goodsNumber"></u-number-box>
				</view>

				<!-- 4. 立即购买 -->
				<button class="sub" @click="orderHandler">立即购买</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showPopup: false,
			//数量
			goodsNumber: 1,
			//商品详情
			datalist: '',
			arr: [],
			//规格价钱
			price: '',
			//规格
			guiGe: [],
			eid: ''
		};
	},
	onLoad(e) {
		this.eid = e.id;
		this.shopDetail(e.id);
	},
	methods: {
		// 商品详情
		shopDetail(id) {
			console.log(111)
			let self = this;
			self.$u.api
				.shopDetail({
					id
				})
				.then(res => {
					self.datalist = res.data.goods;
					self.datalist.attr_groups.forEach(item => {
						self.arr.push(item.attr_list[0].attr_id);
						self.guiGe.push(item.attr_list[0].attr_name);
					});
					// for(let i = 0;i < this.arr.length; i++){
					// 	this.guiGe.push('')
					// }
					// for (var i = 0; i < self.datalist.attr_groups.length; i++) {
					// 	self.arr.push("")
					// }
				});
		},
		skuHandler() {
			const dats = this.arr.join(':');
			this.datalist.attr.forEach(item => {
				if (item.sign_id == dats) {
					this.price = item.price;
				}
			});
			this.showPopup = true;
		},
		//跳到支付页
		orderHandler() {
			// if (this.arr.every(item => {
			// 		return item != ''
			// 	})) {
			const dats = this.arr.join(':');
			this.datalist.attr.forEach(item => {
				if (item.sign_id == dats) {
					const list = {};
					list.img = this.datalist.pic_url[0].pic_url;
					list.name = this.datalist.name;
					list.guiGe = this.guiGe.join('/');
					list.price = this.price;
					list.id = this.datalist.id;
					list.attr_id = item.id;
					list.num = this.goodsNumber;
					console.log(888,list)
					uni.navigateTo({
						url: './order?list=' + JSON.stringify(list)
					});
				}
				
			});
			// } else {
			// 	this.$refs.uToast.show({
			// 		title: '请完整选择规格',
			// 		type: 'default',
			// 	})
			// }
		},
		clcik(item1, index) {
			this.arr[index] = item1.attr_id;
			this.guiGe[index] = item1.attr_name;
			const dats = this.arr.join(':');
			this.datalist.attr.forEach(item => {
				if (item.sign_id == dats) {
					this.price = item.price;
				}
			});
			this.$forceUpdate();
		},
		//取消收藏
		vanish(id) {
			console.log(this.datalist)
			let self = this;
			self.$u.api2
				.getVanish({goods_id:id})
				.then(res => {
					this.$refs.uToast.show({
						title: res.msg,
						type: 'success'
					});
					console.log(44)
					self.shopDetail(self.eid);
				})
				.catch(err => {
					this.$refs.uToast.show({
						title: err.msg,
						type: 'default'
					});
					console.log(555)
					self.shopDetail(self.eid);
				});
		},
		//收藏
		shopAdd() {
			let self = this;
			self.$u.api
				.shopAdd({
					goods_id: self.datalist.id
				})
				.then(res => {
					this.$refs.uToast.show({
						title: res.msg,
						type: 'success'
					});
					self.shopDetail(self.eid);
				})
				.catch(err => {
					this.$refs.uToast.show({
						title: err.msg,
						type: 'default'
					});
					self.shopDetail(self.eid);
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f7f7f8;
}

.wrap {
	padding-bottom: 70rpx;
}

.goods-info {
	background-color: #fff;
	margin-bottom: 20rpx;

	.info {
		padding: 10rpx;

		.title {
			line-height: 1.8;
			color: #1a1b1d;
		}

		.short-title {
			line-height: 1.6;
			color: #7b7b7b;
		}

		.price {
			color: #f38b11;

			.bt {
				font-size: 24rpx;
			}

			.number {
				font-size: 30rpx;
			}
		}
	}
}

.descp {
	background-color: #fff;
	padding-bottom: 70rpx;

	.details {
		padding: 20rpx;
	}
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0rpx;
	width: 100%;
	padding: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fff;

	.fav-icon {
		width: 48rpx;
		height: 48rpx;
		margin-right: 30rpx;
		background: url(../../static/images/no-fav-icon.png) no-repeat center #fff;
		background-size: 48rpx 48rpx;

		&.selected {
			background: url(../../static/images/fav-icon.png) no-repeat center #fff;
			background-size: 48rpx 48rpx;
		}
	}

	.sub {
		width: 580rpx;
		height: 72rpx;
		line-height: 72rpx;
		border-radius: 36rpx;
		background-color: #282828;
		color: #fff;
		font-size: 32rpx;
	}
}

.sku-select {
	padding: 20rpx 60rpx 20rpx 20rpx;

	.short-cut {
		display: flex;

		.cover {
			margin-right: 38rpx;
		}

		.info {
			.title {
				color: #1a1b1d;
				font-size: 28rpx;
				line-height: 44rpx;
			}

			.price {
				color: #f38b10;

				.bt {
					font-size: 24rpx;
				}

				.number {
				}
			}
		}
	}

	.list {
		.item {
			font-size: 32rpx;
			color: #1a1b1d;

			.title {
				margin-top: 78rpx;
				margin-bottom: 16rpx;
			}

			.tags {
				display: flex;

				.tag {
					height: 68rpx;
					line-height: 68rpx;
					border-radius: 8rpx;
					padding: 0 40rpx;
					background-color: #f1f1f1;
					color: #1a1b1d;
					font-size: 28rpx;
					margin-right: 16rpx;
					margin-bottom: 16rpx;
					overflow: hidden;

					&.active {
						background-color: #5d7291;
						color: #fff;
					}
				}
			}
		}
	}

	.buy-counter {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		color: #1a1b1d;
		margin-top: 60rpx;
		margin-bottom: 104rpx;
	}

	.sub {
		width: 632rpx;
		height: 72rpx;
		line-height: 72rpx;
		border-radius: 36rpx;
		background-color: #282828;
		color: #fff;
	}
}
</style>
