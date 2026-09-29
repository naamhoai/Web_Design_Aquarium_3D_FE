import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Chèn Content-Security-Policy vào index.html khi build production:
 * chỉ cho chạy script của chính site, chỉ cho gọi API tới đúng API Gateway.
 * (Không áp dụng ở dev server vì React Fast Refresh cần script inline.)
 * Khi triển khai sau reverse proxy, nên gửi CSP bằng HTTP header (hỗ trợ thêm frame-ancestors).
 */
function contentSecurityPolicy(apiBaseUrl: string): Plugin {
  const apiOrigin = new URL(apiBaseUrl).origin
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob:",
    `connect-src 'self' ${apiOrigin}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
  return {
    name: 'aquarium-content-security-policy',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />\n    <meta name="referrer" content="strict-origin-when-cross-origin" />`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

  return {
    plugins: [react(), contentSecurityPolicy(apiBaseUrl)],
    // Ensure a single instance of three across app, R3F, drei and
    // postprocessing — avoids "Multiple instances of Three.js" and the
    // subtle instanceof breakage it causes with the effect composer.
    resolve: {
      dedupe: ['three', '@react-three/fiber'],
    },
    optimizeDeps: {
      include: ['three', 'postprocessing', '@react-three/postprocessing'],
    },
    build: {
      // Không phát hành source map ra production (tránh lộ mã nguồn gốc)
      sourcemap: false,
    },
  }
})
