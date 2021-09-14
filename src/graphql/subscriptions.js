/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePage = /* GraphQL */ `
  subscription OnCreatePage(
    $id: ID
    $title: String
    $page_data: String
    $last_timestamp: AWSTimestamp
    $active: Boolean
  ) {
    onCreatePage(
      id: $id
      title: $title
      page_data: $page_data
      last_timestamp: $last_timestamp
      active: $active
    ) {
      id
      title
      page_data
      last_timestamp
      active
    }
  }
`;
export const onUpdatePage = /* GraphQL */ `
  subscription OnUpdatePage(
    $id: ID
    $title: String
    $page_data: String
    $last_timestamp: AWSTimestamp
    $active: Boolean
  ) {
    onUpdatePage(
      id: $id
      title: $title
      page_data: $page_data
      last_timestamp: $last_timestamp
      active: $active
    ) {
      id
      title
      page_data
      last_timestamp
      active
    }
  }
`;
export const onDeletePage = /* GraphQL */ `
  subscription OnDeletePage(
    $id: ID
    $title: String
    $page_data: String
    $last_timestamp: AWSTimestamp
    $active: Boolean
  ) {
    onDeletePage(
      id: $id
      title: $title
      page_data: $page_data
      last_timestamp: $last_timestamp
      active: $active
    ) {
      id
      title
      page_data
      last_timestamp
      active
    }
  }
`;
export const onCreateImage = /* GraphQL */ `
  subscription OnCreateImage($id: ID, $path: String, $added_on: AWSTimestamp) {
    onCreateImage(id: $id, path: $path, added_on: $added_on) {
      id
      path
      added_on
    }
  }
`;
export const onUpdateImage = /* GraphQL */ `
  subscription OnUpdateImage($id: ID, $path: String, $added_on: AWSTimestamp) {
    onUpdateImage(id: $id, path: $path, added_on: $added_on) {
      id
      path
      added_on
    }
  }
`;
export const onDeleteImage = /* GraphQL */ `
  subscription OnDeleteImage($id: ID, $path: String, $added_on: AWSTimestamp) {
    onDeleteImage(id: $id, path: $path, added_on: $added_on) {
      id
      path
      added_on
    }
  }
`;
export const onCreateContactForm = /* GraphQL */ `
  subscription OnCreateContactForm(
    $id: ID
    $value: String
    $timestamp: String
  ) {
    onCreateContactForm(id: $id, value: $value, timestamp: $timestamp) {
      id
      value
      timestamp
    }
  }
`;
export const onUpdateContactForm = /* GraphQL */ `
  subscription OnUpdateContactForm(
    $id: ID
    $value: String
    $timestamp: String
  ) {
    onUpdateContactForm(id: $id, value: $value, timestamp: $timestamp) {
      id
      value
      timestamp
    }
  }
`;
export const onDeleteContactForm = /* GraphQL */ `
  subscription OnDeleteContactForm(
    $id: ID
    $value: String
    $timestamp: String
  ) {
    onDeleteContactForm(id: $id, value: $value, timestamp: $timestamp) {
      id
      value
      timestamp
    }
  }
`;
