const express = require("express");
const router = new express.Router();
const otpGenerator = require('otp-generator');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const JWTStrategry = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/userRegistrationModel");
const Notification=require("../models/notification");
const fs = require("fs");
const app = express();
const { smsSend, sendMail, upload } = require("../services/service");
app.use(passport.initialize());


const params = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secrectOrKey: "jwtsecret536372826"
}
const jwtExpirySeconds = 300;

// let strategy = new JWTStrategry(params,function(token,done){
//     console.log("In JWTStrategy",token);
//     let emp1 = employees.find(e1=>e1.empCode=== +token.empCode);
//     console.log("employee",emp1);
//     if(!emp1)
//     return done(null,false,{message:"Incorrect empCode or name"});
//     else return done(null,user);
// });

router.post("/userRegistration", async (req, res) => {
    try {
        let body = req.body;
        let bool = false;
        let existUser1 = await UserModel.findOne({ contact: body.contact });
        let existUser2 = await UserModel.findOne({ email: body.email });
        if (existUser1 || existUser2) {
            res.json({ status: false, msg: "Email or phone already exists" });
        } else {
            let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            let obj = { ...body, otp: otp };
            let user = new UserModel(obj);
            let user1 = await user.save();
            smsSend(otp, body.contact);
            sendMail(body.email,body.password,bool);
            let notify=new Notification({name:body.name,category:"USER",id:user1._id,title:"New user registered"});
            await notify.save();
            res.json({ status: true, msg: "Registration successful" });
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/serviceCenterRegistration", upload().single("document"), async (req, res) => {
    try {
        let body = req.body;
        let bool = false;
        let existUser1 = await UserModel.findOne({ contact: body.contact });
        let existUser2 = await UserModel.findOne({ email: body.email });
        if (existUser1 || existUser2) {
            res.json({ status: false, msg: "Email or phone already exists" });
        } else {
            let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            let obj = { ...body, document: req.file.location, otp: otp };
            let user = new UserModel(obj);
            let user1 = await user.save();
            smsSend(otp, body.contact);
             sendMail(body.email,body.password,bool);
            let notify=new Notification({name:body.name,category:"USER",id:user1._id,title:"New Reseller registered"});
            await notify.save();
            res.json({ status: true, msg: "Registration successful" });
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/userLogin", async (req, res) => {
    try {
        let body = req.body;
        let checkUser = await UserModel.findOne({ email: body.email, password: body.password });
        if (checkUser) {
            let payload = { _id: checkUser._id };
            let token = jwt.sign(payload, params.secrectOrKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds
            })
            if (checkUser.status === "INACTIVE") {
                let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                await UserModel.findByIdAndUpdate({ _id: checkUser._id }, { otp: otp });
                smsSend(otp, checkUser.contact);
            }
            res.json({ status: true, user: checkUser, msg: "Logged In successfully", token: "bearer " + token });
        } else {
            res.json({ status: false, msg: "Incorrect Username and Password" });
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post("/userPhoneLogin", async (req, res) => {
    try {
        let body = req.body;
        let checkUser = await UserModel.findOne({ contact: body.contact });
        if (checkUser) {
            let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            await UserModel.findByIdAndUpdate({ _id: checkUser._id }, { otp: otp });
            smsSend(otp, checkUser.contact);
            res.json({ status: true, msg: "success" });
        } else {
            res.json({ status: false, msg: "Incorrect Phone number" });
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get("/userDetail/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let user = await UserModel.findById(_id).select("_id name email address address2 pin state city contact discountPercentage image role document discount createdAt");
        res.send(user);
    } catch (err) {
        res.status(404).send(err);
    }
})

router.get("/allUserDetail/", async (req, res) => {
    try {
        let user = await UserModel.find({}).select("_id name role document discountPercentage image discount email contact createdAt");
        res.send(user);
    } catch (err) {
        res.status(404).send(err);
    }
})

router.patch("/updateUserDetail/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let user = await UserModel.findByIdAndUpdate(_id, req.body);
        res.json({ status: true, msg: "Updated" });
    } catch (err) {
        res.status(500).send(err);
    }
})

router.patch("/uploadUserImage/:id", upload().single("image"), async (req, res) => {
    try {
        let _id = req.params.id;
        let file = req.file.location;
        let user = await UserModel.findByIdAndUpdate(_id, { image: file });
        res.json({ status: true, msg: "Uploaded" });
    } catch (err) {
        res.status(500).send(err);
    }
})

router.patch("/otpVerification", async (req, res) => {
    try {
        let body = req.body;
        let user = await UserModel.findOne({ email: body.email, otp: body.otp });
        if (user) {
            let user1 = await UserModel.findByIdAndUpdate({ _id: user._id }, { status: "ACTIVE" });
            res.json({ status: true, msg: "Verified" });
        } else {
            res.send({ status: false, msg: "Incorrect OTP" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/otpPhoneVerification", async (req, res) => {
    try {
        let body = req.body;
        let user = await UserModel.findOne({ contact: body.contact, otp: body.otp });
        if (user) {
            let payload = { _id: user._id };
            let token = jwt.sign(payload, params.secrectOrKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds
            })
            res.json({ status: true, user: user, msg: "Logged in successful", token: token });
        } else {
            res.send({ status: false, msg: "Incorrect OTP" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/resendOtp", async (req, res) => {
    try {
        let body = req.body;
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        let user = await UserModel.findOneAndUpdate({ email: body.email }, { otp: otp });
        if (user) {
            smsSend(otp, user.contact);
            res.json({ status: true, msg: "OTP sent" });
        } else {
            res.json({ status: false, msg: "Something went wrong!" });
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch("/forgetPassword", async (req, res) => {
    try {
        let body = req.body;
        let bool = true;
        let user = await UserModel.findOneAndUpdate({ email: body.email }, { password: body.password });
        if (user) {
            res.json({ status: true, msg: "Password changed successfully!" });
             sendMail(body.email,body.password,bool);
        } else {
            res.json({ status: false, msg: "Something went wrong!" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

router.patch("/verifyReseller/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let user = await UserModel.findByIdAndUpdate(_id, body,{new:true});
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.patch("/notVerifyReseller/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let user = await UserModel.findByIdAndUpdate(_id, body);
        res.send("Not Verified");
    } catch (err) {
        res.status(500).send(err);
    }
})

router.post("/uploadLogo", upload().single("image"), async (req, res) => {
    let file = req.file.location;
    res.send(file);
})

router.get("/visitors", function (req, res) {
    if (req.url === '/favicon.ico') {
        res.end();
    }
    const json = fs.readFileSync('count.json', 'utf-8');
    const obj = JSON.parse(json);
    obj.pageviews = obj.pageviews + 1;
    if (req.query.type === 'visit-pageview') {
        obj.visits = obj.visits + 1;
    }
    const newJSON = JSON.stringify(obj);
    fs.writeFileSync('count.json', newJSON);
    res.send(newJSON);
});

module.exports = router;