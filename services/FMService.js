import{DB} from '../api/DB';
class FMServiceClass{
	constructor(){
        this.DB=DB;
        this.validTokenRequest=null;
    }

  add(item){
    return DB.add("hm-incomeAndExpenses",item) ;
  }
  //房费
  getRoomOrder(hotel_id,st,et){
    const db = uniCloud.database();
      const s1 = `hotel_id=='${hotel_id}'&&orderStatus==5`;
      const s2 = `checkInStartDateTimeStamp>=${st}&&checkInStartDateTimeStamp<${et}`;
      let w = `${s1}&&${s2}`;
     
    return  db.collection("hm-order").where(w).groupBy('hotel_id').groupField('sum(totalAmount) as amount').get()
  }  
 
}
//module.exports =new AccountService();
export var FMService=new FMServiceClass();