import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';




export const signin = async (req, res) => {
    
    const {email, password} = req.body;

    try{
    
    const existingUser = await User.findOne({ email });
    
    if(!existingUser) return res.status(404).json({ message: "User doesn't exist."});
    
    
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password); 
    if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credential"});
    

    const token = jwt.sign({ 
        email: existingUser.email, 
        id: existingUser._id }, 
        'test', 
        {expiresIn: "1h"} ); 

        res.status(200).json({ result: existingUser, token }); 
    
    }catch (error) {
    
    res.status(500).json({ message: 'Something went wrong.' });

 }
}

    export const signup =  async (req, res) => {

        const { email, password, confirmPassword, firstName, lastName} = req.body;
        
    try {
        
        const existingUser = await User.findOne({ email });
        
        if(existingUser) return res.status(400).json({ message: "User already exists."});
        
        if(password !== confirmPassword) return res.status(400).json({ message: "password dont match."});
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
        
        const token = jwt.sign({ email: result.email, id: result.id }, 'test',{expiresIn: "1h"});
        
        res.status(200).json({ result, token });
    } catch (error){
            res.status(500).json({ message: 'Something went wrong.' });
    }
}   


//get a user details bug sending password also
  export const getUser = async (req, res) => { 
    const { userId } = req.params;
    //console.log(userId);
    
    try {
        const getUser = await User.findById(userId);
        //console.log(getUser);
        res.status(200).json(getUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//get al user details bug sending password also for searching purpose
export const getAllUserBySearch = async (req, res) => { 
    const { userId } = req.params;
    //console.log(userId);
    
    try {
        const getUser = await User.find({name:{'$regex' : userId, '$options' : 'i'}}); 
        //console.log(getUser);
        res.status(200).json(getUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const googleAuth =  async (req, res) => {

    const { email, name } = req.body;
    
try {
    
    const existingUser = await User.findOne({ email });
    
    if(existingUser)
    {
        const token = jwt.sign({ 
            email: existingUser.email, 
            id: existingUser._id }, 
            'test', 
            {expiresIn: "1h"} ); 
    
            return res.status(200).json({ result: existingUser, token }); 
    }

    const hashedPassword = await bcrypt.hash("googlePassword@^0991", 12);
    
    const result = await User.create({ email, password: hashedPassword, name});
    
    const token = jwt.sign({ email: result.email, id: result.id }, 'test',{expiresIn: "1h"});
    
    res.status(200).json({ result, token });
} catch (error){
        res.status(500).json({ message: 'Something went wrong.' });
}
}   