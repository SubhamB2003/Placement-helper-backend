import mongoose from "mongoose";

const DB = () => mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DB successfully connected :)");
}).catch((err) => {
    console.log("Not Connected :(", err);
})
mongoose.set('strictQuery', true);

export default DB;