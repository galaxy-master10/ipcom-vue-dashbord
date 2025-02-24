// src/config/tableHeaders.js
export const customerHeaders = [
  { title: 'ID', key: 'id', sortable: true, category: 'Primary' },
  { title: 'Customer ID', key: 'customerId', sortable: true, category: 'Primary' },
  { title: 'Contact ID', key: 'customerContactId', sortable: true, category: 'Primary' },
  { title: 'Source', key: 'sourceId', sortable: false, category: 'Primary' },
  { title: 'Customer Name', key: 'customerName', sortable: true, category: 'Basic Info' },
  { title: 'First Name', key: 'firstName', sortable: true, category: 'Basic Info' },
  { title: 'Name', key: 'name', sortable: true, category: 'Basic Info' },
  { title: 'Email', key: 'email', sortable: true, category: 'Contact' },
  { title: 'Mobile', key: 'mobile', sortable: false, category: 'Contact' },
  { title: 'Web', key: 'web', sortable: false, category: 'Contact' },
  { title: 'Street', key: 'addressStreet', sortable: false, category: 'Address' },
  { title: 'Number', key: 'addressNumber', sortable: false, category: 'Address' },
  { title: 'Postal Code', key: 'addressPostalCode', sortable: false, category: 'Address' },
  { title: 'City', key: 'addressCity', sortable: true, category: 'Address' },
  { title: 'Country', key: 'addressCountry', sortable: true, category: 'Address' },
  { title: 'VAT Number', key: 'vatNumber', sortable: true, category: 'Additional' },
  { title: 'Language', key: 'language', sortable: true, category: 'Additional' },
  { title: 'Created', key: 'createdTS', sortable: true, category: 'Additional' }
]
