import db from "../db/db.js";

export const signupModel=async(firstName,middleName,lastName,email,hashPassword,profileUrl,role, phone)=>{
    try {
        const [result]= await db.query("Insert into users (first_name,middle_name,last_name,email,password,profile_url,role,phone) values(?,?,?,?,?,?,?,?)",[firstName,middleName,lastName,email,hashPassword,profileUrl,role,phone])
        return result;
    } catch (error) {
        throw new Error(`Error in Signup ${error.message}`)
    }
}

export const userExistModel=async(email)=>{
    try {
        const [result] =await db.query("select * from users where email=?",[email])
        return result
    } catch (error) {
        throw new Error(`Error in getting user by email ${error.message}`)
    }
}


