const target_tauri =  false
const base_api = "https://192.168.31.51:8001"
export const api_proxy_addr = base_api
export const img_proxy_addr = "https://192.168.31.51:9000"
export const dest_api =  `${api_proxy_addr}/api`
export const dest_root = (target_tauri) ? "" : "/Solar_Farm_Calculation_Frontend/"

