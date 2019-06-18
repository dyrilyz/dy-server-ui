const {ipcRenderer} = require('electron')

const vm = avalon.define({
    $id: 'selectModal',
    a: '1111',
    close () {
        alert('close')
        ipcRenderer.send('select-win-close')
    }
});
