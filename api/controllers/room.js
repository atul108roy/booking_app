import Room from "../models/Room.js"
import Hotel from "../models/Hotel.js"

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updatedRoom = async (req, res, next) => {
 
  try{
    const updatedRoom= await Room.findByIdAndUpdate(req.params.id,
      {$set:req.body},
      {new:true}
    )
    res.status(200).json(updatedRoom);
  }catch(err){
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    const result = await Room.updateOne(
      { "roomNumbers._id": req.params.id }, // Match the room ID
      {
        $push: {
          "roomNumbers.$.unavailableDates": { $each: req.body.dates },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Room not found or already reserved." });
    }

    res.status(200).json({ message: "Room status updated successfully." });
  } catch (err) {
    console.error("Error updating room availability:", err);
    next(err);
  }
};



export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  try{
    const room= await Room.findById(req.params.id,);
    res.status(200).json(room);
  }catch(err){
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  try{
    const rooms= await Room.find();
    res.status(200).json(rooms);
  }catch(err){
    next(err);
  }
};