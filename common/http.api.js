let loginurl = "web/index.php?_mall_id=1&r=api/passport/login"
//微信登录
let bindingurl = "web/index.php?_mall_id=1&r=api/phone/binding"
//绑定手机号
let shopListurl = "web/index.php?_mall_id=1&r=api/cat/list"
//商城分类
let shopGoods_listurl = "web/index.php?_mall_id=1&r=api/default/goods-list"
//商城分类下的商品列表
let shopDetailurl = "web/index.php?_mall_id=1&r=api/goods/detail"
//商城详情
let shopAddurl = "web/index.php?_mall_id=1&r=api/user/favorite-add"
//收藏商城商品
let shopGoodsurl = "web/index.php?_mall_id=1&r=api/user/my-favorite-goods"
//获取用户收藏的商城商品
let fishSeaturl = "web/index.php?_mall_id=1&r=api/fish-pond/fish-pond-seat"
//钓位列表
let order_submiturl = "web/index.php?_mall_id=1&r=api/order/goods-order-submit"
//商城商品下单
let agreementurl = "web/index.php?_mall_id=1&r=api/config/get-agreement&agreement_id=1"
//隐私协议
let get_fish_order_listurl = "web/index.php?_mall_id=1&r=api/order/get-fish-order-list"
//鱼塘订单列表
let orderListurl = "web/index.php?_mall_id=1&r=api/order/list"
//商城订单列表
let user_infourl = "web/index.php?_mall_id=1&r=api/user/user-info"
//获取用户信息
let sign_upurl = "web/index.php?_mall_id=1&r=api/order/get-sign-up-order-list"
//预约订单列表
let user_couponurl = "web/index.php?_mall_id=1&r=api/coupon/user-coupon"
//用户优惠劵列表
let discount_listurl = "web/index.php?_mall_id=1&r=api/coupon/get-coupon-discount-list"
//优惠活动列表
let fish_submiturl = "web/index.php?_mall_id=1&r=api/order/fish-order-submit"
//下单
let get_order_listurl = "web/index.php?_mall_id=1&r=api/order/get-order-list"
//员工端——鱼塘订单列表
let get_order_detailurl = "web/index.php?_mall_id=1&r=api/order/get-order-detail"
//员工端——鱼塘订单详情
let end_fish_orderurl = "web/index.php?_mall_id=1&r=api/order/end-fish-order"
//结束订单
let get_user_achievementurl = "web/index.php?_mall_id=1&r=api/order/get-user-achievement"
//用户成绩
let get_order_num_listurl = "web/index.php?_mall_id=1&r=api/order/get-order-num-list"
//员工端——获取未处理的单数
let user_fish_infourl = "web/index.php?_mall_id=1&r=api/user/user-fish-info"
//回鱼收入列表
let detailurl = "web/index.php?_mall_id=1&r=api/order/detail"
//员工端——商品订单详情
let goods_order_completeurl = "web/index.php?_mall_id=1&r=api/order/goods-order-complete"
//员工端——商品订单——确认处理
let pay_orderurl = "web/index.php?_mall_id=1&r=api/order/pay-order"
//商城直接付款/员工端确认收款
let edit_user_achievementurl = "web/index.php?_mall_id=1&r=api/order/edit-user-achievement"
// 修改用户成绩
let send_user_couponurl = "web/index.php?_mall_id=1&r=api/order/send-user-coupon"
// 员工端——赠送优惠卷
let shareurl = "web/index.php?_mall_id=1&r=api/qrcode/share"
// 生成绑定上下级的二维码
let userbindingurl = "web/index.php?_mall_id=1&r=api/user/binding"
// 绑定上下级




