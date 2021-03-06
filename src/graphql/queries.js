/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPage = /* GraphQL */ `
  query GetPage($id: ID!) {
    getPage(id: $id) {
      id
      title
      page_data
      last_timestamp
      active
    }
  }
`;
export const listPages = /* GraphQL */ `
  query ListPages(
    $filter: TablePageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        page_data
        last_timestamp
        active
      }
      nextToken
    }
  }
`;
export const getImage = /* GraphQL */ `
  query GetImage($id: ID!) {
    getImage(id: $id) {
      id
      path
      added_on
    }
  }
`;
export const listImages = /* GraphQL */ `
  query ListImages(
    $filter: TableImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        path
        added_on
      }
      nextToken
    }
  }
`;
export const getContactForm = /* GraphQL */ `
  query GetContactForm($id: ID!) {
    getContactForm(id: $id) {
      id
      value
      timestamp
    }
  }
`;
export const listContactForms = /* GraphQL */ `
  query ListContactForms(
    $filter: TableContactFormFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContactForms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        value
        timestamp
      }
      nextToken
    }
  }
`;
