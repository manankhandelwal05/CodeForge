const mongoose = require('mongoose');
const {Schema} = mongoose;

const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true,
    },
    tags:{
        type:[String],
        enum: [
  "array",
  "string",
  "math",
  "sorting",
  "searching",
  "binary Search",
  "greedy",
  "stack",
  "queue",
  "linkedList",
  "tree",
  "binaryTree",
  "bst",
  "heap",
  "graph",
  "dfs",
  "bfs",
  "backtracking",
  "recursion",
  "dp",
  "bitManipulation",
  "twoPointers",
  "slidingWindow",
  "hashing",
  "implementation",
  "dynamic programming",
  "two pointers"
],
        required:true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],

    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],

    startCode: [
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],

    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],

    problemCreator:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
})


const Problem = mongoose.model('problem',problemSchema);

module.exports = Problem;




// const referenceSolution = [
//     {
//         language:"c++",
//         completeCode:"C++ Code"
//     },
//     {
//         language:"java",
//         completeCode:"java Code"
//     },
//     {
//         language:"js",
//         completeCode:"JS Code"
//     },
// ]