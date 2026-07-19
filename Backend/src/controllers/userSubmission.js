const Problem = require("../models/problem");
const Submission = require("../models/submission");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const submitCode = async (req,res)=>{
    try{
        const userId = req.user._id;
        const problemId = req.params.id;
        let {code,language} = req.body;

         if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some field missing");
         
         if(language==='cpp') language = 'c++';  

         const problem =  await Problem.findById(problemId);

         const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })
        const languageId = getLanguageById(language);

        const submissions = problem.hiddenTestCases.map((testcase)=>({
        source_code:code,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
    }));

    // const submitResult = await submitBatch(submissions);
    const submitResult = await submitBatch(submissions);

    // console.log("submitResult:", submitResult);
    // console.log(problem);
    const resultToken = submitResult.map((value)=> value.token);
    
    const testResult = await submitToken(resultToken);
    // console.log(problem.hiddenTestCases);
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;


    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = 'error'
            errorMessage = test.stderr
          }
          else{
            status = 'wrong'
            errorMessage = test.stderr
          }
        }
    }


    // Store the result in Database in Submission
    submittedResult.status   = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();
    if(!req.user.problemSolved.includes(problemId)){
      req.user.problemSolved.push(problemId);
      await req.user.save();
    }
    res.status(201).send(submittedResult);
    }
    catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error: " + err.message);
}
}

const runCode = async (req,res)=>{
    try{
        const userId = req.user._id;
        const problemId = req.params.id;
        const {code,language} = req.body;

         if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some field missing");

         const problem =  await Problem.findById(problemId);

         
        const languageId = getLanguageById(language);

        const submissions = problem.visibleTestCases.map((testcase)=>({
        source_code:code,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
    }));

    // const submitResult = await submitBatch(submissions);
    // console.log(JSON.stringify(submissions, null, 2));
    const submitResult = await submitBatch(submissions);

    // console.log("submitResult:", submitResult);
    // console.log(problem);
    const resultToken = submitResult.map((value)=> value.token);
    
    
    // Store the result in Database in Submission
    //  const testResult = await submitToken(resultToken);
    // res.status(201).send(testResult);
    const testResult = await submitToken(resultToken);

const formattedResult = {
    success: testResult.every(tc => tc.status.id === 3),
    runtime: Math.max(...testResult.map(tc => Number(tc.time || 0))),
    memory: Math.max(...testResult.map(tc => tc.memory || 0)),
    testCases: testResult.map(tc => ({
        stdin: tc.stdin,
        expected_output: tc.expected_output,
        stdout: tc.stdout,
        status_id: tc.status.id,
        status: tc.status.description,
        compile_output: tc.compile_output,
        stderr: tc.stderr,
        time: tc.time,
        memory: tc.memory
    }))
};

return res.status(200).json(formattedResult);
    console.log("Sending to frontend:");
// console.log(testResult);
    }
    catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error: " + err.message);
}
}
module.exports = {submitCode,runCode};
