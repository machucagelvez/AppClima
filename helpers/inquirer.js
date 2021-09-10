const inquirer = require('inquirer')
require('colors')

const preguntas = [
    {
        type: 'list', //muestra listado de opciones
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
]

const inquirerMenu = async() => {

    console.clear()
    console.log('========================='.green)
    console.log('  Seleccione una opción  '.white)
    console.log('=========================\n'.green)

    //Devuelve la opción que escogió el usuario
    //Se devuelve en un objeto con clave lo que se le asignó al name (name: 'opcion' para este caso)
    //El resultado sería: {opcion: la-opción-seleccionada}
    const { opcion } = await inquirer.prompt(preguntas)

    return opcion
}



const pausa = async() => {
    const question = [
        {
            type: 'input', //Permite ingresar datos
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`,
        }
    ]

    console.log('\n')
    await inquirer.prompt(question)
}

const leerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if(value.length===0) {
                    return 'Por favor ingrese un valor'
                }
                return true
            }
        }
    ]

    const { desc } = await inquirer.prompt(question)
    return desc
}

const listadoTareasBorrar = async(tareas = []) => {
    const choices = tareas.map((tarea, i) => {
        idx = `${i + 1}.`.green
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`
        }
    })

    //Agregar opción cancelar:
    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    })
    
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Borrar',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas)
    return id
}

const confirmar = async(message) => {

    const question = [
        {
            type: 'confirm', //Permite confirmación (sí o no)
            name: 'ok',
            message
        }
    ]

    //Devuelve {ok: true o false}:
    const {ok} = await inquirer.prompt(question)
    return ok
}

const mostrarListadoChecklist = async(tareas = []) => {
    const choices = tareas.map((tarea, i) => {
        idx = `${i + 1}.`.green
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false //Marca la opción como marcada o no
        }
    })
    
    const pregunta = [
        {
            type: 'checkbox', //Permite mostrar listado con checkbox
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(pregunta)
    return ids
}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist
}