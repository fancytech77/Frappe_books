import frappe from 'frappe';
import Document from 'frappe/model/document';

export default class Account extends Document {
  async validate() {
    if (!this.accountType && this.parentAccount) {
      this.accountType = await frappe.db.getValue(
        'Account',
        this.parentAccount,
        'accountType'
      );
    }
  }
}
