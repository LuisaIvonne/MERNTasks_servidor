const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearProyecto =  async (req, res) => {
    
    //revisar si hay errores
    const errores =  validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el propietario del proyecto via JWT
        proyecto.propietario = req.usuario.id;

        //Guardar el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({propietario: req.usuario.id}).sort({fecha: -1});
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
    //revisar si hay errores
    const errores =  validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //extraer la información del proyecto
    const {nombre} = req.body;
    const nuevoProyecto = {};
    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto
        if(proyecto.propietario.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //actualizar
        proyecto =  await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true})

        res.json({proyecto});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {
    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto
        if(proyecto.propietario.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //eliminar
        proyecto =  await Proyecto.findByIdAndRemove({_id: req.params.id});
        res.json({msg: 'Proyecto eliminado'});

        res.json({proyecto});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}
