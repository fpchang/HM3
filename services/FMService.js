import{DB} from '../api/DB';
class FMServiceClass{
	constructor(){
        this.DB=DB;
        this.validTokenRequest=null;
    }

  add(item){
    return DB.add("hm-incomeAndExpenses",item) ;
  }  
 
}
//module.exports =new AccountService();
export var FMService=new FMServiceClass();