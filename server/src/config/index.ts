import path from "path";

export default {
  server: {
    apiContextPath: '/api',
    hostname: '0.0.0.0',
    port: 8080,
    staticFolderPath: '../../../app/build',
    indexFile: '/index.html',
    swaggerApiPath: path.join(__dirname, "../../api.yaml"),
    swaggerContextPath: "/swagger",
    uploadDir: process.env.USER_UPLAODS_DIR || path.join(__dirname, `../../uploads`)
  },
  origin: 'http://localhost:3000',
  loggerOptions: {
    fileOptions: {
      maxsize: 100000000,
      maxFiles: 7,
      filename: process.env.LOGFILE || 'logs/app.log'
    },
    timeStampFormat: 'YYYY-MM-DD HH:mm:ss:ms',
    excludeUrlsFromLogger: ['/health-check']
  }
}
