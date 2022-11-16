const form = document.getElementById('form')
const campos = document.querySelectorAll('.required')
const spans = document.querySelectorAll('.span-required')
const sexoCheck = document.querySelector('input[name="sexo"]:checked')
const emailRegex = '[a-z0-9]+@[a-z]+\.[a-z]{2,3}'

var errorStatus = 0

var url = 'http://localhost:3000/'

form.addEventListener('submit', (event) => { 
    errorStatus = 0
    event.preventDefault()

    CPFValidate()
    nomeValidate()
    idadeValidate()
    sexoValidate()
    emailValidate()
    telefoneValidate()
    
    if(errorStatus == 0){
        let body = {
            'cpf': campos[0].value,
            'nome': campos[1].value,
            'idade': campos[2].value,
            'sexo': sexoCheck.value,
            'telefone': campos[4].value,
            'email': campos[5].value
        }

        fetch(url + "paciente/cadastrar", {
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

function CPFValidate(){
    if(campos[0].value.length != 11){
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

function idadeValidate(){
    if(campos[2].value.length == 0){
        setError(2)
        errorStatus++

    }else{
        removeError(2)
    }
}

function sexoValidate(){
    if(sexoCheck == null){
        setError(3)
        errorStatus++
    }else{
        removeError(3)
    }
}

function emailValidate(){
    if(!campos[4].value.match(emailRegex)){
        setError(4)
        errorStatus++

    }else{
        removeError(4)
    }
}

function telefoneValidate(){
    if(campos[5].value.length != 11){
        setError(5)
        errorStatus++

    }else{
        removeError(5)
    }
}

////////////////////////////////////////// LISTAGEM
function listarTudo()
{
    let listaUsuarios = document.getElementById('modalTodosObjetos')

    listaUsuarios.classList.add("active")

    //da um GET no endpoint "usuarios"
	fetch(url + 'pacientes')
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

			let divCPF = document.createElement('input')
			divCPF.placeholder = 'CPF'
			divCPF.value = usuario.cpf
			divUsuario.appendChild(divCPF)
			
			let divNome = document.createElement('input')
			divNome.placeholder = 'Nome'
			divNome.value = usuario.nome
			divUsuario.appendChild(divNome)
			
			let divIdade = document.createElement('input')
			divIdade.placeholder = 'Idade'
			divIdade.value = usuario.idade
			divUsuario.appendChild(divIdade)

            let divSexo = document.createElement('input')
			divSexo.placeholder = 'Sexo'
			divSexo.value = usuario.sexo
			divUsuario.appendChild(divSexo)

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
			btnAtualizar.onclick = u => atualizar(usuario.id, divCPF, divNome, divIdade, divSexo, divEmail, divTelefone)
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

function atualizar(id, divCPF, divNome, divIdade, divSexo, divEmail, divTelefone)
{
	let body =
	{
		'cpf': divCPF.value,
        'nome': divNome.value,
		'idade': divIdade.value,
		'sexo': divSexo.value,
        'email': divEmail.value,
        'telefone': divTelefone.value
	}
	
	fetch(url + "paciente/" + id + "/atualizar",
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
		alert('Paciente atualizado!')
	})
	.catch((error) =>
	{
		console.log(error)
		alert('Não foi possível atualizar o paciente!')
	})
}

function remover(id)
{
	fetch(url + 'paciente/excluir/' + id,
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
		alert('Paciente removido!')
	})
	.catch((error) =>
	{
		console.log(error)
		alert('Não foi possível remover o Paciente!')
	})
}