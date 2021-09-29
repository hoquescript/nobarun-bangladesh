import { format } from 'date-fns';

export const QUERY_COLUMNS = [
  {
    Header: 'Full Name',
    Footer: 'Full Name',
    accessor: 'name',
    sticky: 'left',
  },
  {
    Header: 'Date',
    Footer: 'Date',
    accessor: 'createdAt',
    Cell: ({ value }) => format(new Date(value), 'do MMMM, yyyy'),
  },
  {
    Header: 'Message',
    Footer: 'Message',
    accessor: 'message',
  },
  {
    Header: 'Address',
    Footer: 'Address',
    accessor: 'address',
  },
  {
    Header: 'Email ID',
    Footer: 'Email ID',
    accessor: 'email',
  },
  {
    Header: 'Phone',
    Footer: 'Phone',
    accessor: 'phone',
  },
  {
    Header: 'SKU',
    Footer: 'SKU',
    accessor: 'productCode',
    Cell: ({ value }) => value.substring(0, 4),
  },
  {
    Header: 'Notes',
    Footer: 'Notes',
    accessor: 'notes',
  },
];
