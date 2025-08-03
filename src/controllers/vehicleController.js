import { Vehicle, User } from "../models/index.js";

// ADD VEHICLE
export const addVehicle = async (req, res) => {
    const user_id = req.user.user_id;
    const {
        make,
        model,
        year,
        date_added,
        is_deleted
    } = req.body;

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

            const updatedVehicleList = await Vehicle.findAll({ where: { user_id: user_id } });

            req.io.emit('vehicleAdded', { vehicleAdded: true });
            req.io.emit('updatedVehicleList', { updatedVehicleList });
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
        const filterDeleted = userVehicle.filter((item) => item.is_deleted !== true);
        res.status(200).json(filterDeleted);

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

// DELETE VEHICLE
export const deleteVehicle = async (req, res) => {
    const user_id = req.user.user_id;
    const { vehicle_id } = req.body;

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (user) {
            const userVehicle = await Vehicle.findOne({ where: { vehicle_id: vehicle_id } });
            
            await userVehicle.update({
                is_deleted: true,
            });

            const allVehicles = await Vehicle.findAll({ where: { user_id: user_id } });
            let verifier = [];

            allVehicles.map((item) => {
                verifier.push(item.is_deleted);
            });

            const isVehicles = verifier.includes(false);
            req.io.emit('vehicleDeleted', { vehicleID: userVehicle.vehicle_id });

            if (!isVehicles) {
                req.io.emit('noVehicles', { noVehicles: false });
            }

            res.sendStatus(200);
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};