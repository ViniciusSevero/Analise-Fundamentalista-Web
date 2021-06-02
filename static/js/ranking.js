const getRanking = (selectedIndicators) => {
    let url = 'http://localhost:5000/ranking?'
    selectedIndicators.forEach(i => {
        url += `&indicators[]=${i}`
    })
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
                td.innerHTML = data.data[x][y]
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


const selectIndicatorsByTecnique = (tecnique) => {
    let selectedIndicators = tecnique.getAttribute('data-indicators').split(',')
    let indicators = document.querySelectorAll('.indicator')
    indicators.forEach(element => {
        element.checked = false
        const value = element.getAttribute('value')
        if(selectedIndicators.indexOf(value) != -1) {
            element.checked = true
            getRanking(selectedIndicators)
        }
    })
}

const deselectAllTecniques = () => {
    let allTecniques = document.querySelectorAll('.tecnique')
    allTecniques.forEach(element => {
        element.classList.remove('active')
    })
}

const getSelectedIndicators = () => {
    let selectedIndicators = []
    let indicators = document.querySelectorAll('.indicator')
    indicators.forEach(element => {
        if(element.checked) {
            selectedIndicators.push(element.getAttribute('value'))
        }
    })
    return selectedIndicators;
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
    document.addEventListener('click', (event) => {
        if (event.target.closest('.indicator')) {
            deselectAllTecniques()
            getRanking(getSelectedIndicators())
        }
        if (event.target.closest('.tecnique')) {
            deselectAllTecniques()
            let tecnique = event.target
            tecnique.classList.add('active')
            selectIndicatorsByTecnique(tecnique);
        }

    })
}, false);
