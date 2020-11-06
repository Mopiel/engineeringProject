import { Beacon } from "../models/Beacon";
export const resolvers = {
  Query: {
    beacon: async (_, { name }) => {
      return await Beacon.findOne({ name: name });
    },
    beacons: () => Beacon.find(),
  },
  Mutation: {
    deleteBeacons: async () => {
      await Beacon.deleteMany();
      return Beacon.find();
    },

    updateBeacon: async (_, { name, device, rssi, txpower, alarmcode }) => {
      const oldBeacon = await Beacon.findOne({ name });
      const date = Date.now().toString();
      if (!oldBeacon) {
        const newBeacon = new Beacon({
          name,
          positions: [{ device, rssi, date, txpower, alarmcode }],
        });
        await newBeacon.save();
        return newBeacon;
      }
      const position = oldBeacon.positions.findIndex(
        (p) => p.device === device
      );
      if (position >= 0) {
        await Beacon.updateOne(
          { name, "positions.device": device },
          {
            $set: {
              "positions.$.rssi": rssi,
              "positions.$.date": date,
              "positions.$.txpower": txpower,
              "positions.$.alarmcode": alarmcode,
            },
          },
          (err, result) => {
            err && console.log(err);
          }
        );
        return await Beacon.findOne({ name });
      } else {
        await Beacon.updateOne(
          { name },
          {
            $addToSet: {
              positions: [{ device, rssi, date, txpower, alarmcode }],
            },
          },
          { upsert: true, new: true },
          (err, result) => {
            err && console.log(err);
          }
        );
        return await Beacon.findOne({ name });
      }
    },
  },
};
