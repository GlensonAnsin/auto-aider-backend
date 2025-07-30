import { Vehicle, User } from "../models/index.js";

// ADD VEHICLE
export const addVehicle = async (req, res) => {
    const user_id = req.user.user_id;
    const { make, model, year, date_added, is_deleted } = req.body;

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (user) {
            await Vehicle.create({
                user_id,
                make,
                model,
                year,
                date_added,
                is_deleted,
            });

            res.sendStatus(201);
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET VEHICLE
export const getVehicles = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const userVehicle = await Vehicle.findAll({ where: { user_id: user_id} });

        res.status(200).json(userVehicle);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// GET SCANNED VEHICLE
export const getScannedVehicle = async (req, res) => {
    const user_id = req.user.user_id;
    const { vehicle_id } = req.params;

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (user) {
            const scannedVehicle = await Vehicle.findOne({ where: { vehicle_id: vehicle_id } });
            res.status(200).json(scannedVehicle);
        }

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// REMOVE VEHICLE
export const removeVehicle = async (req, res) => {
    const user_id = req.user.user_id;
    const { vehicle_id } = req.params;

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (user) {
            const userVehicle = await Vehicle.findOne({ where: { vehicle_id: vehicle_id } });
            await userVehicle.destroy();
            req.io.emit('vehicleDeleted', { vehicleID: parseInt(vehicle_id) });
            res.sendStatus(200);
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};