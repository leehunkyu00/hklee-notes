import { Query } from "react-apollo";
import { NOTE_FRAGMENT } from "./fragments";
import { GET_NOTES } from "./queries";

export const defaults = {
  notes: [
    {
      __typename: "Note",
      id: 1,
      title: "first",
      concent: "First content"
    }
  ]
};
export const typeDefs = [
  `
  schema {
        query:Query
        mutation: Mutation
    }
    type Query {
        notes: [Note]!
        note(id: Int!): Note
    }
    type Mutation {
        createNote(title: String!, content: String!): Note
        editNote(id: String!, title: String!, content: String!): Note
    }
    type Note {
        id: Int!
        title: String!
        content: String!
    }
    `
];
export const resolvers = {
  Query: {
    notes: (_, variable, { cache }) => {
      const id = cache.config.dataIdFromObject({ __typename: "Note", id: variable.id });

      const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id });
      return note;
    }
  },
  Mutation: {
    createNote: (_, variable, { cache }) => {
      const { notes } = cache.readQuery({ query: GET_NOTES });
      const { title, content } = variable;
      const newNote = {
        __typename: "Note",
        title,
        content,
        id: notes.length + 1
      };
      cache.writeData({
        data: {
          notes: [newNote, ...notes]
        }
      });
      console.log(notes);
      return newNote;
    }
  }
};
