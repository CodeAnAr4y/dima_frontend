export interface PurchaseHistory {
    id: number,
    created: Date,
    paid: boolean,
    client: number,
    product: number
}