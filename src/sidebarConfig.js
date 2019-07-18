import frappe from 'frappejs';
import { _ } from 'frappejs/utils';
const path = require('path');

export default {
  getTitle: async () => {
    const accountingSettings = await frappe.getSingle('AccountingSettings');
    return accountingSettings.companyName;
  },
  getDbName() {
    if (localStorage.dbPath) {
      const parts = localStorage.dbPath.split(path.sep);
      return parts[parts.length - 1];
    }
  },
  getGroups() {
    return this.groups.map(g => g.title);
  },
  getItems(groupTitle) {
    if (groupTitle)
      return this.groups.filter(g => g.title === groupTitle)[0].items;
    else return [];
  },
  groups: [
    {
      title: _('Masters'),
      items: [
        {
          label: _('Chart Of Accounts'),
          route: '/chartOfAccounts'
        },
        {
          label: _('Item'),
          route: '/list/Item'
        },
        {
          label: _('Customer'),
          route: '/list/Customer'
        },
        {
          label: _('Supplier'),
          route: '/list/Supplier'
        },
        {
          label: _('Tax'),
          route: '/list/Tax'
        }
      ]
    },
    {
      title: _('Transactions'),
      items: [
        {
          label: _('Invoice'),
          route: '/list/Invoice'
        },
        {
          label: _('Journal Entry'),
          route: '/list/JournalEntry'
        },
        {
          label: _('Payment'),
          route: '/list/Payment'
        }
        // {
        //   label: _('AccountingLedgerEntry'), route: '/list/AccountingLedgerEntry'
        // },
      ]
    },
    {
      title: _('Reports'),
      items: [
        {
          label: _('General Ledger'),
          route: '/report/general-ledger'
        },
        {
          label: _('Trial Balance'),
          route: '/report/trial-balance'
        },
        {
          label: _('Sales Register'),
          route: '/report/sales-register'
        },
        {
          label: _('Bank Reconciliation'),
          route: '/report/bank-reconciliation'
        },
        {
          label: _('Goods and Service Tax'),
          route: '/report/gst-taxes'
        }
      ]
    },
    {
      title: _('Tools'),
      items: [
        {
          label: _('Data Import'),
          route: '/data-import'
        },
        {
          label: _('Settings'),
          route: '/settings'
        }
      ]
    }
  ]
};
