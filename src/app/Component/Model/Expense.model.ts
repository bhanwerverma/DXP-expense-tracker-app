export interface Expense{
    UserId?:number | null,
    Transaction_id?:number,
    Amount:number,
    Type:string,
    Description:string,
    Category:string,
    Date:string,
    Time:string
}