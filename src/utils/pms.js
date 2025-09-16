import { Vehicle, User, SavePushToken } from '../models/index.js';
import cron from 'node-cron';
import dayjs from 'dayjs';
import { sendPushToTokens } from './pushNotif.js';
import utc from 'dayjs/plugin/utc.js';
import { Notification } from '../models/index.js';

dayjs.extend(utc);

export const runPMSScheduler = () => {
  const getNextPMSDate = (lastPMSTrigger) => {
    return dayjs(lastPMSTrigger).add(3, 'month').utc(true).local();
  }

  cron.schedule('0 9 * * *', async () => {
    const vehicleData = await User.findAll({
      include: [{
        model: Vehicle,
        required: true,
      }],
    });

    const now = dayjs().utc(true).local();

    vehicleData.forEach(user => {
      user.vehicles.forEach(vehicle => {
        const nextPMS = getNextPMSDate(vehicle.last_pms_trigger);
        console.log(now);
        console.log(nextPMS);

        if (now.isSame(dayjs(nextPMS), 'day')) {
          (async () => {
            const tokens = await SavePushToken.findAll({ where: { user_id: user.user_id } });
            const tokenValues = tokens.map(t => t.token);

            await sendPushToTokens(tokenValues, {
              title: 'PMS Reminder',
              body: `${vehicle.year} ${vehicle.make} ${vehicle.model}: Time for your scheduled PMS today!`,
              data: { vehicleID: vehicle.vehicle_id },
            });

            await Notification.create({
              user_id: user.user_id,
              repair_shop_id: null,
              title: 'PMS Reminder',
              message: `${vehicle.year} ${vehicle.make} ${vehicle.model}: Time for your scheduled PMS today!`,
              is_read: false,
              created_at: dayjs().format(),
            });
          })();
        }

        if (now.isAfter(dayjs(nextPMS), 'day')) {
          (async () => {
            const tokens = await SavePushToken.findAll({ where: { user_id: user.user_id } });
            const tokenValues = tokens.map(t => t.token);

            await sendPushToTokens(tokenValues, {
              title: 'PMS Overdue',
              body: `${vehicle.year} ${vehicle.make} ${vehicle.model}: Your PMS is overdue!`,
              data: { vehicleID: vehicle.vehicle_id },
            });

            await Notification.create({
              user_id: user.user_id,
              repair_shop_id: null,
              title: 'PMS Overdue',
              message: `${vehicle.year} ${vehicle.make} ${vehicle.model}: Your PMS is overdue!`,
              is_read: false,
              created_at: dayjs().format(),
            });
          })();
        }
      });
    });
  });
}