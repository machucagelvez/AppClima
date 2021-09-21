require('dotenv').config()
const { leerInput, pausa, inquirerMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {
    
    const busquedas = new Busquedas()
    let opt
    do {
        opt = await inquirerMenu()
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ')

                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino)
                
                //Seleccionar una opción
                const id = await listarLugares(lugares)
                if(id === 0) continue //Si se presiona la opción '0' se sale del case
                const lugarSel = lugares.find(lugar => lugar.id === id) //Buscar por id dentro del array de lugares. Método de JS
                const {nombre, lat, lng} = lugarSel

                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre)
                
                //Clima
                const clima = await busquedas.climaLugar(lat, lng)
                const {desc, min, max, temp} = clima
                
                
                //Mostrar resultados
                console.clear()
                console.log('\nInformación de la ciudad\n'.green)
                console.log('Ciudad:', nombre.green)
                console.log('Lat:', lat)
                console.log('Lng:', lng)
                console.log('Temperatura:', temp)
                console.log('Mínima:', min)
                console.log('Máxima:', max)
                console.log('Clima:', desc.blue)
                break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green
                    console.log(`${idx} ${lugar}`)
                })
                break;
        }

        if(opt!==0) await pausa()
        
    } while (opt!==0);
}


main()