const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");
const User = require("../models/user")
const Problem = require("../models/problem")
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo")

const createProblem = async (req,res)=>{
    

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;


    try{
       
      for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);
        // console.log(submitResult);
        // console.log(submitResult);
        const resultToken = submitResult.map((value)=> value.token);

        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
       const testResult = await submitToken(resultToken);

      //  console.log(testResult);

       for(const test of testResult){
        console.log(test);

    if (test.status_id !== 3) {
        return res.status(400).json({
            status: test.status,
            stderr: test.stderr,
            compile_output: test.compile_output,
            message: test.message,
            stdout: test.stdout,
        });
    }
       }

      }


      // We can store it in our DB

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch (err) {
    console.log(err.response?.data);
}
}

const updateProblem = async (req,res)=>{
    
  const {id} = req.params;
  const {title,description,difficulty,tags,
    visibleTestCases,hiddenTestCases,startCode,
    referenceSolution, problemCreator
   } = req.body;

  try{

     if(!id){
      return res.status(400).send("Missing ID Field");
     }

    const DsaProblem =  await Problem.findById(id);
    if(!DsaProblem)
    {
      return res.status(404).send("ID is not persent in server");
    }
      
    for(const {language,completeCode} of referenceSolution){
         

      // source_code:
      // language_id:
      // stdin: 
      // expectedOutput:

      const languageId = getLanguageById(language);
        
      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase)=>({
          source_code:completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output
      }));


      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value)=> value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
      
     const testResult = await submitToken(resultToken);

    //  console.log(testResult);

     for(const test of testResult){
      if(test.status_id!=3){
       return res.status(400).send("Error Occured");
      }
     }

    }


  const newProblem = await Problem.findByIdAndUpdate(id , {...req.body}, {runValidators:true, new:true});
   
  res.status(200).send(newProblem);
  }
  catch(err){
      res.status(500).send("Error: "+err);
  }
}

const deleteProblem = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

   const deletedProblem = await Problem.findByIdAndDelete(id);

   if(!deletedProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send("Successfully Deleted");
  }
  catch(err){
     
    res.status(500).send("Error: "+err);
  }
}


const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode');

   if(!getProblem)
    return res.status(404).send("Problem is Missing");
   const videos = await SolutionVideo.findOne({problemId:id});

   if(videos){   
    
   const responseData = {
    ...getProblem.toObject(),
    secureUrl:videos.secureUrl,
    thumbnailUrl : videos.thumbnailUrl,
    duration : videos.duration,
    textEditorial: videos.textEditorial
   } 
   return res.status(200).send(responseData);
  }
   res.status(200).send(getProblem);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
        message: err.message,
        stack: err.stack
    });
}
}

const getAllProblem = async(req,res)=>{

  try{
     
    const getProblem = await Problem.find({}).select('_id title difficulty tags');

   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

// const solvedAllProblembyUser = async(req,res)=>{
//   try{
//     // const count = req.result.problemSolved.length;
//     // res.status(200).send({count});
//     const userId = req.user._id;
//     const user = await User.findById(userId).populate('problemSolved', '_id title difficulty tags');
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     const solvedProblems = user.problemSolved;
//     res.status(200).send(solvedProblems);
//   }
//   catch (err) {
//     console.error(err);   // <-- Print full error in terminal
//     res.status(500).send(err.message);
// }
// }
const solvedAllProblembyUser = async (req, res) => {
    try {
        // console.log("req.user:", req.user);

        const userId = req.user._id;
        // console.log("userId:", userId);

        const user = await User.findById(userId)
            .populate("problemSolved", "_id title difficulty tags");

        // console.log("user:", user);

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).send(user.problemSolved);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};


const submittedProblem = async(req,res)=>{
  try{
    const userId = req.user._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({ userId, problemId });
    if(ans.length==0){
      return res.status(404).send("No submissions found");
    }

    res.status(200).send(ans);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}
module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};


