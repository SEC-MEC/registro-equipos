import { useQuery } from "@tanstack/react-query";
import { getEquipos } from "../../api/equipos";

const ItemTable = () => {

    const {data, isLoading, isError} = useQuery({
        queryKey: ['items'],
        queryFn: ()=> getEquipos()
    });


    if(isError) return <p>Error al cargar los equipos</p>
    if(isLoading) return <p>Cargando...</p>

    if(data && data.data && data.data.length === 0) return <p>No hay equipos</p>

    if(data)
  return (
    <div>
        {
            data.map((item: any) => (
                <div>
                    <p>{item.nombre}</p>
                    <p>{item.nro_serie}</p>
                    <p>{item.tipo}</p>
                </div>
            ))
        }
    </div>
  )
}

export default ItemTable