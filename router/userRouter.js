const express = require('express');
const router = express.Router();


const { body, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');

const User = require('../models/userModel');

router.post("/login", async (req, res) => {

    const { email, password } = req.body

    console.log(email, password);

    const usuarioExiste = await User.findOne({ email })
    console.log(usuarioExiste);

});

router.get("/", async (req, res) => {
    try {
        const usuarios = await User.find();
        return res.status(200).json(usuarios);
        } catch (error) {
        console.log('Error al obtener los usuarios: ', error);
        return res.status(400).json({ message: 'Error al obtener los usuarios' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        console.log(id);
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.log('Error al eliminar el usuario: ', error);
        return res.status(400).json({ message: 'Error al eliminar el usuario' });
    }
});



router.post("/register",
    [
        body('nombre')
            .isLength({ min: 3, max: 20 }).withMessage('El nombre debe tener entre 3 y 20 caracteres')
            .notEmpty().withMessage('El nombre es obligatorio')
            .isString().withMessage('El nombre debe ser de tipo texto')
            .trim(),
        body('email')
            .isLength({ min: 3, max: 45 }).withMessage('El email debe tener entre 3 y 45 caracteres')
            .notEmpty().withMessage('El nombre es obligatorio')
            .isEmail().withMessage('El correo tiene que existir')
            .trim(),
        body('password')
            .isLength({ min: 8 }).withMessage('El password debe tener como mínimo 8 caracteres')
            .notEmpty().withMessage('El nombre es obligatorio')
            .isString().withMessage('El password debe ser de tipo texto')
            .trim(),

    ]
    , async (req, res) => {

        const errores = validationResult(req);

        const { nombre, email, password } = req.body;


        console.log(errores)  

        const persona = {
            nombre,
            email,
            password
        }
        console.log(persona);

        try {

            if (!errores.isEmpty()) {
                return res.status(400).json({
                    message: 'Error al registrarse'
                });
            }

        
            const usuarioExiste = await User.findOne({ email })
            console.log(usuarioExiste);


            const salt = bcrypt.genSaltSync(10);
            console.log(salt);

            persona.password = await bcrypt.hashSync(password, salt);
            console.log(persona.password);

            const newUser = new User(persona);
            
        await newUser.save(); 
    
        return res.status(201).json({
                message: 'Usuario creado correctamente'
            });

        } catch (error) {
            
            console.log('error al registrarse:', error);
            return res.status(400).json({
                message: 'Error al registrarse'
            });
            }

    });

module.exports = router; 