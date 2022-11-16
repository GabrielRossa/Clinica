const form = document.getElementById('form')
const campos = document.querySelectorAll('.required')
const spans = document.querySelectorAll('.span-required')
const emailRegex = '[a-z0-9]+@[a-z]+\.[a-z]{2,3}'

var errorStatus = 0

var url = 'http://localhost:3000/'

form.addEventListener('submit', (event) => { 
    errorStatus = 0
    event.preventDefault()

    crmValidate()
    nomeValidate()
    areaValidate()
    emailValidate()
    telefoneValidate()  
    
    if(errorStatus == 0){
        let body = {
            'certificadoCRM': campos[0].value,
            'nome': campos[1].value,
            'areaDeAtuacao': campos[2].value,
            'email': campos[3].value,
            'telefone': campos[4].value
        }

        fetch(url + "medico/cadastrar", {
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

function crmValidate(){
    if(campos[0].value.length != 6){
        setError(0)
        errorStatus++
    }else{
        removeError(0)
    }
}

function nomeValidate(){
    if(campos[1].value.length < 3){
        setError(1)
        errorStatus++
    }else{
        removeError(1)
    }
}

function areaValidate(){
    if(campos[2].value.length < 1){
        setError(2)
        errorStatus++
    }else{
        removeError(2)
    }
}

function emailValidate(){
    if(!campos[3].value.match(emailRegex)){
        setError(3)
        errorStatus++
    }else{
        removeError(3)
    }
}

function telefoneValidate(){
    if(campos[4].value.length != 11){
        setError(4)
        errorStatus++
    }else{
        removeError(4)
    }
}

////////////////////////////////////////// LISTAGEM
function listarTudo()
{
    let listaUsuarios = document.getElementById('modalTodosObjetos')

    listaUsuarios.classList.add("active")
    
    //da um GET no endpoint "usuarios"
	fetch(url + 'medicos')
	.then(response => response.json())
	.then((usuarios) =>
	{
        //pega div que vai conter a lista de usuarios
		
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
			
			let divNome = document.createElement('input')
			divNome.placeholder = 'Nome'
			divNome.value = usuario.nome
			divUsuario.appendChild(divNome)
			
			let divArea = document.createElement('input')
			divArea.placeholder = 'Area de Atuação'
			divArea.value = usuario.areaDeAtuacao
			divUsuario.appendChild(divArea)

            let divEmail = document.createElement('input')
			divEmail.placeholder = 'Email'
			divEmail.value = usuario.email
			divUsuario.appendChild(divEmail)

            let divTelefone = document.createElement('input')
			divTelefone.placeholder = 'Telefone'
			divTelefone.value = usuario.telefone
			divUsuario.appendChild(divTelefone)
			
			//cria o botao para remover o usuario
			let btnRemover = document.createElement('button')
			btnRemover.innerHTML = 'Remover'
			btnRemover.onclick = u => remover(usuario.id)
			btnRemover.style.marginRight = '5px'
			
			//cria o botao para atualizar o usuario
			let btnAtualizar = document.createElement('button')
			btnAtualizar.innerHTML = 'Atualizar'
			btnAtualizar.onclick = u => atualizar(usuario.id, divCRM, divNome, divArea, divEmail, divTelefone)
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

function atualizar(id, divCRM, divNome, divArea, divEmail, divTelefone)
{
	let body =
	{
		'certificadoCRM': divCRM.value,
        'nome': divNome.value,
		'areaDeAtuacao': divArea.value,
		'email': divEmail.value,
        'telefone': divTelefone.value
	}
	
	fetch(url + "medico/" + id + "/atualizar",
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
		alert('Médico atualizado!')
	})
	.catch((error) =>
	{
		console.log(error)
		alert('Não foi possível atualizar o médico!')
	})
}

function remover(id)
{
	fetch(url + 'medico/excluir/' + id,
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
		alert('Médico removido!')
	})
	.catch((error) =>
	{
		console.log(error)
		alert('Não foi possível remover o Médico!')
	})
}

function fechaLista(){
    modalCadastro.classList.remove("active")
}