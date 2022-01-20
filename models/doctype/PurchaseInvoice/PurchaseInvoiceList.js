import { _ } from 'frappetils';
import { getStatusColumn } from '../Transaction/Transaction';

export default {
  doctype: 'PurchaseInvoice',
  title: _('Bills'),
  formRoute: (name) => `/edit/PurchaseInvoice/${name}`,
  columns: [
    'supplier',
    'name',
    getStatusColumn('PurchaseInvoice'),
    'date',
    'grandTotal',
    'outstandingAmount',
  ],
};
