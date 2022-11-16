var buttonCadastro = document.getElementById("buttonCadastro")
var modalCadastro = document.getElementById("modalCadastro")
var closeCadastro = document.getElementById("closeCadastro")
var closeTodos = document.getElementById('closeTodosObjetos')
var modalTodos = document.getElementById('modalTodosObjetos')

buttonCadastro.onclick = function(){
    modalCadastro.classList.add("active")
}

closeCadastro.onclick = (event)=>{
    modalCadastro.classList.remove("active")
}

closeTodos.onclick = (event) => {
    modalTodos.classList.remove("active")
}