import { AutoRepairShop, MechanicRequest, User, Vehicle, VehicleDiagnostic } from '../models/index.js';

// ADD REQUEST
export const addRequest = async (req, res) => {
    const user_id = req.user.user_id;
    const { 
        vehicle_diagnostic_id,
        repair_shop_id,
        repair_procedure,
        request_datetime,
        status,
        is_deleted
    } = req.body;

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await MechanicRequest.create({
            vehicle_diagnostic_id,
            repair_shop_id,
            repair_procedure,
            request_datetime,
            status,
            is_deleted,
        });

        res.sendStatus(201);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET REQUESTS
export const getRequestsForCarOwner = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const user = await User.findOne({
            where: { user_id },
            include: [{
                model: Vehicle,
                required: true,
                include: [{
                    model: VehicleDiagnostic,
                    required: true,
                    include: [{
                        model: MechanicRequest,
                        required: true,
                    }],
                }],
            }],
        });

        res.status(200).json(user);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
