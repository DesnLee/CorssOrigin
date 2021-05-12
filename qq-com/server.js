let http = require('http')
let fs = require('fs')
let url = require('url')
let port = process.argv[2]

if (!port) {
    console.log('请指定端口号! 像这样 node server.js 8888')
    process.exit(1)
}

let server = http.createServer(function (request, response) {
    let parsedUrl = url.parse(request.url, true)
    let pathWithQuery = request.url
    let queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }
    let path = parsedUrl.pathname
    let query = parsedUrl.query
    let method = request.method
    /******** 从这里开始看，上面不要看 ************/

    console.log('有个人摸了一下 ' + pathWithQuery + ' 这个地方')

    if (path === '/') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(fs.readFileSync(`public/index.html`))
        response.end()
    } else if (path === '/qq.js') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(fs.readFileSync(`public/qq.js`))
        response.end()
    } else if (path === '/friends.json') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'application/json;charset=utf-8')
        response.setHeader('Access-Control-Allow-Origin', 'http://desnlee.com:9999')
        response.write(fs.readFileSync(`public/friends.json`))
        response.end()
    } else if (path === '/friends.js') {
        if (request.headers["referer"].indexOf('http://desnlee.com:9999') === 0){
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
            const string = `window['{{xxx}}']({{data}}) `
            const data = fs.readFileSync(`public/friends.json`).toString()
            const string2 = string.replace(`{{xxx}}`, query.callback).replace(`{{data}}`, data)
            response.write(string2)
            response.end()
        } else {
            response.statusCode = 404
            response.end()
        }
    }


    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('node已经在 ' + port + ' 端口启动成功！访问地址: http://localhost:' + port)







