import { ApolloServer, gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    beacon(name: String!): Beacon
    beacons: [Beacon!]!
  }

  type Beacon {
    id: ID!
    name: String!
    positions: [Positions!]!
  }

  type Positions {
    id: ID!
    device: String!
    rssi: Float!
    date: String!
    txpower: Int!
    alarmcode: Int
  }

  type Mutation {
    deleteBeacons: [Beacon]!
    updateBeacon(
      name: String!
      device: String!
      rssi: Float!
      txpower: Int!
      alarmcode: Int
    ): Beacon
  }
`;
