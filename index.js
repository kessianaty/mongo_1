const express = require('express');
const mongoose = require('mongoose');

//depois do bd
const Person = require('./models/Person');
 
//criar app
 
const app = express();
 
//configurar para ler json
 
app.use(express.urlencoded({
    extended: true,
}))
app.use(express.json());

//Rotas
app.post('/person', async (req, res)=> {
    const {name, salary, approved} = req.body

    const person = {
        name, 
        salary, 
        approved,
    }
    //O C do CRUD
    try{
        await Person.create(person)

        res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!'})
    } catch (error) {
        res.status(500).json({ erro: error})
    }
})

//O R do CRUD
app.get('/person', async (req, res) => {
    try {
        const people = await Person.find()

        res.status(200).json(people)
    } catch (error){
        res.status(500).json({erro: error})
    }
})

//O R do CRUD 
app.get('/person/:id', async (req, res) => {
    const id = req.params.id

    try {
        const person = await Person.findOne({ _id: id })

        if (!person) {
            res.status(422).json({ message: 'Usuário não encontrado!'})
            return
        }

        res.status(200).json(person)
    } catch (error) {
        res.status(500).json({ erro: error})
    }
})

// O U do CRUD
app.patch('/person/:id', async (req, res) => {
    const id = req.params.id

    const {name, salary, approved} = req.body

    const person ={
        name,
        salary,
        approved,
    }

    try {
        const updatedPerson = await Person.updateOne({ _id: id}, person)

        if(updatedPerson.matchedCount ===0){
            res.status(422).json({message: 'Usuário não encontrado!'})
            return
        }

        res.status(200).json(person)
    } catch(error){
        res.status(500).json({ erro:error})
    }
})

//O D do CRUD
app.delete('/person/:id', async ( req, res) => {
    const id = req.params.id

    const person = await Person.findOne ({ _id: id})

    if (!person){
        res.status(422).json({ message: 'Usuário não encpntrado!'})
        return
    }

    try {
        await Person.deleteOne({ _id: id})

        res.status(200).json({message: 'Usuário removido com sucesso'})
    } catch (error) {
        res.status(500).json({ erro: error})
    }
})
 
// conexão com banco
let url = "mongodb://localhost:27017/"
mongoose.connect(url).then(()=>{
 
    console.log("Já tem banco, pode sentar")
    //Hello world
app.get('/', (rep, res)=>{
    res.json({message: "Olá, mundo!"});
 
})
}).catch((err)=>{
 
    console.log("Não tem banco, fica em pé")
})
 
 
 
app.listen(3000)