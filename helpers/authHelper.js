import bcrypt from 'bcrypt'

// hashing password while registering
export const hashPassword = async (password)=>{
    try{
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password,salt);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
}

//comparing password
export const comparePassword = async(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword);
}