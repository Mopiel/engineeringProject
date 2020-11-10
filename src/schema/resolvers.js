import { Beacon } from "../models/Beacon";
import { Error } from "../models/Error";
import { Position } from "../models/Position";

export const resolvers = {
  Query: {
    beacon: async (_, { name }) => {
      return await Beacon.findOne({ name });
    },
    beacons: () => Beacon.find(),
    errors: () => Error.find(),
    error: async (_, { code }) => {
      return await Error.findOne({ code });
    },
    positions: () => Position.find(),
    position: async (_, { device }) => {
      const position = await Position.findOne({ device });
      if (position) {
        return position;
      } else {
        const newPosition = new Position({ device, x: 0, y: 0 });
        await newPosition.save();
        return newPosition;
      }
    },
  },

  Mutation: {
    setPosition: async (_, { device, x, y }) => {
      const oldPosition = await Position.findOne({ device });
      if (oldPosition) {
        await Position.updateOne(
          { device },
          {
            x,
            y,
          }
        );
        return Position.findOne({ device });
      } else {
        const newPosition = new Position({ device, x, y });
        await newPosition.save();
        return newPosition;
      }
    },

    deletePositions: async () => {
      await Position.deleteMany();
      return Position.find();
    },

    deleteBeacons: async () => {
      await Beacon.deleteMany();
      return Beacon.find();
    },

    createError: async (_, { code, message }) => {
      const oldError = await Error.findOne({ code });
      if (oldError) {
        await Error.updateOne(
          { code },
          {
            message,
          }
        );
        return Error.findOne({ code });
      } else {
        const newError = new Error({ code, message });
        await newError.save();
        return newError;
      }
    },

    deleteError: async (_, { code }) => {
      await Error.deleteOne({ code });
      return Error.find();
    },

    updateBeacon: async (_, { name, device, rssi, txpower, alarmcode }) => {
      const positionXY = await Position.findOne({ device });
      const { x, y } = positionXY ?? { x: 0, y: 0 };
      if (!positionXY) {
        const newPosition = new Position({ device, x, y });
        await newPosition.save();
      }
      const oldBeacon = await Beacon.findOne({ name });
      const date = Date.now().toString();
      if (!oldBeacon) {
        const newBeacon = new Beacon({
          name,
          positions: [{ device, rssi: [rssi], date, txpower, alarmcode, x, y }],
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
              "positions.$.rssi": [
                ...oldBeacon.positions[position].rssi,
                rssi,
              ].slice(-30),
              "positions.$.date": date,
              "positions.$.txpower": txpower,
              "positions.$.alarmcode": alarmcode,
              "positions.$.x": x,
              "positions.$.y": y,
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
              positions: [
                { device, rssi: [rssi], date, txpower, alarmcode, x, y },
              ],
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
