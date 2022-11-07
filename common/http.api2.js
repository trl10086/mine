let shouYelunbo = "/web/index.php?_mall_id=1&r=api/index/tpl-index" //首页轮图API
let rankingList = '/web/index.php?_mall_id=1&r=api/fish-pond/get-ranking-list' //获取动态排行榜API
let notice = '/web/index.php?_mall_id=1&r=api/setting/notice' //公告列表API
let pondList = '/web/index.php?_mall_id=1&r=api/fish-pond/fish-list' //鱼塘列表API
let reservoirDetails = '/web/index.php?_mall_id=1&r=api/fish-pond/fish-detail' //鱼塘详情
let renew = '/web/index.php?_mall_id=1&r=api/order/check-order-renew' //判断是否可续费API
let check = '/web/index.php?_mall_id=1&r=api/order/fish-order-submit' //下单API
let endUrl = '/web/index.php?_mall_id=1&r=api/order/end-fish-order' //结束订单API
let exchangeUrl = '/web/index.php?_mall_id=1&r=api/order/change-fish-pond-seat' //更换钓位API
let CompetitionUrl = '/web/index.php?_mall_id=1&r=api/match/match-list' //比赛列表API
let activityUrl = '/web/index.php?_mall_id=1&r=api/match/activity-list' //活动列表API
let subscribeUrl = '/web/index.php?_mall_id=1&r=api/sign-up/sign-up' //活动报名 	API
let fishingPositionUrl = 'web/index.php?_mall_id=1&r=api/fish-pond/fish-pond-seat'  //获取鱼塘钓位列表 API
let messageUrl = '/web/index.php?_mall_id=1&r=api/leave-message/leave-message' //创建留言API
let commodityOrderUrl ="/web/index.php?_mall_id=1&r=api/order/list&status=" //获取商城商品订单列表API
let  Fish_pond_order_url= '/web/index.php?_mall_id=1&r=api/order/get-fish-order-list' //获取鱼塘订单列表API
let  cancelUrl= "/web/index.php?_mall_id=1&r=api/order/cancel-order" //取消订单API
let  reservationOrderUrl='/web/index.php?_mall_id=1&r=api/order/get-sign-up-order-list' //获取预约订单列表API

let   retainUrl= '/web/index.php?_mall_id=1&r=api/leave-message/leave-message-list'//留言列表API
let  oralMessageUrl='/web/index.php?_mall_id=1&r=api/leave-message/detail' //留言详情API
let  handleUrl='/web/index.php?_mall_id=1&r=api/leave-message/handle-message'//处理留言API
let  enrollUrl = '/web/index.php?_mall_id=1&r=api/match/sign-up-list' //活动报名列表API
let  yaoHaoUrl='/web/index.php?_mall_id=1&r=api/match/yao-hao'//开启摇号API
let  galtUrl ='/web/index.php?_mall_id=1&r=api/match/end'//停止摇号API
let  scaleUrl = '/web/index.php?_mall_id=1&r=api/match/weight' //用户输入活动中钓鱼的重量API
let  ranking= '/web/index.php?_mall_id=1&r=api/match/rank-list' //排行榜API
let   vanishUrl='/web/index.php?_mall_id=1&r=api/user/favorite-remove' //取消收藏

let  merchandiseBuyURL='/web/index.php?_mall_id=1&r=api/order/pay-order' //订单下单
let  wxPaymentTwoURL = '/web/index.php?_mall_id=1&r=api/order/pay-data'//订单——微信支付—第二步
let  wxPaymentThreeURL = '/web/index.php?_mall_id=1&r=api/payment/get-payments'//订单——微信支付—第三步
let  wxPaymentFourURL = '/web/index.php?_mall_id=1&r=api/payment/pay-data'//订单——微信支付—第四步
let  wxPaymentGiveURL ='/web/index.php?_mall_id=1&r=api/order/list-pay-data' //订单列表 未付款订单微信支付
let  getCouponsURL='/web/index.php?_mall_id=1&r=api/coupon/get-coupon-discount-list'//优惠卷-获取优惠活动列表
let  previousRankingURL='/web/index.php?_mall_id=1&r=api/fish-pond/get-now-ranking-list'//首页-获取当前已结束活动排行榜
//二开
let  fishReleaseRecord='/web/index.php?_mall_id=1&r=api/fish-pond/get-put-fish-list' //首页-获取放鱼记录
let  configurationURL='/web/index.php?_mall_id=1&r=api/config/get-config-list' //配置-获取常用配置列表
let   goAwayURL= '/web/index.php?_mall_id=1&r=api/fish-pond/put-fish'//员工端-放鱼
let  orderManagementURL='/web/index.php?_mall_id=1&r=api/order/get-order-administration-list' //员工段-获取订单管理列表
let  OrderRevenueURL='/web/index.php?_mall_id=1&r=api/order/get-profit-list' //员工端——获取订单收益列表
let  discountURL='/web/index.php?_mall_id=1&r=api/coupon/get-user-list' //员工端——获取优惠劵中心列表


