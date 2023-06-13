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
app.get("/editar/:id", function (req, res) {
    const documentId = req.params.id;
    db.collection('agendamentos')
        .doc(documentId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const documentData = doc.data();
                documentData.id = doc.id; // Adiciona a propriedade 'id' ao documento
                res.render('editar', { post: documentData }); // Renderiza o template 'editar' com os dados do documento
            } else {
                console.log('Documento não encontrado');
                res.redirect('/consulta');
            }
        })
        .catch((error) => {
            console.log('Erro ao consultar o Firestore: ', error);
            res.redirect('/consulta');
        });
});

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
//criando uma rota para a atualização na consulta
app.post("/atualizar", function (req, res) {
    const documentId = req.body.id;
    const updatedDocument = {
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data: req.body.data,
        observacao: req.body.observacao
    };
    db.collection('agendamentos')
        .doc(documentId)
        .update(updatedDocument)
        .then(() => {
            console.log('Documento atualizado com sucesso');
            res.redirect('/consulta');
        })
        .catch((error) => {
            console.log('Erro ao atualizar o documento: ', error);
            res.redirect('/consulta');
        });
});

//---------------------------------------------------------------/
//criando servidor web na porta 8081
app.listen(8081, function () {
    console.log("Servidor Ativo!!");
});