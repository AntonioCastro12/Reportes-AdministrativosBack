export interface TransactionMonitorInterfaceXStore {
xs_storeId: string,
xs_workstation: string,
xs_businessDate: string,
xs_tranSeq: string,
xs_productId: string,
xs_qty: number,
xs_total: number
}

export interface TransactionMonitorInterfaceXHub {
xhub_storeId: string,
xhub_workstation: string,
xhub_businessDate: string,
xhub_tranSeq: string,
xhub_productId: string,
xhub_qty: number,
xhub_total: number
}