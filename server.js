const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel')
require('dotenv').config()

const app = express()
const URL_CONNECT = process.env.URL_CONNECT
const PORT = process.env.PORT

app.use(express.json())

app.get('/', (req, res) => { res.send('Hello from /') })

//GET Recuperar
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//GET Recuperar por id
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//PUT Actualizar
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id, req.body)
        if (!product) {
            return res.status(404).json({ message: `Cannot find this ID: ${id}` })
        }
        const productUpdated = await Product.findById(id) //Para que en postman se vea el cambio :D
        res.status(201).json(productUpdated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//DELETE Borrar por id
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({ message: `Cannot find this ID: ${id}` })
        }
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//POST Agregar
app.post('/product', async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

mongoose.connect(URL_CONNECT)
    .then(() => {
        console.log('Connect whit mongo')
    })
    .catch(error => {
        console.log(error)
    })

app.listen(PORT, () => console.log(`El servidor se inicializo en el puerto ${PORT}`))
