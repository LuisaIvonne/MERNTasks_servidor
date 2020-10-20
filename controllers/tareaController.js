const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async(req, res) => {
    //revisar si hay errores
    const errores =  validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.propietario.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Crear la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.propietario.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Obtener las tareas por proyecto
        const tarea = await Tarea.find({proyecto});
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar tarea
exports.actualizarTareas = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;

        //Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(!existeProyecto.propietario.toString() !== req.usuario.id){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Crear un objeto con la nueva información
        const nuevaTarea = {};
        if(nombre) nuevaTarea.nombre = nombre;

        if(estado) nuevaTarea.estado =  estado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new:true});

        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//eliminar tarea
exports.eliminarTarea = async(req, res) => {
    try{
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;

        //Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(!existeProyecto.propietario.toString() !== req.usuario.id){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //eliminar
        await Tarea.findOneAndRemove({_id: req.params});
        res.json({msg: 'Tarea eliminada'});
    }catch{
        console.log(error);
        res.status(500).send('Hubo un error'); 
    }
}

