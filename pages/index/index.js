avalon.config({debug: false})

const appBody = document.querySelector('.app-body')
const {ipcRenderer} = require('electron')
const DyServer = require('dy-server2')
const {exec} = require('child_process')
const package = require('../../package')
let winId = 0;

let server = null

const vm = avalon.define({
    $id: 'app',
    directory: '',
    version: package.version,
    isRun: false,
    isTop: false,
    port: '',
    loading: false,
    addr: '',
    topToggle () {
        this.isTop = !this.isTop
        ipcRenderer.send('top-toggle', this.isTop, winId)
    },
    minimize () {
        ipcRenderer.send('main-win-minimize', winId)
    },
    close () {
        ipcRenderer.send('main-win-close', winId)
    },
    newServer () {
        ipcRenderer.send('new-server', winId)
    },
    about () {
        let result = ''
        result += '版本信息：version ' + this.version + '\n\n'
        result += 'dy-server-ui是基于静态资源服务器dy-server的界面化工具\n\n'
        result += 'github地址：https://github.com/RilyZhang/dy-server-ui\n\n'
        result += 'dy-server github地址：https://github.com/RilyZhang/dy-server\n\n'
        alert(result)
    },
    openBrowser () {
        if (!this.addr) {
            alert('服务器未启动')
            return
        }
        let opener = process.platform === 'win32' ? 'start' : 'open';
        opener = `${opener} ${this.addr}`;
        exec(opener);
    },
    serverRun () {
        if (!this.directory || this.isRun) return
        this.loading = true
        const conf = {
            port: this.port || 8080,
            directory: this.directory.replace(/\\+/g, '/') + '/',
        }
        server = new DyServer(conf)
        server.listen()
        server.on('started', addr => {
            this.isRun = !this.isRun
            this.loading = false
            this.addr = addr
            this.port = addr.split(':')[2] || '80'
        })
    },
    serverStop () {
        if (!this.directory || !this.isRun) return
        this.loading = true
        server.close().then(() => {
            this.isRun = !this.isRun
            this.loading = false
            this.addr = ''
        })
    },
});

var dir = document.querySelector('#directory')

dir.addEventListener('change', e => {
    if (e.target.files[0]) {
        vm.directory = e.target.files[0].path
    }
})

ipcRenderer.on('window-created', (e, id) => {
    winId = id
})

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        ipcRenderer.send('page-ready')
    }
}
