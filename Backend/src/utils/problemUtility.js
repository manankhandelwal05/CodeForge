const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "cpp":54,
        "c++":54,
        "C++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{


// const options = {
//   method: 'POST',
//   url: 'http://ce.judge0.com',
//   params: {
//     base64_encoded: 'false'
//   },
//   headers: {
//     'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
// import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '09dc024208msh091100cd53784d0p10bb49jsn0897adf1131c',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
    console.error("Judge0 Error:");
    // console.error(error.response?.data || error.message);
    throw error;
}
}

 return await fetchData();

}


// const waiting = async(timer)=>{
//   setTimeout(()=>{
//     return 1;
//   },timer);
// }
const waiting = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

// const submitToken = async(resultToken)=>{

// // const options = {
// //   method: 'GET',
// //   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
// //   params: {
// //     tokens: resultToken.join(","),
// //     base64_encoded: 'false',
// //     fields: '*'
// //   },
// //   headers: {
// //     'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
// //     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
// //   }
// // };
// const options = {
//   method: 'GET',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     tokens: 'dce7bbc5-a8c9-4159-a28f-ac264e48c371,1ed737ca-ee34-454d-a06f-bbc73836473e,9670af73-519f-4136-869c-340086d406db',
//     base64_encoded: 'false',
//     fields: '*'
//   },
//   headers: {
//     'x-rapidapi-key': '09dc024208msh091100cd53784d0p10bb49jsn0897adf1131c',
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data;
// 	} catch (error) {
// 		console.error(error);
// 	}
// }


//  while(true){

//  const result =  await fetchData();
// console.log(JSON.stringify(result, null, 2));
//   const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

//   if(IsResultObtained)
//     return result.submissions;

  
//   await waiting(1000);
// }



// }
const submitToken = async (resultToken) => {

    const options = {
        method: "GET",
        url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
        params: {
            tokens: resultToken.join(","),
            base64_encoded: "false",
            fields: "*"
        },
        headers: {
            "x-rapidapi-key": "09dc024208msh091100cd53784d0p10bb49jsn0897adf1131c",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
        }
    };

    while (true) {

        const response = await axios.request(options);

        // console.log(JSON.stringify(response.data, null, 2));

        const submissions = response.data.submissions;

        const done = submissions.every((submission) => {

            if (!submission) return false;

            if (submission.status)
                return submission.status.id > 2;

            return submission.status_id > 2;
        });

        if (done)
            return submissions;

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};


module.exports = {getLanguageById,submitBatch,submitToken};








// // 



// const axios = require('axios');

// // 1. Updated Base URL to the free Community Edition
// const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/about";

// const getLanguageById = (lang) => {
//     const language = {
//         "c": 50,
//         "c++": 54,
//         "java": 62,
//         "javascript": 102,
//         "python": 71
//     };
//     return language[lang.toLowerCase()];
// };

// const submitBatch = async (submissions) => {
//     // Note: 'base64_encoded' is false because you said you are NOT encoding data
//     const options = {
//         method: 'POST',
//         url: `${JUDGE0_URL}/submissions/batch`,
//         params: { base64_encoded: 'false' }, 
//         headers: { 'Content-Type': 'application/json' }, // NO RapidAPI keys needed
//         data: { submissions }
//     };

//     try {
//         const response = await axios.request(options);
//         // Returns an array of tokens: [{token: "..."}, {token: "..."}]
//         return response.data; 
//     } catch (error) {
//     console.error("Submission Error:", error.response?.data || error.message);
//     throw error;
// }
// };

// // 2. FIXED: Real waiting function using a Promise
// const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // const submitToken = async (resultTokens) => {
// //     // Extract tokens from the array of objects if necessary
// //     const tokenString = resultTokens.map(t => t.token).join(",");

// //     const options = {
// //         method: 'GET',
// //         url: `${JUDGE0_URL}/submissions/batch`,
// //         params: {
// //             tokens: tokenString,
// //             base64_encoded: 'false',
// //             fields: 'stdout,stderr,status_id,status,compile_output'
// //         }
// //     };

// //     while (true) {
// //         try {
// //             const response = await axios.request(options);
// //             const results = response.data.submissions;

// //             // status_id < 3 means "In Queue" or "Processing"
// //             const isFinished = results.every((r) => r.status_id > 2);

// //             if (isFinished) {
// //                 return results;
// //             }

// //             console.log("Still processing... waiting 1 second");
// //             await waiting(1000); // Now this actually waits
// //         } catch (error) {
// //             console.error("Polling Error:", error.response?.data || error.message);
// //             break;
// //         }
// //     }
// // };
// const submitToken = async (resultTokens) => {

//     // resultTokens is already an array of strings
//     // Example:
//     // ["2257b7c7-ded9-4d5c-bd32-c05e27c0ef73"]

//     const tokenString = resultTokens.join(",");

//     const options = {
//         method: "GET",
//         url: `${JUDGE0_URL}/submissions/batch`,
//         params: {
//             tokens: tokenString,
//             base64_encoded: "false",
//             fields: "stdout,stderr,status_id,status,compile_output"
//         }
//     };

//     while (true) {
//         try {
//             const response = await axios.request(options);
//             const results = response.data.submissions;

//             const isFinished = results.every(
//                 (result) => result.status.id > 2
//             );

//             if (isFinished) {
//                 return results;
//             }

//             console.log("Still processing...");
//             await waiting(1000);

//         } catch (error) {
//             console.error(
//                 "Polling Error:",
//                 error.response?.data || error.message
//             );
//             throw error;
//         }
//     }
// };

// module.exports = { getLanguageById, submitBatch, submitToken };