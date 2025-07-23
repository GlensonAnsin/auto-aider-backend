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
        vehicle_name
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
            vehicle_name,
        });

        res.sendStatus(200);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET REQUESTS
export const getRequests = async (req, res) => {
    const user_id = req.user.user_id;
    const repair_shop_id = req.user.repair_shop_id;
    const { user_type } = req.params;

    try {
        switch (user_type) {
            case 'car-owner':
                const userRequests = await User.findOne({ 
                    where: { user_id: user_id } ,
                    include: {
                        model: Vehicle,
                        include: {
                            model: VehicleDiagnostic,
                            include: {
                                model: MechanicRequest,
                                include: {
                                    model: AutoRepairShop,
                                }
                            }
                        }
                    }
                });

                if (!userRequests) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                const mechanicRequests = userRequests.Vehicles.flatMap(vehicle =>
                    vehicle.VehicleDiagnostics.flatMap(diagnostic =>
                        diagnostic.MechanicRequests
                    )
                );

                res.status(200).json(mechanicRequests);
                break;
            case 'repair-shop':
                const repairRequests = await AutoRepairShop.findOne({
                    where: { repair_shop_id: repair_shop_id },
                    include: {
                        model: MechanicRequest,
                    }
                });

                if (!repairRequests) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                res.status(200).json(repairRequests);
                break;
            default:
                return res.status(400).json({ error: 'Invalid request' });
        }
        
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};