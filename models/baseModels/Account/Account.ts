import { Fyo } from 'fyo';
import { Doc } from 'fyo/model/doc';
import {
  DefaultMap,
  FiltersMap,
  ListViewSettings,
  RequiredMap,
  TreeViewSettings,
} from 'fyo/model/types';
import { QueryFilter } from 'utils/db/types';
import { AccountRootType, AccountRootTypeEnum, AccountType } from './types';

export class Account extends Doc {
  rootType?: AccountRootType;
  accountType?: AccountType;
  parentAccount?: string;

  get isDebit() {
    const debitAccounts = [
      AccountRootTypeEnum.Asset,
      AccountRootTypeEnum.Expense,
    ] as AccountRootType[];
    return debitAccounts.includes(this.rootType!);
  }

  get isCredit() {
    return !this.isDebit;
  }

  required: RequiredMap = {
    /**
     * Added here cause rootAccounts don't have parents
     * they are created during initialization. if this is
     * added to the schema it will cause NOT NULL errors
     */

    parentAccount: () => true,
  };

  static defaults: DefaultMap = {
    /**
     * NestedSet indices are actually not used
     * this needs updation as they may be required
     * later on.
     */
    lft: () => 0,
    rgt: () => 0,
  };

  async beforeSync() {
    if (this.accountType || !this.parentAccount) {
      return;
    }

    const account = await this.fyo.db.get(
      'Account',
      this.parentAccount as string
    );
    this.accountType = account.accountType as AccountType;
  }

  static getListViewSettings(): ListViewSettings {
    return {
      columns: ['name', 'parentAccount', 'rootType'],
    };
  }

  static getTreeSettings(fyo: Fyo): void | TreeViewSettings {
    return {
      parentField: 'parentAccount',
      async getRootLabel(): Promise<string> {
        const accountingSettings = await fyo.doc.getDoc('AccountingSettings');
        return accountingSettings.companyName as string;
      },
    };
  }

  static filters: FiltersMap = {
    parentAccount: (doc: Doc) => {
      const filter: QueryFilter = {
        isGroup: true,
      };

      if (doc.rootType) {
        filter.rootType = doc.rootType as string;
      }

      return filter;
    },
  };
}
