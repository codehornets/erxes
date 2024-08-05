import gql from "graphql-tag";
import {
  types as checkListTypes,
  queries as checkListQueries,
  mutations as checkListMutations
} from "./schema/checklist";
import {
  types as boardTypes,
  queries as boardQueries,
  mutations as boardMutations
} from "./schema/board";

import {
  types as ticketTypes,
  queries as ticketQueries,
  mutations as ticketMutations
} from "./schema/ticket";

import {
  types as plTypes,
  queries as plQueries,
  mutations as plMutations
} from "./schema/pipelineLabel";
import {
  types as ptTypes,
  queries as ptQueries,
  mutations as ptMutations
} from "./schema/pipelineTemplate";
import { types as CommonTypes } from "./schema/common";
import { isEnabled } from "@erxes/api-utils/src/serviceDiscovery";

const typeDefs = async () => {
  const contactsEnabled = await isEnabled("contacts");
  const formsEnabled = await isEnabled("forms");
  const clientPortalEnabled = await isEnabled("clientportal");

  const isEnabledTable = {
    contacts: contactsEnabled,
    forms: formsEnabled,
    clientPortal: clientPortalEnabled
  };

  return gql`
    scalar JSON
    scalar Date

    extend type User @key(fields: "_id") {
      _id: String! @external
    }
  
    extend type Branch @key(fields: "_id") {
          _id: String! @external
    }

    extend type Department @key(fields: "_id") {
          _id: String! @external
    }

    ${
      contactsEnabled
        ? `
        extend type Company @key(fields: "_id") {
          _id: String! @external
        }
  
        extend type Customer @key(fields: "_id") {
          _id: String! @external
        }
      `
        : ""
    }

      extend type Tag @key(fields: "_id") {
          _id: String! @external
        } 
    
    ${
      clientPortalEnabled
        ? `
        extend type ClientPortalUser @key(fields: "_id") {
          _id: String! @external
        }
      `
        : ""
    }
    ${boardTypes()}
    ${ticketTypes(isEnabledTable)}

    ${plTypes}
    ${ptTypes}
    ${CommonTypes}
    ${checkListTypes}
    
    extend type Query {
      ${boardQueries}
      ${ticketQueries}
      ${plQueries}
      ${ptQueries}
      ${checkListQueries}
    }
    
    extend type Mutation {
      ${boardMutations}
      ${ticketMutations}
      ${plMutations}
      ${ptMutations}
      ${checkListMutations}
    }
  `;
};

export default typeDefs;
