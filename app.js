const bodyParser = require("body-parser")
const express = require("express")
const app = express()

const handlebars = require("express-handlebars").engine

app.engine("handlebars", handlebars({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require("./fatecweb-32840-firebase-adminsdk-3q5xm-676ed51519.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

//---------------------------------------------------------------/
//criando uma rota para o diretório principal do domínio
app.get("/", function (req, res) {
    res.render("primeira_pagina");
});

//---------------------------------------------------------------/
//criando uma rota para cadastrar
app.post("/cadastrar", function (req, res) {
    db.collection('agendamentos')
        .add({
            nome: req.body.nome,
            telefone: req.body.telefone,
            origem: req.body.origem,
            data: req.body.data,
            observacao: req.body.observacao
        })
        .then(() => {
            console.log("Document added");
            res.render("primeira_pagina");
        })
        .catch((error) => {
            console.log("Error adding document: ", error);
            res.render("primeira_pagina");
        });
});

//---------------------------------------------------------------/
//criando uma rota para a página de consulta
app.get('/consulta', (req, res) => {
    db.collection('agendamentos')
        .get()
        .then((snapshot) => {
            const documents = [];
            snapshot.forEach((doc) => {
                const documentData = doc.data();
                documentData.id = doc.id; // Adiciona a propriedade 'id' ao documento
                documents.push(documentData);
            });
            res.render('consulta', { documents });
        })
        .catch((error) => {
            console.log('Erro ao consultar o Firestore: ', error);
            res.render('consulta', { documents: [] });
        });
});

//---------------------------------------------------------------/
// Criando uma rota para a página de edição
app.get("/editar/:id", (req, res) => {
    const { id } = req.params;
    const arr = [];
    let obj = {};

    db.collection('agendamentos').doc(id).get()
        .then((doc) => {
            if (doc.exists) {
                obj = {
                    id: doc.id,
                    dataValues: doc.data()
                };
                arr.push(obj);
                res.render("editar", {
                    data: arr,
                    id: id // Passando o ID para a página de edição
                });
            } else {
                console.log("Documento não encontrado.");
                res.redirect("/consulta");
            }
        })
        .catch((error) => {
            console.error('Erro ao ler documento: ', error);
            res.redirect("/consulta");
        });
});


//---------------------------------------------------------------/
// Criando uma rota para a atualização na consulta
app.post("/atualizar/:id", function(req, res){
    const {id} = req.params
    console.log(id);
    db.collection('agendamentos').doc(id).update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    })
    .then(() => {
        console.log('Documento atualizado com sucesso!');
        res.redirect("/consulta")
    })
        .catch((error) => {
        console.error('Erro ao atualizar documento: ', error);
    });
})



//---------------------------------------------------------------/
//criando uma rota para a página de exclusão
app.get("/deletar/:id", function (req, res) {
    const documentId = req.params.id;
    db.collection('agendamentos')
        .doc(documentId)
        .delete()
        .then(() => {
            console.log('Documento excluído com sucesso');
            res.redirect('/consulta');
        })
        .catch((error) => {
            console.log('Erro ao excluir o documento: ', error);
            res.redirect('/consulta');
        });
});

//---------------------------------------------------------------/
//criando servidor web na porta 8081
app.listen(8081, function () {
    console.log("Servidor Ativo!!");
});