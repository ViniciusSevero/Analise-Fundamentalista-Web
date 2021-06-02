
const backendUrl = window.location.origin

const getBoolMatrix = () => {
    let url = `${backendUrl}/bool-matrix`
    displayLoading(true)

    fetch(url).then((response) => {
        return response.json();
    }).then(data => {
        popularTabela(data)
    }).catch((err) => {
        console.warn('Something went wrong.', err);
    }).finally(() => {
        displayLoading(false)
    });
}

const popularTabela = (data) => {
    const popularCabecalho = (data) => {
        let thead = document.createElement('thead')
        let tr = document.createElement('tr')
        for(i in data.columns) {
            let th = document.createElement('th')
            th.innerHTML = data.columns[i]
            tr.appendChild(th)
        }
        thead.appendChild(tr)
        table.appendChild(thead)
    }

    const popularCorpo = (data) => {
        let tbody = document.createElement('tbody')
        for(x in data.data) {
            let tr = document.createElement('tr')
            for(y in data.data[x]) {
                let td = document.createElement('td')
                let value = data.data[x][y]
                let html = value
                if(value === true) {
                    html = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                    <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                  </svg>`
                } else if (value === false) {
                    html = ''
                }
                td.innerHTML = html
                tr.appendChild(td)
            }
            tbody.appendChild(tr)
        }
        table.appendChild(tbody)
    }

    let table = document.getElementsByClassName('table')[0]
    table.innerHTML = ''
    popularCabecalho(data)
    popularCorpo(data)
}

const displayLoading = (display) => {
    const loading = document.querySelector('.loading')
    const table = document.querySelector('.table')
    if(display) {
        table.innerHTML = ''
        loading.classList.remove('d-none')
    } else {
        loading.classList.add('d-none')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getBoolMatrix()
}, false);
