import frappe from 'frappe';
import Document from 'frappe/model/document';

export default class PartyServer extends Document {
  beforeInsert() {
    if (this.customer && this.supplier) {
      throw new Error('Select a single party type.');
    }

    if (!this.customer && !this.supplier) {
      this.supplier = 1;
    }

    if (this.gstin && ['Unregistered', 'Consumer'].includes(this.gstType)) {
      this.gstin = '';
    }
  }

  async updateOutstandingAmount() {
    let isCustomer = this.customer;
    let doctype = isCustomer ? 'SalesInvoice' : 'PurchaseInvoice';
    let partyField = isCustomer ? 'customer' : 'supplier';

    const outstandingAmounts = await frappe.db.knex
      .select('outstandingAmount')
      .from(doctype)
      .where('submitted', 1)
      .andWhere(partyField, this.name);

    const totalOutstanding = outstandingAmounts
      .map(({ outstandingAmount }) => frappe.pesa(outstandingAmount))
      .reduce((a, b) => a.add(b), frappe.pesa(0));

    await this.set('outstandingAmount', totalOutstanding);
    await this.update();
  }
}
