const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

/*router.post('/', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.redirect('/users');
});*/

router.post('/', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Cifrar la contraseña con un factor de costo de 10
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword // Guardar la contraseña cifrada en la base de datos
      });
  
      await newUser.save();
      res.redirect('/users');
    } catch (error) {
      // Manejo del errorxs
      console.error(error);
      res.status(500).send('Error al crear un nuevo usuario');
    }
  });
  

router.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('partials/edit', { user });
});

router.post('/update/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/users');
});

router.get('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

module.exports = router;
