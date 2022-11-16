const form = document.getElementById('form')
const campos = document.querySelectorAll('.required')
const spans = document.querySelectorAll('.span-required')
const statusCheck = document.querySelector('input[name="status"]:checked')

const emailRegex = '[a-z0-9]+@[a-z]+\.[a-z]{2,3}'

var errorStatus = 0

form.addEventListener('submit', (event) => { 
    errorStatus = 0
    event.preventDefault()

    CRMValidate()
    CPFValidate()
    tipoValidate()
    statusValidate()
    dataValidate()

    if(errorStatus == 0){
        let body = {
            'crmMedico': campos[0].value,
            'cpfPaciente': campos[1].value,
            'dataHorario': campos[2].value,
            'tipo': campos[3].value,
            'status': campos[4].value
        }

        fetch(url + "consulta/cadastrar", {
            'method': 'POST',
            'redirect': 'follow',
            'headers':
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            'body': JSON.stringify(body)
        }).then((response) =>{
            if(response.ok){
                return response.text()
            }else{
                return response.text().then((text) => {
                    throw new Error(text)
                })
            }
        }).then((output) => {
            console.log(output)
            alert('Cadastro realizado com sucesso!')
        }).catch((error) => {
            console.log(error)
            alert('Não foi possíveal realizar o cadastro!')
        })
    }

})

function setError(index){
    campos[index].classList.add('error')
}

function removeError(index){
    campos[index].classList.remove('error')
}

function CRMValidate(){
    if(campos[0].value.length != 6){
        setError(0)
        errorStatus++
    }else{
        removeError(0)
    }
}

function CPFValidate(){
    if(campos[1].value.length != 11){
        setError(1)
        errorStatus++
    }else{
        removeError(1)
    }
}

function dataValidate(){
    if(campos[2].value.length != 16){
        setError(2)
        errorStatus++      
    }else{
        removeError(2)
    }
}

function tipoValidate(){
    if(campos[3].value.length < 5){
        setError(3)
        errorStatus++
    }else{
        removeError(3)
    }
}

function statusValidate(){
    if(statusCheck != null){
        removeError(4)
        errorStatus++
    }else{
        setError(4)
    }
}

////////////////////////////////////////// LISTAGEM
function listarTudo()
{
    let listaUsuarios = document.getElementById('modalTodosObjetos')

    listaUsuarios.classList.add("active")

    //da um GET no endpoint "usuarios"
	fetch(url + 'consultas')
	.then(response => response.json())
	.then((usuarios) =>
	{		
		//limpa div
		while(listaUsuarios.firstChild)
		{
			listaUsuarios.removeChild(listaUsuarios.firstChild)
		}
		
		//preenche div com usuarios recebidos do GET
		for(let usuario of usuarios)
		{
			//cria div para as informacoes de um usuario
			let divUsuario = document.createElement('div')
            divUsuario.setAttribute('class', 'block-box')

			let divCRM = document.createElement('input')
			divCRM.placeholder = 'CRM'
			divCRM.value = usuario.certificadoCRM
			divUsuario.appendChild(divCRM)
			
			let divCPF = document.createElement('input')
			divCPF.placeholder = 'CPF'
			divCPF.value = usuario.cpf
			divUsuario.appendChild(divCPF)
			
			let divDataHorario = document.createElement('input')
			divDataHorario.placeholder = 'Data e Horário'
			divDataHorario.value = usuario.dataHorario
			divUsuario.appendChild(divDataHorario)

            let divTipo = document.createElement('input')
			divTipo.placeholder = 'Tipo de atendimento'
			divTipo.value = usuario.tipo
			divUsuario.appendChild(divTipo)

            let divStatus = document.createElement('input')
			divStatus.placeholder = 'Status'
			divStatus.value = usuario.status
			divUsuario.appendChild(divStatus)
			
			//cria o botao para remover o usuario
			let btnRemover = document.createElement('button')
			btnRemover.innerHTML = 'Remover'
			btnRemover.onclick = u => remover(usuario.id)
			btnRemover.style.marginRight = '5px'
			
			//cria o botao para atualizar o usuario
			let btnAtualizar = document.createElement('button')
			btnAtualizar.innerHTML = 'Atualizar'
			btnAtualizar.onclick = u => atualizar(usuario.id, divCRM, divCPF, divDataHorario, divTipo, divStatus)
			btnAtualizar.style.marginLeft = '5px'
			
			//cria a div com os dois botoes
			let divBotoes = document.createElement('div')
			divBotoes.style.display = 'flex'
			divBotoes.appendChild(btnRemover)
			divBotoes.appendChild(btnAtualizar)
			divUsuario.appendChild(divBotoes)
			
			//insere a div do usuario na div com a lista de usuarios
			listaUsuarios.appendChild(divUsuario)
		}
	})
}

function atualizar(id, divCRM, divCPF, divDataHorario, divTipo, divStatus)
{
	let body =
	{
		'crmMedico': divCRM.value,
		'cpfPaciente': divCPF.value,
		'dataHorario': divDataHorario.value,
		'tipo': divTipo.value,
		'status': divStatus.value,
	}
	
	fetch(url + "consulta/" + id + "/atualizar",
	{
		'method': 'POST',
		'redirect': 'follow',
		'headers':
		{
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		'body': JSON.stringify(body)
	})
	.then((response) =>
	{
		if(response.ok)
		{
			return response.text()
		}
		else
		{
			return response.text().then((text) =>
			{
				throw new Error(text)
			})
		}
	})
	.then((output) =>
	{
		listarTudo()
		console.log(output)
		alert('Consulta atualizada!')
	})
	.catch((error) =>
	{
		console.log(error)
		alert('Não foi possível atualizar a consulta!')
	})
}

function remover(id)
{
	fetch(url + 'consulta/excluir/' + id,
	{
		'method': 'POST',
		'redirect': 'follow'
	})
	.then((response) =>
	{
		if(response.ok)
		{
			return response.text()
		}
		else
		{
			return response.text().then((text) =>
			{
				throw new Error(text)
			})
		}
	})
	.then((output) =>
	{
		listarTudo()
		console.log(output)
		alert('Consulta removida!')
	})
	.catch((error) =>
	{
		console.log(error)
		alert('Não foi possível remover a Consulta!')
	})
}