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

    updateBeacon: async (_, { name, device, rssi }) => {
      const oldBeacon = await Beacon.findOne({ name });
      // console.log(parseInt(oldBeacon.positions[0].date))
      const date = Date.now().toString()
      if (!oldBeacon) {
        const newBeacon = new Beacon({
          name,
          positions: [{ device, rssi, date }],
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
              positions: [{ device, rssi, date }],
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
