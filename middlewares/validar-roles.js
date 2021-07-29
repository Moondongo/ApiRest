const validarRol = (req, res, next) =>{
    const usuarioAutenticado = req.usuario;

    if(!usuarioAutenticado){
        return res.status(500).json({
            msg: 'se quiere validar el rol y todavia no se valido el token'
        })
    }

    if(usuarioAutenticado.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: 'Necesita el rol de administrador para realizar esta accion'
        })
    }

    next();
}

const tieneRol = (...roles) =>{

    return (req, res, next) => {
        if(!req.usuario){
            return res.status(500).json({
                msg: 'se quiere validar el rol y todavia no se valido el token'
            })
        }

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg: `el servicio requiere uno de estos roles: ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    validarRol,
    tieneRol
}