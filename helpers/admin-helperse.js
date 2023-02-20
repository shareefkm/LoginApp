const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId;

module.exports={
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let logAdmin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({username:adminData.username})
            if(logAdmin){
                bcrypt.compare(adminData.password,logAdmin.password).then((status)=>{
                    if(status){
                        response.admin = logAdmin
                        response.status = true
                        resolve(response)
                    }else{ 
                        resolve({adminPass:true})
                    }
                })
            }else{
                resolve({adminName:true})
            }
        })
    },
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:new ObjectId(userId)}).then((response)=>{
                resolve(response)
            })
        })
       
        },
        editUser:(userId,userDetail)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:new ObjectId(userId)},{
                    $set:{
                        username:userDetail.username,
                        email:userDetail.email,
                    }
                }).then((response)=>{
                    resolve()
                })
            })
        }
}