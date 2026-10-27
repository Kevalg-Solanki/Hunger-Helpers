//Models
const DonationBoxModel = "../models/Donation_Box.js"


export const timeOuts = async ()=>{

    const now = new Date();

    const result = await DonationBoxModel.updateMany(
        {
            food_expireAt:{$lt:now},
            status:{$ne:"Expired"}
        },
        {
            $set:{status:"Expired"}
        }
    );
}