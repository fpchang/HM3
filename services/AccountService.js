import{DB} from '../api/DB';
class AccountServiceClass{
	constructor(){
        this.DB=DB;
        this.validTokenRequest=null;
    }

  getConfig(){
    return DB.callFunction("hm_getConfig") ;
  }  
  validToken(){
    const token = uni.getStorageSync('hm_token');
    return DB.callFunction("hm_validToken") ;
  }
  login(userForm){    
    return DB.callFunction("hm_login", { userForm})
  }
  getuserByToken(){
    return DB.getCollection("hm-user",{hm_token:uni.getStorageSync("hm_token")});
  }
  updateUserName(_id,userName){
    return DB.update("hm-user",_id,{userName});
  }
}
//module.exports =new AccountService();
export var AccountService=new AccountServiceClass();