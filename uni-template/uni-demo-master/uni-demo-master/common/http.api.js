

const install = (Vue, vm) => {
	// 此处没有使用传入的params参数
	let getBooksLista = (params = {}) => vm.$u.get('/api/Books/getBooksList', params);
	let getBooksList = (params = {}) => vm.$u.post('/api/Books/getBooksList', params);
	
	// let getLogin = (params = {}) => vm.$u.post(login, {
	// 	//写配置好的参数
	// });
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {getBooksList,getBooksLista};
}

export default {
	install
}