import { ApolloServer, gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    beacon(name: String!): Beacon
    beacons: [Beacon!]!
    errors: [Error!]!
    error(code: String!): Error!
    positions: [Cords!]!
    position(device: String!): Cords!
  }

  type Beacon {
    id: ID!
    name: String!
    positions: [Positions!]!
  }

  type Error {
    id: ID!
    code: Int!
    message: String!
  }

  type Cords {
    id: ID!
    device: String!
    x: Float!
    y: Float!
  }

  type Positions {
    id: ID!
    x: Float!
    y: Float!
    device: String!
    rssi: [Float!]!
    date: String!
    txpower: Int!
    alarmcode: Int
  }

  type Mutation {
    setPosition(device: String!, x: Float!, y: Float!): Cords!
    deletePositions: [Cords]!
    createError(code: Int!, message: String!): Error!
    deleteError(code: Int!): [Error]!
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