const install = (Vue, vm) => {
	// 此处没有使用传入的params参数
	let getBooksLista = (params = {}) => vm.$u.get('/api/Books/getBooksList', params);
	let getBooksList = (params = {}) => vm.$u.post('/api/Books/getBooksList', params);
	let login = (params = {}) => vm.$u.post(loginurl, params); //微信登录
	let binding = (params = {}) => vm.$u.post(bindingurl, params); //绑定手机号
	let shopList = (params = {}) => vm.$u.get(shopListurl, params); //商城分类
	let shopGoods_list = (params = {}) => vm.$u.get(shopGoods_listurl, params); //商城分类下的商品列表
	let shopDetail = (params = {}) => vm.$u.get(shopDetailurl, params); //商城详情
	let shopAdd = (params = {}) => vm.$u.get(shopAddurl, params); //收藏商城商品
	let shopGoods = (params = {}) => vm.$u.get(shopGoodsurl, params); //获取用户收藏的商城商品
	let fishSeat = (params = {}) => vm.$u.get(fishSeaturl, params); //钓位列表
	let order_submit = (params = {}) => vm.$u.post(order_submiturl, params); //商城商品下单
	let agreement = (params = {}) => vm.$u.get(agreementurl, params); //隐私协议
	let order_list = (params = {}) => vm.$u.post(get_fish_order_listurl, params); //鱼塘订单列表
	let orderList = (params = {}) => vm.$u.get(orderListurl, params); //商城订单列表
	let user_info = (params = {}) => vm.$u.get(user_infourl, params); //获取用户信息
	let sign_up = (params = {}) => vm.$u.post(sign_upurl, params); //预约订单列表
	let user_coupon = (params = {}) => vm.$u.get(user_couponurl, params); //用户优惠劵列表
	let discount_list = (params = {}) => vm.$u.get(discount_listurl, params); //优惠活动列表
	let fish_submit = (params = {}) => vm.$u.post(fish_submiturl, params); //下单
	let get_order_list = (params = {}) => vm.$u.post(get_order_listurl, params); //员工端——鱼塘订单列表
	let get_order_detail = (params = {}) => vm.$u.post(get_order_detailurl, params); //员工端——鱼塘订单详情
	let end_fish_order = (params = {}) => vm.$u.post(end_fish_orderurl, params); //结束订单
	let get_user_achievement = (params = {}) => vm.$u.post(get_user_achievementurl, params); //用户成绩
	let get_order_num_list = (params = {}) => vm.$u.get(get_order_num_listurl, params); //员工端——获取未处理的单数
	let user_fish_info = (params = {}) => vm.$u.get(user_fish_infourl, params); //回鱼收入列表
	let detail = (params = {}) => vm.$u.get(detailurl, params); //员工端——商品订单详情
	let goods_order_complete = (params = {}) => vm.$u.post(goods_order_completeurl, params); //员工端——商品订单——确认处理
	let pay_order = (params = {}) => vm.$u.post(pay_orderurl, params); //商城直接付款/员工端确认收款
	let edit_user_achievement = (params = {}) => vm.$u.post(edit_user_achievementurl, params); //修改用户成绩
	let send_user_coupon = (params = {}) => vm.$u.post(send_user_couponurl, params); //员工端——赠送优惠卷
	let share = (params = {}) => vm.$u.get(shareurl, params); //生成绑定上下级的二维码
	let userbinding = (params = {}) => vm.$u.get(userbindingurl, params); //绑定上下级


	// let getLogin = (params = {}) => vm.$u.post(login, {
	// 	//写配置好的参数
	// });

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		getBooksList,
		getBooksLista,
		login,
		binding,
		shopList,
		shopGoods_list,
		shopDetail,
		shopAdd,
		shopGoods,
		fishSeat,
		order_submit,
		agreement,
		order_list,
		orderList,
		user_info,
		sign_up,
		user_coupon,
		discount_list,
		fish_submit,
		get_order_list,
		get_order_detail,
		end_fish_order,
		get_user_achievement,
		get_order_num_list,
		user_fish_info,
		detail,
		goods_order_complete,
		pay_order,
		edit_user_achievement,
		send_user_coupon,
		share,
		userbinding
	};
}

export default {
	install
}
