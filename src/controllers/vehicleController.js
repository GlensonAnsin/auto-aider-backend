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
    const { user_id } = req.body;

    try {
        const userVehicle = await Vehicle.findAll({ where: { user_id: user_id} });

        res.status(200).json(userVehicle);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// UPDATE VEHICLE
export const updateVehicle = async (req, res) => {
    const { vehicle_id, make, model, year } = req.body;

    try {
        const userVehicle = await Vehicle.findOne({
            where: { vehicle_id: vehicle_id },
            attributes: ['make', 'model', 'year'],
        });

        const updatedVehicle = await userVehicle.update({
            make: make,
            model: model,
            year: year
        });

        res.status(201).json(updatedVehicle);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// REMOVE VEHICLE
export const removeVehicle = async (req, res) => {
    const { vehicle_id } = req.body;

    try {
        const userVehicle = await Vehicle.findOne({ where: { vehicle_id: vehicle_id } });

        const deletedVehicle = await userVehicle.destroy();

        res.status(200).json(deletedVehicle);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};