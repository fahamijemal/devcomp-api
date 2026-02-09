const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course')
const { Query } = require('mongoose')
const Bootcamp = require('../models/Bootcamp')


//@desc Get all courses
//@route GET /api/v1/courses
//@access Public
exports.getCourses=asyncHandler(async(req,res,next)=>{
    if(req.params.bootcampId){
        const courses= await Course.find({bootcamp:req.params.bootcampId})

        res.status(200).json({
            success:true,
            count:courses.length,
            data:courses
        })
    }else{
        res.status(200).json(res.advancedResults);
    }
});

//@desc Get single course
//@route GET /api/v1/courses/:id
//@access Public
exports.getCourse=asyncHandler(async(req,res,next)=>{
    //Populate bootcamp details
    const course=await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    });
    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`,404))
    }
    res.status(200).json({
        success:true,
        data:course
    })  

});

//@desc Create new course
//@route POST /api/v1/bootcamps/:bootcampId/courses
//@access Private
exports.addCourse=asyncHandler(async(req,res,next)=>{
    //Add bootcamp to req.body
    req.body.bootcamp=req.params.bootcampId;

    //Find bootcamp
    const bootcamp=await Bootcamp.findById(req.params.bootcampId);

    //Check for bootcamp
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`,404))
    }
    //Create course
    const course=await Course.create(req.body);
    
    res.status(201).json({
        success:true,
        data:course
    })  
});

//@desc Update course
//@route PUT /api/v1/courses/:id
//@access Private
exports.updateCourse=asyncHandler(async(req,res,next)=>{
    let course=await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404)
    }
    
    course=await Course.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        success:true,
        data:course
    })  
});

//@desc Delete course
//@route DELETE /api/v1/courses/:id
//@access Private
exports.deleteCourse=asyncHandler(async(req,res,next)=>{
    const course=await Course.findById(req.params.id);
    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404)
    }
    await course.deleteOne();
    res.status(200).json({
        success:true,
        data:{}
    })  
});

//@desc Get courses within a radius
//@route GET /api/v1/courses/radius/:zipcode/:distance
//@access Private
exports.getCoursesInRadius=asyncHandler(async(req,res,next)=>{
    const {zipcode,distance}=req.params;

    //Get lat/lng from geocoder
    const loc=await geocoder.geocode(zipcode);
    const lat=loc[0].latitude;
    const lng=loc[0].longitude;

    //Calc radius using radians
    //Divide distance by radius of Earth
    //Earth Radius=3,963 mi / 6,378 km
    const radius=distance/3963;

    const courses=await Course.find({
        location:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
    });

    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })  
});