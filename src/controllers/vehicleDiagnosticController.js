import { VehicleDiagnostic, Vehicle, User } from "../models/index.js";

// ADD VEHICLE DIAGNOSTIC
export const addVehicleDiagnostic = async (req, res) => {
    const user_id = req.user.user_id;
    const { vehicle_id, dtc, technical_description, meaning, possible_causes, recommended_repair, datetime, scan_reference } = req.body;

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (user) {
            const vehicleDiagnostic = await VehicleDiagnostic.create({
                vehicle_id,
                dtc,
                technical_description,
                meaning,
                possible_causes,
                recommended_repair,
                datetime,
                scan_reference
            });

            res.status(201).json(vehicleDiagnostic);
        };

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// GET ALL VEHICLE DIAGNOSTIC
export const getAllVehicleDiagnostic = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const vehicles = await Vehicle.findAll({ where: { user_id: user_id } });

        const vehicleIds = vehicles.map((v) => v.vehicle_id);

        const diagnostic = await VehicleDiagnostic.findAll({
            where: {
                vehicle_id: vehicleIds,
            },
            include: [
                {
                    model: Vehicle,
                    attributes: ['make', 'model', 'year'],
                },
            ],
            order: [[ 'datetime', 'DESC' ]],
        });

        res.status(200).json(diagnostic);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET VEHICLE DIAGNOSTIC
export const getVehicleDiagnostic = async (req, res) => {
    const user_id = req.user.user_id;
    const { vehicle_id, scan_reference } = req.params;

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (user) {
            const vehicleDiagnostic = await VehicleDiagnostic.findAll({ where: { vehicle_id: vehicle_id, scan_reference: scan_reference } });

            res.status(200).json(vehicleDiagnostic);
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// REMOVE VEHICLE DIAGNOSTIC
export const removeVehicleDiagnostic = async (req, res) => {
    const { vehicle_diagnostic_id } = req.params;

    try {
        const diagnostic = await VehicleDiagnostic.findOne({ where: { vehicle_diagnostic_id: vehicle_diagnostic_id } });

        const deletedDiagnostic = await diagnostic.destroy();

        res.status(200).json(deletedDiagnostic);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};