/*Requerimientos del Proyecto

Requerimiento #1: Configuración Inicial

Crea un directorio donde alojarás tu proyecto e incluye un archivo index.js como punto de entrada.

Inicia Node.js y configura npm usando el comando npm init -y.

Agrega la propiedad "type": "module" en el archivo package.json para habilitar ESModules.

Configura un script llamado start para ejecutar el programa con el comando npm run start.

Sabrina señala: “Este será el corazón de tu proyecto. Queremos un entorno limpio y profesional, como si estuvieras trabajando en un proyecto real”.
*/
console.log("inicio del proyecto hola mundo")





/*Requerimiento #2: Lógica de Gestión de Productos

 Con la base del proyecto lista, ahora necesitamos implementar las funcionalidades principales usando la API FakeStore.
 El sistema debe ser capaz de interpretar comandos ingresados en la terminal y ejecutar las siguientes acciones:
 
*Consultar Todos los Productos:

    Si ejecutas npm run start GET products, el programa debe realizar una petición asíncrona a la API y devolver la lista completa de productos en la consola.

    Ejemplo: npm run start GET products

* Consultar un Producto Específico:Si ejecutas npm run start GET products/<productId>, 
   el programa debe obtener y mostrar el producto correspondiente al productId indicado.Ejemplo: npm run start GET products/15

*Crear un Producto Nuevo:
    Si ejecutas npm run start POST products <title> <price> <category>, el programa debe enviar una petición POST a la API para agregar un nuevo producto con los datos proporcionados 
    (title, price, category) y devolver el resultado en la consola.
    Ejemplo: npm run start POST products T-Shirt-Rex 300 remeras

 *Eliminar un Producto:

    Si ejecutas npm run start DELETE products/<productId>, el programa debe enviar una petición DELETE para eliminar el producto correspondiente al productId y devolver la respuesta en la consola.

    Ejemplo: npm run start DELETE products/7
 
 */
const url_API = "https://fakestoreapi.com"

const argumentos = process.argv.slice(2)

const argumentos_validos = ["GET", "POST", "DELETE"]

console.log(argumentos)

async function programa_principal(argumentos = []) {
    if (!(argumentos[0] in argumentos_validos)){
        console.log("Comando incorrecto")
        return
    }
    switch(argumentos[0]){
        case "GET":
            if (!argumentos[1].includes("/") && argumentos[1] == "products"){
                try{
                    const response = await fetch(`${url_API}/products`, {
                        method: "GET"
                    })
                    if (response.status !== 200){
                        throw new Error("Falla en la solicitud")
                        break
                    }
                    const data = await response.json()

// para que la tabla se imprima bien en consola se debe tener que definir el numero de columnas que se van a imprimir para evitar logos y otras cosas de los productos
                    const filas = data.map(({ id, title, price, category, rating }) => ({
                        id,
                        titulo:
                            title.length > 48
                                ? `${title.slice(0, 45)}...`
                                : title,
                        precio: price,
                        categoria: category,
                        valoracion: rating?.rate ?? "",
                        opiniones: rating?.count ?? "",
                    }))
                    console.table(filas)
                    break
                }catch(error){
                    console.log(error)
                    break
                }
            } else if (argumentos[1].includes("/") && argumentos[1].includes("products")){
                let id_sin_separar = argumentos[1].split("/")
                try{
                    const id = parseInt(id_sin_separar[1])
                    const reponse = await fetch(`${url_API}/products/${id}`,{
                        method: "GET"
                    })
                    if (reponse.status != 200){
                        throw new Error ("Error en la solicitud")
                        break;
                    }
                    const data = await reponse.json()
                    console.log(data)
                    break;
                }catch(error){
                    console.log(error)
                    break;
                }
            }else{
                console.log("Comando incorrecto")
                break;
            }
        case "POST":
            if(argumentos.length == 5 && argumentos[1] == "products"){
                const [ , , nombre, precio, categoria] = argumentos
                const response = await fetch(`${url_API}/products`,{
                    method : "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            nombre, 
                            precio,
                            categoria
                        }
                    )
                })

                if(!response.ok){
                    throw new Error("Error en la solicitud")
                }
                const data = await response.json()
                console.log(data)
                break
            }else{
                console.log("Solicitud incompleta")
                break
            }
        case "DELETE":
            if(argumentos[1].includes("/") && argumentos[1].includes("products")){
                let id_sin_separar = argumentos[1].split("/")
                try{
                    const id = parseInt(id_sin_separar[1])
                    const reponse = await fetch(`${url_API}/products/${id}`,{
                        method: "DELETE"
                    })
                    if (!reponse.ok){
                        throw new Error ("Error en la solicitud")
                        break;
                    }
                    const data = await reponse.json()
                    console.log(data)
                    break;
                }catch(error){
                    console.log(error)
                    break;
                }
            }else{
                console.log("Solicitud incorrecta")
            }
    }
}

programa_principal(argumentos)

/*
 * Ejemplo de POST válido (mismo formato que el encabezado del proyecto):
 *   npm run start -- POST products T-Shirt-Rex 300 remeras
 *
 * Si el título lleva espacios, entre comillas:
 *   npm run start -- POST products "Remera algodón" 29.99 remeras
 */