const install = (Vue, vm) => {
    let getShouYelunbo = (params = {}) => vm.$u.get(shouYelunbo, params) //首页轮图API
    let getrankingList = (params = {}) => vm.$u.post(rankingList, params) //获取动态排行榜API
    let getPondList = (params = {}) => vm.$u.get(pondList, params) //鱼塘列表API
    let getNotice = (params = {}) => vm.$u.get(notice, params) //公告列表API
    let getReservoirDetails = (params = {}) => vm.$u.get(reservoirDetails, params) //鱼塘详情
    let getRenew = (params = {}) => vm.$u.post(renew, params) ////判断是否可续费API
    let getCheck = (params = {}) => vm.$u.post(check, params) //下单API
    let getEnd = (params = {}) => vm.$u.post(endUrl, params) //结束订单API
    let getExchange = (params = {}) => vm.$u.post(exchangeUrl, params) //更换钓位
    let getCompetition = (params = {}) => vm.$u.get(CompetitionUrl, params) //比赛列表API
    let getActivity = (params = {}) => vm.$u.get(activityUrl, params) //活动列表API
    let getSubscribe = (params = {}) => vm.$u.post(subscribeUrl, params) //活动报名
	let getFishingPosition = (params ={})=>vm.$u.get(fishingPositionUrl,params)//获取鱼塘钓位列表 API
	let getMessage = (params ={})=>vm.$u.post(messageUrl,params) //创建留言API
	let getCommodityOrder = (params ={})=>vm.$u.get(commodityOrderUrl,params)  //获取商城商品订单列表API
	let get_Fish_pond_order = (params ={})=>vm.$u.post(Fish_pond_order_url,params)  //获取鱼塘订单列表API
	let getCancel = (params ={})=>vm.$u.post(cancelUrl,params)  //取消订单API
	let getReservationOrder = (params ={})=>vm.$u.post(reservationOrderUrl,params) //获取预约订单列表API
	let getRetain = (params ={})=>vm.$u.get(retainUrl,params) //留言列表API
	let getOralMessage = (params = {})=>vm.$u.get(oralMessageUrl,params)//留言详情API
	let getHandle = (params ={})=>vm.$u.get(handleUrl,params)//处理留言API
	let getEnroll= (params ={})=>vm.$u.get(enrollUrl,params)//活动报名列表API
	let getYaoHao = (params ={})=>vm.$u.post(yaoHaoUrl,params)//开启摇号API
	let getGaltUrl = (params ={})=>vm.$u.post(galtUrl,params)//停止摇号API
	let getScale  = (params ={})=>vm.$u.post(scaleUrl,params)//用户输入活动中钓鱼的重量API
	let getRanking = (params ={})=>vm.$u.get(ranking,params)//排行榜API
	let getVanish = (params ={})=>vm.$u.get(vanishUrl,params)//取消收藏
	let getCoupons = (params ={})=>vm.$u.get(getCouponsURL,params)//优惠卷-获取优惠活动列表
	let getFishReleaseRecord = (params ={})=>vm.$u.post(fishReleaseRecord,params)//首页-获取放鱼记录
	let getconfiguration = (params ={})=>vm.$u.post(configurationURL,params)//首页-获取放鱼记录
	let getGoAway = (params ={})=>vm.$u.post(goAwayURL,params)//员工端-放鱼
	let getOrderManagement = (params ={})=>vm.$u.post(orderManagementURL,params)//员工段-获取订单管理列表
	let getorderRevenue = (params ={})=>vm.$u.post(OrderRevenueURL,params)//员工端——获取订单收益列表
	let getDiscount = (params ={})=>vm.$u.post(discountURL,params)//员工端——获取订单收益列表
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	let getMerchandiseBuy = (params ={})=>vm.$u.post(merchandiseBuyURL,params)//订单下单
	let getWxPaymentTwo = (params ={})=>vm.$u.post(wxPaymentTwoURL,params)//订单——微信支付—第二步
	let getWxPaymentThree = (params ={})=>vm.$u.get(wxPaymentThreeURL,params)//订单——微信支付—第三步
	let getWxPaymentFour = (params ={})=>vm.$u.get(wxPaymentFourURL,params)//订单——微信支付—第四步
	let getWxPaymentGive = (params ={})=>vm.$u.get(wxPaymentGiveURL,params)//订单——微信支付—第四步
	let getPreviousRanking = (params ={})=>vm.$u.post(previousRankingURL,params)//首页-获取当前已结束活动排行榜
	
	
	
        // 房车租赁详情api
        // let a = (params = {}) => vm.$u.get(a, params)

    // 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
    vm.$u.api2 = {
        getShouYelunbo,
        getrankingList,
        getNotice,
        getPondList,
        getCheck,
        getRenew,
        getReservoirDetails,
        getEnd,
        getExchange,
        getCompetition,
        getActivity,
        getSubscribe,
		getFishingPosition,
		getMessage,
		getCommodityOrder,
		get_Fish_pond_order,
		getCancel,
		getReservationOrder,
		getRetain,
		getOralMessage,
		getHandle,
		getEnroll,
		getYaoHao,
		getGaltUrl,
		getScale,
		getRanking,
		getVanish,
		getMerchandiseBuy,
		getWxPaymentTwo,
		getWxPaymentThree,
		getWxPaymentFour,
		getWxPaymentGive,
		getCoupons,
		getPreviousRanking,
		getFishReleaseRecord,
		getconfiguration,
		getGoAway,
		getOrderManagement,
		getorderRevenue,
		getDiscount
    };

}

export default {
    install
}