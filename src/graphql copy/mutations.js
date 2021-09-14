/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPage = /* GraphQL */ `
  mutation CreatePage($input: CreatePageInput!) {
    createPage(input: $input) {
      id
      title
      page_data
      last_timestamp
      active
    }
  }
`;
export const updatePage = /* GraphQL */ `
  mutation UpdatePage($input: UpdatePageInput!) {
    updatePage(input: $input) {
      id
      title
      page_data
      last_timestamp
      active
    }
  }
`;
export const deletePage = /* GraphQL */ `
  mutation DeletePage($input: DeletePageInput!) {
    deletePage(input: $input) {
      id
      title
      page_data
      last_timestamp
      active
    }
  }
`;
export const createImage = /* GraphQL */ `
  mutation CreateImage($input: CreateImageInput!) {
    createImage(input: $input) {
      id
      path
      added_on
    }
  }
`;
export const updateImage = /* GraphQL */ `
  mutation UpdateImage($input: UpdateImageInput!) {
    updateImage(input: $input) {
      id
      path
      added_on
    }
  }
`;
export const deleteImage = /* GraphQL */ `
  mutation DeleteImage($input: DeleteImageInput!) {
    deleteImage(input: $input) {
      id
      path
      added_on
    }
  }
`;
