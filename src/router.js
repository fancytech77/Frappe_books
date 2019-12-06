import Vue from 'vue';
import Router from 'vue-router';

import ListView from '@/pages/ListView/ListView';
import Dashboard from '@/pages/Dashboard/Dashboard';
import PrintView from '@/pages/PrintView/PrintView';
import QuickEditForm from '@/pages/QuickEditForm';

import Report from '@/pages/Report.vue';

import ChartOfAccounts from '@/pages/ChartOfAccounts';

import InvoiceForm from '@/pages/InvoiceForm';
import JournalEntryForm from '@/pages/JournalEntryForm';


Vue.use(Router);

const routes = [
  {
    path: '/',
    component: Dashboard
  },
  {
    path: '/edit/JournalEntry/:name',
    name: 'JournalEntryForm',
    components: {
      default: JournalEntryForm,
      edit: QuickEditForm
    },
    props: {
      default: true,
      edit: route => route.query
    }
  },
  {
    path: '/edit/:doctype/:name',
    name: 'InvoiceForm',
    components: {
      default: InvoiceForm,
      edit: QuickEditForm
    },
    props: {
      default: true,
      edit: route => route.query
    }
  },
  {
    path: '/list/:doctype',
    name: 'ListView',
    components: {
      default: ListView,
      edit: QuickEditForm
    },
    props: {
      default: route => {
        const { doctype } = route.params;
        return {
          doctype,
          filters: route.query.filters
        };
      },
      edit: route => route.query
    }
  },
  {
    path: '/print/:doctype/:name',
    name: 'PrintView',
    component: PrintView,
    props: true
  },
  {
    path: '/report/:reportName',
    name: 'Report',
    component: Report,
    props: true
  },
  {
    path: '/chartOfAccounts',
    name: 'Chart Of Accounts',
    components: {
      default: ChartOfAccounts,
      edit: QuickEditForm
    },
    props: {
      default: true,
      edit: route => route.query
    }
  }
];

let router = new Router({ routes });

if (process.env.NODE_ENV === 'development') {
  window.router = router;
}

export default router;
