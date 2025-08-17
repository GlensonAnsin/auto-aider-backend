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
        is_deleted,
        completed_on,
        rejected_reason,
        longitude,
        latitude,
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
            completed_on,
            rejected_reason,
            longitude,
            latitude,
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

export const getRequestsForRepairShop = async (req, res) => {
    const repair_shop_id = req.user.repair_shop_id;

    try {
        const repShop = await AutoRepairShop.findOne({
            where: { repair_shop_id },
            include: [{
                model: MechanicRequest,
                required: true,
                include: [{
                    model: VehicleDiagnostic,
                    required: true,
                    include: [{
                        model: Vehicle,
                        required: true,
                        include: [{
                            model: User,
                            required: true,
                        }],
                    }],
                }],
            }],
        });

        res.status(200).json(repShop);
        
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// REJECT REQUEST
export const rejectRequest = async (req, res) => {
    const repair_shop_id = req.user.repair_shop_id;
    const { requestIDs } = req.body;

    try {
        const repShop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

        if (repShop) {
            for (item of requestIDs) {
                const request = await MechanicRequest.findOne({ where: { mechanic_request_id: item } });
                await request.update({
                    status: "Rejected",
                });
            };

            req.io.emit('requestDeleted', { requestIDs });
            res.sendStatus(200);
        };

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}