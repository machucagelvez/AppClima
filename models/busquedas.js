const fs = require('fs')
const axios = require('axios')

class Busquedas {
    historial = []
    dbPath = './db/database.json'

    constructor() {
        // TODO: leer DB si existe
        this.leerDB()
    }

    get historialCapitalizado() {

        return this.historial.map(lugar => {
           return lugar.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))

            // Otra forma:
            // let palabras = lugar.split(' ');
            // palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            // return palabras.join(' ')
        })

    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad(lugar = '') {

        try {
            //Petición http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })
            const resp = await instance.get()
            // Al poner entre () lo que está dentro de la función, es decir las {}, implicitamente se devuelve un objeto sin escribir return
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

        } catch (error) {
            return []
        }

    }

    async climaLugar(lat, lon) {
        try {
            //instance axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                //Desestructurar todo paramsOpenWeather para sumarle los otros dos parámetros
                params: {...this.paramsOpenWeather, lat, lon}
            })

            //resp.data
            const resp = await instance.get()
            const {weather, main} = resp.data
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp                
            }

        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial(lugar = '') {

        if(this.historial.includes(lugar.toLowerCase())) {
            return
        }
        //Dejar solo cinco elementos en el array:
        this.historial = this.historial.splice(0, 4)
                
        this.historial.unshift(lugar.toLowerCase())

        //Grabar en DB
        this.guardarDB()

    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB() {
        if(!fs.existsSync(this.dbPath)) {
            return
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        const data = JSON.parse(info)
        this.historial = data.historial
    }
}




module.exports = Busquedas