import { Vehicle } from "../models/index.js";

// ADD VEHICLE
export const addVehicle = async (req, res) => {
    const user_id = req.user.user_id;
    const { make, model, year, date_added } = req.body;

    try {
        const vehicle = await Vehicle.create({
            user_id,
            make,
            model,
            year,
            date_added
        });

        res.status(201).json(vehicle)

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// RETRIEVE VEHICLE
export const getVehicles = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const userVehicle = await Vehicle.findAll({ where: { user_id: user_id} });

        res.status(200).json(userVehicle);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// REMOVE VEHICLE
export const removeVehicle = async (req, res) => {
    const user_id = req.user.user_id;
    const { vehicle_id } = req.params;

    try {
        const userVehicle = await Vehicle.findOne({ where: { user_id: user_id, vehicle_id: vehicle_id } });

        const deletedVehicle = await userVehicle.destroy();

        req.io.emit('vehicleDeleted', { vehicleID: parseInt(vehicle_id) })

        res.status(200).json(deletedVehicle);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};