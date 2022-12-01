import { Fyo } from 'fyo';
import { ModelNameEnum } from 'models/types';
import { StockMovement } from '../StockMovement';
import { StockTransfer } from '../StockTransfer';
import { MovementType } from '../types';

type ALE = {
  date: string;
  account: string;
  party: string;
  debit: string;
  credit: string;
  reverted: number;
};

type SLE = {
  date: string;
  name: string;
  item: string;
  location: string;
  rate: string;
  quantity: string;
};

type Transfer = {
  item: string;
  from?: string;
  to?: string;
  quantity: number;
  rate: number;
};

interface TransferTwo extends Omit<Transfer, 'from' | 'to'> {
  location: string;
}

export function getItem(name: string, rate: number) {
  return { name, rate, trackItem: true };
}

export async function getStockTransfer(
  schemaName: ModelNameEnum.PurchaseReceipt | ModelNameEnum.Shipment,
  party: string,
  date: Date,
  transfers: TransferTwo[],
  fyo: Fyo
): Promise<StockTransfer> {
  const doc = fyo.doc.getNewDoc(schemaName, { party, date }) as StockTransfer;
  for (const { item, location, quantity, rate } of transfers) {
    await doc.append('items', { item, location, quantity, rate });
  }
  return doc;
}

export async function getStockMovement(
  movementType: MovementType,
  date: Date,
  transfers: Transfer[],
  fyo: Fyo
): Promise<StockMovement> {
  const doc = fyo.doc.getNewDoc(ModelNameEnum.StockMovement, {
    movementType,
    date,
  }) as StockMovement;

  for (const {
    item,
    from: fromLocation,
    to: toLocation,
    quantity,
    rate,
  } of transfers) {
    await doc.append('items', {
      item,
      fromLocation,
      toLocation,
      rate,
      quantity,
    });
  }

  return doc;
}

export async function getSLEs(
  referenceName: string,
  referenceType: string,
  fyo: Fyo
) {
  return (await fyo.db.getAllRaw(ModelNameEnum.StockLedgerEntry, {
    filters: { referenceName, referenceType },
    fields: ['date', 'name', 'item', 'location', 'rate', 'quantity'],
  })) as SLE[];
}

export async function getALEs(
  referenceName: string,
  referenceType: string,
  fyo: Fyo
) {
  return (await fyo.db.getAllRaw(ModelNameEnum.AccountingLedgerEntry, {
    filters: { referenceName, referenceType },
    fields: ['date', 'account', 'party', 'debit', 'credit', 'reverted'],
  })) as ALE[];
}
