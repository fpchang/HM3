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
  //获取收入与支出分类
  getIncomeAndExpenses(hotel_id,billType='income',st,et){
    const db = uniCloud.database();
    const dbCmd = db.command;
    const w = {
      hotel_id:hotel_id,
      billType:billType,
      ioeTime:dbCmd.and(dbCmd.gte(st),dbCmd.lte(et))
    }
    const res =db.collection("hm-incomeAndExpenses").where(w).groupBy(' type as name').groupField('sum(amount) as value').get();
    return res
    
  }
   //按月统计
  getIncomeAndExpensesByMonth(hotel_id,billType='income',st,et){
    const db = uniCloud.database();
    const dbCmd = db.command;
    const w = {
      hotel_id:hotel_id,
      billType:billType,
      ioeTime:dbCmd.and(dbCmd.gte(st),dbCmd.lte(et))
    }
    const res =db.collection("hm-incomeAndExpenses").where(w).groupBy(' dateToString(timestampToDate(ioeTime),"%Y-%m-%d") as month').groupField('sum(amount) as value').get();
    return res
  }

  //获取当月收入统计
 async  getIncomeCurrentMonth(hotel_id){
    const db = uniCloud.database();
    const dbCmd = db.command;
    const monthFirst =new Date(new Date().getFullYear(),new Date().getMonth(),1).getTime();
		const monthLast =new Date(new Date().getFullYear(),new Date().getMonth()+1,1).getTime()-1;
    const w = {
      hotel_id:hotel_id,
      billType:'income',
      ioeTime:dbCmd.and(dbCmd.gte(monthFirst),dbCmd.lte(monthLast))
    }
    //房费
    const order = this.getRoomOrder(hotel_id,monthFirst,monthLast);
    const mt = db.collection("hm-incomeAndExpenses").where(w).getTemp()
    const other =db.collection(mt,"hm-incomeAndExpensesConfig").groupBy('type').groupField('sum(amount) as value').get();
    
    
    const res = await Promise.all([order,other]);
    let arr =[];
    res[1].result.data.map(item=>{
      arr.push({name:item.type[0].text,value:item.value})
    })
    arr.push({name:"房费",value: res[0].result.data[0].amount})
    console.log("1111",res)

    return arr;
  }
 

  //获取当月支出统计
  async  getExpensesCurrentMonth(hotel_id){
    const db = uniCloud.database();
    const dbCmd = db.command;
    const monthFirst =new Date(new Date().getFullYear(),new Date().getMonth(),1).getTime();
		const monthLast =new Date(new Date().getFullYear(),new Date().getMonth()+1,1).getTime()-1;
    const w = {
      hotel_id:hotel_id,
      billType:'expenses',
      ioeTime:dbCmd.and(dbCmd.gte(monthFirst),dbCmd.lte(monthLast))
    }
   
    const mt = db.collection("hm-incomeAndExpenses").where(w).getTemp()
    const res =await db.collection(mt,"hm-incomeAndExpensesConfig").groupBy('type').groupField('sum(amount) as value').get();
      let arr =[];
    res.result.data.map(item=>{
      arr.push({name:item.type[0].text,value:item.value})
    })
    console.log("222",res)
    return arr;
  }
 
}
//module.exports =new AccountService();
export var FMService=new FMServiceClass();