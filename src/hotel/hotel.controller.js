import Hotel from './hotel.model.js' 
import User from '../user/user.model.js' 

export const createHotel = async (req, res) => {
    try {
        const imgs = req.imgs
        const data = req.body

        data.images = imgs
        

        const host = await User.findById(data.host)
        if (!host || !host.status) {
            return res.status(404).json({
                msg: "Host no encontrado"
            })
        }

        if (host.role !== "HOST_ROLE") {
            return res.status(400).json({
                msg: "El usuario asignado no tiene las credenciales necesarias"
            })
        }

        if (!imgs || imgs.length === 0) {
            return res.status(400).json({
            msg: "Se requiere al menos una imagen"
        }) 
        }

        const newHotel = await Hotel.create(data)

        return res.status(201).json({
            success: true,
            msg: "Hotel creado correctamente",
            newHotel
        })

    }catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al crear el hotel",
            error: error.message
        })
    }

}

export const getHotels = async (req, res) =>{
    try{
        const { limit = 10, from = 0 } = req.query
        const query = { status: true }
        const [total, hotels] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query)
            .populate("host", "name email")
            .populate("reservations", "room")
            .skip(Number(from))
            .limit(Number(limit))
        ])

        return res.status(200).json({
            success: true,
            total,
            hotels
        })
    }catch (error) {
        return res.status(500).json({
            msg: "Error al obtener los hoteles",
            error: error.message
        })
    }
}

export const getReservationsByHotel = async (req, res) => {
    try {
        const { hid } = req.params
        const hotel = await Hotel.findById(hid)
        .populate("reservations", "room")

        if(!hotel) {
            return res.status(404).json({
                msg: "Hotel no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            reservations: hotel.reservations
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener las reservaciones",
            error: error.message
        })
    }
}

export const getRoomsByHotel = async (req, res) => {
    try {
        const { hid } = req.params
        const hotel = await Hotel.findById(hid)
        .populate("rooms", "name price status")

        if(!hotel) {
            return res.status(404).json({
                msg: "Hotel no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            rooms: hotel.rooms
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener las habitaciones",
            error: error.message
        })
    }
}

export const getHotelById = async (req, res) => {
    try {
        const { hid } = req.params
        const hotel = await Hotel.findOne({ _id: hid, status: true })
        .populate("host", "name email")

        if(!hotel) {
            return res.status(404).json({
                msg: "Hotel no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            hotel
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener el hotel",
            error: error.message
        })
    }
}

export const updateHotel = async (req, res) => {
    try {
        const { hid } = req.params 
        const data = req.body 

        if (data.host) {
        const user = await User.findById(data.host) 

        if (!user || !user.status || user.role !== "HOST_ROLE") {
            return res.status(400).json({
            msg: "El usuario asignado no tiene las credenciales necesarias"
            }) 
        }
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(hid, data, { new: true }) 

        if (!updatedHotel) {
        return res.status(404).json({
            success: false,
            msg: "Hotel no encontrado"
        }) 
        }

        return res.status(200).json({
        success: true,
        msg: "Hotel actualizado correctamente",
        hotel: updatedHotel
        }) 

    } catch (error) {
        return res.status(500).json({
        success: false,
        msg: "Error al actualizar el hotel",
        error: error.message
        }) 
    }
} 

export const updateHotelPictures = async (req, res) => {
    try{
        const { hid } = req.params
        
        if(!req.imgs || req.imgs.length === 0) {
            return res.status(400).json({
                msg: "No se han subido imagenes"
            })
        }
        
        data.images = req.imgs

        const updatedHotel = await Hotel.findByIdAndUpdate(
            hid,
            { images: req.imgs },
            { new: true }
        ) 

        if (!updatedHotel) {
            return res.status(404).json({
                success: false,
                msg: "Hotel no encontrado"
        }) 
        }

        return res.status(200).json({
        success: true,
        msg: "Imágenes actualizadas correctamente",
        hotel: updatedHotel
    }) 
    }catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar las imagenes",
            error: error.message
        })
    }
}

export const deleteHotel = async (req, res) => {
    try {
        const { hid } = req.params

        const deletedHotel = await Hotel.findByIdAndUpdate(hid, { status: false }, { new: true })

        if(!deletedHotel) {
            return res.status(404).json({
                msg: "Hotel no encontrado"
            })
        }
        return res.status(200).json({
            success: true,
            msg: "Hotel eliminado correctamente",
            deletedHotel
        })
    }catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar el hotel",
            error: error.message
        })
    }
}

export const addComment = async (req, res) => {
    try {
        const { hid } = req.params;
        const { rating, comment } = req.body;
        const { usuario } = req;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                msg: "El rating debe ser un número entre 1 y 5"
            });
        }

        const hotel = await Hotel.findById(hid);

        if (!hotel) {
            return res.status(404).json({
                msg: "Hotel no encontrado"
            });
        }

        const today = new Date();
        const onlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        hotel.ratings.push({
            user: usuario.uid,
            rating,
            comment,
            date: onlyDate
        });

        await hotel.save();

        return res.status(200).json({
            success: true,
            msg: "Comentario y calificación agregados correctamente",
            hotel
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al agregar el comentario",
            error: error.message
        });
    }
}

