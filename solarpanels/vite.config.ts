import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'
import {api_proxy_addr} from "./src/target_config"
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  server: {port:3000,
    host:true,
    proxy:{
      "/api" :{
        target: api_proxy_addr,
        changeOrigin:true,   
      }
    },
    https:{
      key:fs.readFileSync(path.resolve(__dirname,'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname,'cert.crt'))
    }
  },
  plugins: [react(),
    VitePWA({registerType: 'autoUpdate',
      devOptions:{
        enabled:true,
      },
      manifest:{
        "name": "SolarPanels",
        "short_name": "SolarPanels",
        "start_url": "/RIP_Frontend/",
        "display": "standalone",
        "background_color": "#fdfdfd",
        "theme_color": "#fdfdfd",
        "orientation": "portrait-primary",
        "icons": [
          {
            "src": "/default.png",
            "type": "image/png", "sizes": "192x192"
          }
          
        ]
      }
    }),
    mkcert()
  ],
   base: "/" 
  // "/RIP_Frontend/"
})
