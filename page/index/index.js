const {ipcRenderer} = require('electron')
const DyServer = require('dy-server2')
const package = require('../../package')

let server = null

const vm = avalon.define({
    $id: 'app',
    directory: '',
    version: package.version,
    isRun: false,
    port: '',
    loading: false,
    minimize () {
        ipcRenderer.send('main-win-minimize')
    },
    close () {
        ipcRenderer.send('main-win-close')
    },
    serverRun () {
        if (!this.directory || this.isRun) return
        this.loading = true
        const conf = {
            port: this.port || 8080,
            directory: this.directory,
        }
        server = new DyServer(conf)
        server.listen()
        server.on('started', () => {
            this.isRun = !this.isRun
            this.loading = false
        })
    },

    serverStop () {
        if (!this.directory || !this.isRun) return
        this.loading = true
        server.close().then(() => {
            this.isRun = !this.isRun
            this.loading = false
        })
    },
});

var dir = document.querySelector('#directory')
dir.addEventListener('change', e => {
    vm.directory = e.target.files[0].path
})
