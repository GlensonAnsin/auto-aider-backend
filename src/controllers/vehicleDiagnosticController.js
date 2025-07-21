import { VehicleDiagnostic, Vehicle, User } from "../models/index.js";

// ADD VEHICLE DIAGNOSTIC
export const addVehicleDiagnostic = async (req, res) => {
    const user_id = req.user.user_id;
    const { vehicle_id, dtc, technical_description, meaning, possible_causes, recommended_repair, date, scan_reference } = req.body;

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
                date,
                scan_reference
            });

            res.status(201).json(vehicleDiagnostic);
        };

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// GET ALL VEHICLE DIAGNOSTICS
export const getVehicleDiagnostics = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const vehicles = await Vehicle.findAll({ where: { user_id: user_id } });

        const vehicleIds = vehicles.map((v) => v.vehicle_id);

        const diagnostics = await VehicleDiagnostic.findAll({
            where: {
                vehicle_id: vehicleIds,
            },
            include: [
                {
                    model: Vehicle,
                    attributes: ['make', 'model', 'year'],
                },
            ],
            order: [['vehicle_diagnostic_id', 'ASC']],
        });

        const diagnosticsWithVehicle = diagnostics.map((diag) => {
            const d = diag.toJSON();
            return {
                ...d,
                make: d.vehicle?.make,
                model: d.vehicle?.model,
                year: d.vehicle?.year,
            };
        });
        
        res.status(200).json(diagnosticsWithVehicle);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET ONGOING VEHICLE DIAGNOSTICS
export const getOnVehicleDiagnostic = async (req, res) => {
    const user_id = req.user.user_id;
    const { vehicle_id, scan_reference } = req.params;

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (user) {
            const onVehicleDiagnostic = await VehicleDiagnostic.findAll({ where: { vehicle_id: vehicle_id, scan_reference: scan_reference } });
            res.status(200).json(onVehicleDiagnostic);
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET DETAILS OF ONGOING SPECIFIC VEHICLE DIAGNOSTIC
export const getOnSpecificVehicleDiagnostic = async (req, res) => {
    const user_id = req.user.user_id;
    const { vehicle_diagnostic_id } = req.params;

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (user) {
            const onSpecificVehicleDiag = await VehicleDiagnostic.findOne({ where: { vehicle_diagnostic_id: vehicle_diagnostic_id } });
            res.status(200).json(onSpecificVehicleDiag);
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

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