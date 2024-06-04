document.addEventListener('DOMContentLoaded', function () {

    const nombreInput = document.getElementById('nombre');
    const areaSelect = document.getElementById('area');
    const informacionSelect = document.getElementById('informacion');
    const limpiarButton = document.getElementById('limpiar');
    const resultado = document.getElementById('resultado');
    const btnSolicitar = document.getElementById('solicitar');
    const modal = document.getElementById('myModal');
    const span = document.getElementsByClassName('close')[0];
    //const span = document.getElementById('close');
    const modalMessage = document.getElementById('modal-message');
    

    informacionSelect.addEventListener('change', () => {
        
        resultado.innerHTML = '';

        // Accedemos al atributo name de option
        const informacionSeleccionado = informacionSelect.options[informacionSelect.selectedIndex];

        // Accedemos a sessionStorage
        const hijosOptions = JSON.parse(sessionStorage.getItem('hijosOptions'));

        // Capturamos el valor
        const informacionValue = informacionSelect.value;

        if (informacionSeleccionado.classList.contains('P/N')) {
            resultado.disabled = true
            return;
        }
        resultado.disabled = false

        if (informacionValue === '1') {
            addOptions(hijosOptions.filter( item => item[0] === 1 ))
        }

        else if (informacionValue === '2') {
            addOptions(hijosOptions.filter( item => item[0] === 2 ))
        }

        else if (informacionValue === '3') {
            addOptions(hijosOptions.filter( item => item[0] === 3 ))
        }

    })

    function addOptions(options) {
        options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option[0];
            optionElement.textContent = option[1];
            resultado.appendChild(optionElement);
        });
    }

    limpiarButton.addEventListener('click', function () {
        const form = document.getElementById('formulario');
        form.reset();
    });

    btnSolicitar.addEventListener('click', (event) => {
        event.preventDefault();

        const data = {
            nombre: nombreInput.value,
            area: areaSelect.value,
            informacion: informacionSelect.options[informacionSelect.selectedIndex].textContent,
            resultado: resultado.options[resultado.selectedIndex].textContent
        };

        fetch('/solicitar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(({ data }) => {
            // console.log('Success:', data);
            if ( `${data[3]}`.includes('http') ) {
                return window.open(data[3], '_blank');
            }
            // Hay que presentar modal
            modalMessage.textContent = `Resultado: ${data[3]}`;
            modal.style.display = "block";
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    })

    span.onclick = function() {
        modal.style.display = "none";
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});
