const bodyParser = require("body-parser")
const express = require("express")
const app = express()

const handlebars = require("express-handlebars").engine

app.engine("handlebars", handlebars({defaultLayout:"main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extend: false}))
app.use(bodyParser.json())

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')

const serviceAccount = require("./fatecweb-32840-firebase-adminsdk-3q5xm-676ed51519.json")

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()


//---------------------------------------------------------------/
//criando uma rota para o diretório principal do domínio
app.get("/", function(req, res) {
    res.render("primeira_pagina")
})

//---------------------------------------------------------------/
//criando uma rota para a segunda página
app.post("/cadastrar", function(req, res){
    var adicionar = db.collection('agendamentos').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data: req.body.data,
        observacao: req.body.observacao
    })

    console.log("Added document");
    res.render("primeira_pagina")
})

//---------------------------------------------------------------/
//criando uma rota para a página de consulta
app.get("/consultar", function(req, res){
    
})

//---------------------------------------------------------------/
//criando uma rota para a página de edição
app.get("/editar/:id", function(req, res){
    
})

//---------------------------------------------------------------/
//criando uma rota para a página de exclusão
app.get("/deletar/:id", function(req, res){
    
})

//---------------------------------------------------------------/
//criando uma rota para a atualização na consulta
app.post("/atualizar", function(req, res){

})

//---------------------------------------------------------------/
//criando servidor web na porta 8081
app.listen(8081, function() {
    console.log("Servidor Ativo!!")
})