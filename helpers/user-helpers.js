const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
module.exports = {
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let userStatus={}
            let exUser = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
                if(exUser===null){
                    userStatus.status=true
                    userData.password = await bcrypt.hash(userData.password,10)
                    db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                        resolve(userStatus)
                    })
                }else{
                    resolve({status:false})
                }
                
            })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {};
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("Login success")
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    }else{
                        resolve({passErr:true})
                    }
                })
            }else{
                resolve({userError:true})
            }
        })
    },
    getAllUser:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    getUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:new ObjectId(userId)}).then((user)=>{
                resolve(user)
            })
        })
    
    },
}
