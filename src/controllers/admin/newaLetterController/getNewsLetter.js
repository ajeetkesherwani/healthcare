const NewsLetter = require("../../../models/newsLetter");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getNewsLetter = catchAsync(async(req, res, next) => {

    const newsLetters = await NewsLetter.find();
    if(!newsLetters){
        return next(new AppError("newsLetters not found", 404));
    }

    res.status(200).json({ status: true, message: "newsLetter found",count: newsLetters.length, data: newsLetters });

});