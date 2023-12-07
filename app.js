const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = 'ThissiuerstrfdertfdthfderghiogD';
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save()
    res.render('secrets')
})


app.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const resultUser = await User.findOne({email: username}).exec();
       //teste console.log(resultUser.email, resultUser.password)
        if(resultUser) {
            res.render('secrets')
        } else {
            res.send('<h2>Senha ou e-mail estão errados</h2>')
        }
    } catch (error) {
        console.error('caiu qyi', error)
    }
})

app.listen(4000, () => {
    console.log('Servidor Rodando na porta 4000')
})