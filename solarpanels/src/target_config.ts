const target_tauri =  false
const base_api = "http://localhost:8001"
export const api_proxy_addr = (target_tauri) ? `${base_api}/api`: base_api
export const img_proxy_addr = "http://localhost:9000"
export const dest_api = (target_tauri) ? api_proxy_addr : "api"
export const dest_root = (target_tauri) ? "" : "/"

