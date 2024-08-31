const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken.js");
const User = require("../models/userModel.js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user){
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id)
    })
  } else{
    rea.status(400)
    throw new Error('Failed to create the user')
  }

});


const authUser= asyncHandler(async (req, res) => {
    const {email, password}= req.body;

    const user= await User.findOne({email})

    if (user && (await user.comparePassword(password))){
      res.json({
        _id: user._id,
        name: user.name,
        email:user.email,
        token: generateToken(user._id)
      })
    } else{
      res.status(401)
      throw new Error('Invalid Email or password')
    }

})



const allUsers= asyncHandler(async (req, res) => {

  console.log('Route hit, query:', req.query.search);


  // taking the query from the params  like /api/user?search  taking this search
  const keyword= req.query.search 
  ? {
    $or: [
      // options "i" make it none case sensitive
      {name: {$regex: req.query.search,  $options: "i"}},
      {email: {$regex: req.query.search, $options: "i"}},
    ],
  } :{};

  // this will search the available user on the basis of search result and
  // will not include the current user who is searching.
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });


  res.json(users); // Send the result as a response
  // res.json({ success: true, query: req.query }); // Send a simple response


})

module.exports= {registerUser, authUser, allUsers}