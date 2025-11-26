const target_tauri =  true
const base_api = "http://10.244.198.50:8001"
export const api_proxy_addr = (target_tauri) ? `${base_api}/api`: base_api
export const img_proxy_addr = "http://10.244.198.50:9000"
export const dest_api = (target_tauri) ? api_proxy_addr : "api"
export const dest_root = (target_tauri) ? "" : "/"

