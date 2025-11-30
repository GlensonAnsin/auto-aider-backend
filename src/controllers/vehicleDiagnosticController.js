import { VehicleDiagnostic, Vehicle, User, AutoRepairShop } from "../models/index.js";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

// ADD VEHICLE DIAGNOSTIC
export const addVehicleDiagnostic = async (req, res) => {
  const user_id = req.user.user_id;
  const {
    vehicle_id,
    dtc,
    technical_description,
    meaning,
    possible_causes,
    recommended_repair,
    date,
    scan_reference,
    vehicle_issue_description,
    is_deleted
  } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      await VehicleDiagnostic.create({
        vehicle_id,
        dtc,
        technical_description,
        meaning,
        possible_causes,
        recommended_repair,
        date,
        scan_reference,
        vehicle_issue_description,
        is_deleted,
      });

      res.sendStatus(201);
    };
  } catch (e) {
    res.status(500).json({ error: e.message });
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

    const filterDeleted = diagnostics.filter((item) => item.is_deleted !== true && item.vehicle_issue_description === 'No Codes Detected' ? item.vehicle_issue_description : item.dtc !== null);

    const diagnosticsWithVehicle = filterDeleted.map((diag) => {
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

// GET ONGOING VEHICLE DIAGNOSTICS (CAR OWNER)
export const getOnVehicleDiagnosticCO = async (req, res) => {
  const user_id = req.user.user_id;
  const {
    vehicle_id,
    scan_reference
  } = req.params;

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

// GET ONGOING VEHICLE DIAGNOSTICS (REPAIR SHOP)
export const getOnVehicleDiagnosticRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const {
    vehicle_id,
    scan_reference
  } = req.params;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
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

// DELETE VEHICLE DIAGNOSTIC
export const deleteVehicleDiagnostic = async (req, res) => {
  const user_id = req.user.user_id;
  const { scan_reference } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const diagnostics = await VehicleDiagnostic.findAll({ where: { scan_reference: scan_reference } });

      await Promise.all(
        diagnostics.map((item) => item.update({
          is_deleted: true,
        }))
      );

      const deletedVehicleDiag = diagnostics.map((item) => item.scan_reference);
      req.io.emit(`vehicleDiagnosticDeleted-CO-${user_id}`, { deletedVehicleDiag: deletedVehicleDiag });
      res.sendStatus(200);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE ALL VEHICLE DIAGNOSTICS
export const deleteAllVehicleDiagnostics = async (req, res) => {
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
        }],
      }],
    });

    let allDeletedVehicleDiag = []

    if (user.vehicles) {
      await Promise.all(
        user.vehicles.map(async (vehicle) => {
          if (vehicle.vehicle_diagnostics) {
            await Promise.all(
              vehicle.vehicle_diagnostics.map(async (diagnostic) => {
                if (diagnostic) {
                  allDeletedVehicleDiag.push(diagnostic.scan_reference);
                  const vehicleDiag = await VehicleDiagnostic.findOne({ where: { vehicle_diagnostic_id: diagnostic.vehicle_diagnostic_id } });
                  await vehicleDiag.update({
                    is_deleted: true,
                  });
                }
              })
            );
          }
        })
      );
    }

    req.io.emit(`allVehicleDiagnosticDeleted-CO-${user_id}`, { allDeletedVehicleDiag: allDeletedVehicleDiag });
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// COUNT ALL SCANS TODAY (ADMIN)
export const countScansToday = async (req, res) => {
  const user_id = req.user.user_id;
  
  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const scans = await VehicleDiagnostic.findAll();
      const filterToday = scans.filter((item) => dayjs(item.date).utc(true).isSame(dayjs().utc(true), 'day'));

      const grouped = Object.values(
        [...filterToday].reduce(
          (acc, item) => {
            const ref = item.scan_reference;

            if (!acc[ref]) {
              acc[ref] = {
                scan_reference: ref,
              }
            };

            return acc;
          },
          {}
        )
      );

      const countScansToday = grouped.length;
      res.status(200).json(countScansToday);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET CAR RECENT SCANS (CAR OWNER)
export const getRecentScansCO = async (req, res) => {
  const user_id = req.user.user_id;
  const { vehicle_id } = req.params;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const diagnostics = await VehicleDiagnostic.findAll({ where: { vehicle_id: vehicle_id, } });
      const recentScans = diagnostics.filter((item) => item.vehicle_issue_description === 'No Codes Detected' ? item.vehicle_issue_description : item.dtc !== null);
      res.status(200).json(recentScans);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET CAR RECENT SCANS (REPAIR SHOP)
export const getRecentScansRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { vehicle_id } = req.params;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      const diagnostics = await VehicleDiagnostic.findAll({ where: { vehicle_id: vehicle_id, } });
      const recentScans = diagnostics.filter((item) => item.vehicle_issue_description === 'No Codes Detected' ? item.vehicle_issue_description : item.dtc !== null);
      res.status(200).json(recentScans);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
